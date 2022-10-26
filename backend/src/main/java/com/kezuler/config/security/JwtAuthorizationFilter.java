package com.kezuler.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.kezuler.common.AppProperties;
import com.kezuler.domain.Account;
import com.kezuler.domain.Token;
import com.kezuler.exception.CustomException;
import com.kezuler.exception.ExceptionCode;
import com.kezuler.repository.AccountRepository;
import com.kezuler.repository.TokenRepository;
import com.kezuler.utility.HttpClient;
import com.kezuler.utility.HttpResult;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Slf4j
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private AccountRepository accountRepository;
    private AppProperties app;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, AccountRepository accountRepository, AppProperties appProperties) {
        super(authenticationManager);
        this.accountRepository = accountRepository;
        this.app = appProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
//        log.info(" Enter -> [ JwtAuthorizationFilter doFilterInternal ] : {}", request.getRequestURL().toString());
        // Authorization 으로 들어오는것이 있는지 확인 , 있으면 진행 없으면 { "result": "fail"}
        String header = request.getHeader("Authorization");
        if(header == null || !header.startsWith("Bearer ")) {
//            log.info(" Enter -> [ JwtAuthorizationFilter doFilterInternal ] > not found Autorization");
            response.setStatus(403);
            response.setContentType("application/json");
            response.getWriter().write("{\"result\":\"A token is required\"}");
            return;
        }
//        // token 유효성 검증
        String username = null;
        try {
            String token = request.getHeader(app.getJwtHeader()).replace(app.getJwtPrifix(), "");
            // jwt.require 로 만들어진 token과 들어온 token을 verity(decode)해서
            username = JWT.require(Algorithm.HMAC512(app.getJwtSecret())).build().verify(token)
                    .getClaim("username").asString();
        } catch (TokenExpiredException e) {
//            log.info("::: TokenExpiredException");
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write("{\"result\":\"expired token\"}");
            return;
        } catch (RuntimeException e) {
//            log.info("::: runtimeExcepiton");
            response.setStatus(403);
            response.setContentType("application/json");
            response.getWriter().write("{\"result\":\"Invalid token\"}");
            return;
        }

        if(username != null) {
            Optional<Account> byKakaoId = accountRepository.findByKakaoId(username);
            if (byKakaoId.isPresent()) {
                UserDetailsImpl userDetails = new UserDetailsImpl(byKakaoId.get());
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                chain.doFilter(request, response);
            } else {
                response.setStatus(403);
                response.setContentType("application/json");
                response.getWriter().write("{\"result\":\"failed Authorization\"}");
                return;
            }
        }

    }
}
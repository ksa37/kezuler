package com.kezuler.api;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.kezuler.common.AppProperties;
import com.kezuler.common.ResponseSet;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.Account;
import com.kezuler.domain.GoogleCalendar;
import com.kezuler.dto.AccountDto;
import com.kezuler.dto.TokenDto;
import com.kezuler.exception.CustomException;
import com.kezuler.exception.ExceptionCode;
import com.kezuler.repository.AccountRepository;
import com.kezuler.service.AuthService;
import com.kezuler.service.MessageService;
import com.kezuler.utility.HttpClient;
import com.kezuler.utility.HttpResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AppProperties app;
    private final AccountRepository accountRepository;
    private final AuthService authService;
    private final MessageService messageService;


    // 카카오 로그인 버튼 클릭시 진행
    @PostMapping("/auth/token")
    public ResponseEntity<ResponseSet> auth(HttpServletRequest request,
                                            @RequestBody Map<String, String> provider) {
        log.info(" Enter -> [ AuthController /auth ] ");

        String value = provider.get("registerWith");
        String timezone = provider.getOrDefault("timezone", "Asia/Seoul");
        log.info(" ::::::::::::::: {} , {}", value, timezone);

        String header = request.getHeader(app.getJwtHeader());
        if (header == null || !header.startsWith(app.getJwtPrifix()) || !value.equals("kakao")) {
            // 에러
            throw new CustomException(ExceptionCode.UNABLE_TO_LOGIN.getCode(), ExceptionCode.UNABLE_TO_LOGIN.getMessage());
        } else {
            //파싱해서 kakao 로 api 요청
            String authKey = request.getHeader(app.getJwtHeader());
            log.info("authKey: {}", authKey);

            HttpResult objects = HttpClient.getWithAuthorize(app.getKakaoApiUri() + "/user/me", authKey);
            JSONObject resultObj = new JSONObject(objects.getData());
            log.info("resultObject: {}", resultObj);

            String kakaoId = String.valueOf(resultObj.get("id"));
            Optional<Account> byKakaoId = accountRepository.findByKakaoId(kakaoId);

            Account account = null;
            if (byKakaoId.isPresent()) {
                log.info(" -> [ AuthController /auth/start  :: login process] ");
                account = byKakaoId.get();

            } else {
                log.info(" -> [ AuthController /auth/start  :: join process] ");
                // 회원 정보 저장
                account = authService.joinKezuler(resultObj, timezone);
            }


            authService.createNewToken(account);

            AccountDto.Get get = authService.getUser(new UserDetailsImpl(account));

            ResponseSet responseSet = new ResponseSet(get);
            return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
        }

    }


    // 프론트 없을 때 테스트 코드
    @GetMapping("/auth/start")
    public ResponseEntity<ResponseSet> loginByKakao(@RequestParam("code") String token,
                                                    HttpServletRequest request) throws JSONException {

        log.info(" Enter -> [ AuthController @GET /auth/start ] ");
        String clientId = app.getKakaoAppkey();
        String redirectUri = app.getHost() + "/auth/start";
//        String redirectUri = "http://54.180.134.149:8082/auth/start";
//        String redirectUri = "https://kezuler.com/auth/start";

        HttpResult result = HttpClient.post(app.getKakaoAccessTokenUri(), "grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&code=" + token);
        log.info("result.getData(): {}", result.getData());
        JSONObject tokenObj = new JSONObject(result.getData());
        String authKey = app.getJwtPrifix() + tokenObj.getString("access_token");

        HttpResult objects = HttpClient.getWithAuthorize(app.getKakaoApiUri() + "/user/me", authKey);
        JSONObject resultObj = new JSONObject(objects.getData());
        log.info("resultObject: {}", resultObj);

        String kakaoId = String.valueOf(resultObj.get("id"));
        Optional<Account> byKakaoId = accountRepository.findByKakaoId(kakaoId);

        Account account = null;
        if (byKakaoId.isPresent()) {
            log.info(" -> [ AuthController @GET /auth/start  :: login process] ");
            account = byKakaoId.get();

        } else {
            log.info(" -> [ AuthController @GET /auth/start  :: join process] ");
            account = authService.joinKezuler(resultObj, "Asia/Seoul");
        }

        authService.createNewToken(account);

        AccountDto.Get get = authService.getUser(new UserDetailsImpl(account));

        ResponseSet responseSet = new ResponseSet(get);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<ResponseSet> getAccount(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                 HttpServletRequest request) {
        log.info(" Enter -> [ AuthController @GET /user ] {}", userDetails.getAccount().getName());
        AccountDto.Get user = authService.getUser(userDetails);
        ResponseSet responseSet = new ResponseSet(user);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @PatchMapping("/user")
    public ResponseEntity<ResponseSet> updateUser(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                  @Valid AccountDto.Update accountDto) throws IOException {
        log.info(" Enter -> [ AuthController @Patch /user ] {}", userDetails.getAccount().getName());

        log.info("::::::::::::::getOriginalFilename : {}", accountDto.getProfile().getOriginalFilename());
        log.info("::::::::::::::getInputStream : {}", accountDto.getProfile().getInputStream());
        log.info("::::::::::::::getContentType : {}", accountDto.getProfile().getContentType());
        log.info("::::::::::::::getName : {}", accountDto.getProfile().getName());
        log.info("::::::::::::::getSize : {}", accountDto.getProfile().getSize());
        log.info("::::::::::::::getResource : {}", accountDto.getProfile().getResource());

        AccountDto.Get outputDto = authService.updateUser(userDetails, accountDto);
        ResponseSet responseSet = new ResponseSet(outputDto);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @DeleteMapping("/user/profile")
    public ResponseEntity<ResponseSet> deleteUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info(" Enter -> [ AuthController @Delete /user/profile ] {}", userDetails.getAccount().getName());
        // 삭제 이후 카카오 연결 끊기
        AccountDto.Get get = authService.deleteProfile(userDetails);
        ResponseSet responseSet = new ResponseSet(get);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @DeleteMapping("/user")
    public ResponseEntity<ResponseSet> deleteUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info(" Enter -> [ AuthController @Delete /user ] {}", userDetails.getAccount().getName());
        // 삭제 이후 카카오 연결 끊기
        authService.deleteUser(userDetails);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }


//    @PatchMapping("/user/google")
//    public ResponseEntity<ResponseSet> updateUserGoogleToggle(@AuthenticationPrincipal UserDetailsImpl userDetails,
//                                                              @RequestBody @Valid AccountDto.UpdateGoogleToggle accountDto) {
//        log.info(" Enter -> [ AuthController @Patch /user/google ] {}", accountDto.isGoogleToggle());
//        AccountDto.Get get = authService.updateGoogleToggle(userDetails, accountDto.isGoogleToggle());
//        ResponseSet responseSet = new ResponseSet(get);
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
//    }

    @PatchMapping("/user/timezone")
    public ResponseEntity<ResponseSet> updateUserTimezone(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                          @RequestBody @Valid AccountDto.UpdateTimezone accountDto) {
        log.info(" Enter -> [ AuthController @Patch /user/timezone ] {}", accountDto.getTimeZone());
        AccountDto.Get get = authService.updateTimezone(userDetails, accountDto.getTimeZone());
        ResponseSet responseSet = new ResponseSet(get);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }


    // access 재발급, refresh 재발급
    @PostMapping("/auth/re")
    public ResponseEntity<ResponseSet> checkRefreshToken(@RequestHeader(value = "REFRESHTOKEN") String refresh) throws IOException {
        log.info(" refresh : {}", refresh);

        try {
            log.info("enter manageToken");
            TokenDto tokenDto = authService.manageToken(refresh);
            ResponseSet responseSet = new ResponseSet(tokenDto);
            return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
        } catch (TokenExpiredException e) {
            log.info("error 401 TokenExpiredException!! ");
            ResponseSet responseSet = new ResponseSet();
            return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.UNAUTHORIZED);
        }
    }

}

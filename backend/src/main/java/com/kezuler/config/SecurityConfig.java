package com.kezuler.config;

import com.kezuler.common.AppProperties;
import com.kezuler.config.security.JwtAuthorizationFilter;
import com.kezuler.repository.AccountRepository;
import com.kezuler.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final AccountRepository accountRepository;
    private final TokenRepository tokenRepository;
    private final CorsConfig cors;
    private final AppProperties appProperties;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .addFilter(cors.corsFilter())
                .addFilter(new JwtAuthorizationFilter(authenticationManager(authenticationConfiguration), accountRepository, appProperties))
                .authorizeRequests()
                .antMatchers("/auth/**", "/pendingEvents/invitation/**", "/test/**").permitAll()
                .anyRequest().authenticated();
        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().antMatchers("/auth/**", "/pendingEvents/invitation/**", "/test/**");
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception
    {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

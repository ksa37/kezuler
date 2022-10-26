package com.kezuler.config;

import com.kezuler.common.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final AppProperties app;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
//        config.addAllowedOrigin("http://localhost:3000");
//        config.addAllowedOrigin("http://172.30.1.8:3000");
//        config.addAllowedOrigin("http://172.30.1.52:3000");
//        config.addAllowedOrigin("http://kezuler.com");
//        config.addAllowedOrigin("https://d1aq7vfi131rdo.cloudfront.net");
//        config.addAllowedOrigin("https://kezuler.com");
//        config.addAllowedOrigin("http://192.168.0.123:3000");
//        config.addAllowedOrigin("http://192.168.200.157:3000");
//        config.addAllowedOrigin("http://192.168.35.173:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        config.addExposedHeader(app.getJwtHeader());
        config.addExposedHeader("REFRESHTOKEN");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

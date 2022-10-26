package com.kezuler.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties("app")
public class AppProperties {

    private String name;
    private String host;

    private String jwtHeader;
    private String jwtPrifix;
    private String jwtAccessTime;
    private String jwtRefreshTime;
    private String jwtSecret;

    private String kakaoAppkey;
    private String kakaoRequestTokenUri;
    private String kakaoAccessTokenUri;
    private String kakaoApiUri;
    private String kakaoAdminKey;
    private String kakaoCheckUri;

    private String ncpSensHost;
    private String ncpSensPreurl;
    private String ncpSensChannelid;
    private String ncpSensService;
    private String ncpSensAccessKey;
    private String ncpSensSecretKey;

    private String googleCldUri;
    private String googleClientId;
    private String googleClientSecret;
    private String googleRequestTokenUri;
    private String googleAccessTokenUri;
    private String googleAuthenticationUri;
    private String googleRefreshTokenUri;
    private String googleRevokeUri;

}

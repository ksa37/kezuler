package com.kezuler.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDto {

    private String tokenType;
    private String accessToken;
    private Date accessTokenExpiresIn;
    private String refreshToken;
    private Date refreshTokenExpiresIn;

}

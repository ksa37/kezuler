package utils

import "github.com/dgrijalva/jwt-go/v4"

type KakaoOAuthTokenResponse struct {
	TokenType             string `json:"token_type"`
	AccessToken           string `json:"access_token"`
	ExpiresIn             int    `json:"expires_in"`
	RefreshToken          string `json:"refresh_token"`
	RefreshTokenExpiresIn int    `json:"refresh_token_expires_in"`
	Scope                 string `json:"scope"`
}

type AuthTokenClaims struct {
	UserId           string `json:"userId"`
	UserName         string `json:"userName"`
	UserKakaoId      string `json:"userKakaoId"`
	UserPhoneNumber  string `json:"userPhoneNumber"`
	UserProfileImage string `json:"userProfileImage"`
	jwt.StandardClaims
}

type PostUserClaims struct {
	UserId           string `json:"userId"`
	UserName         string `json:"userName"`
	UserKakaoId      string `json:"userKakaoId"`
	UserPhoneNumber  string `json:"userPhoneNumber"`
	UserProfileImage string `json:"userProfileImage"`
	UserToken        struct {
		TokenType             string `json:"tokenType"`
		AccessToken           string `json:"accessToken"`
		AccessTokenExpiresIn  int    `json:"accessTokenExpiresIn"`
		RefreshToken          string `json:"refreshToken"`
		RefreshTokenExpiresIn int    `json:"refreshTokenExpiresIn"`
	} `json:"userToken"`
}

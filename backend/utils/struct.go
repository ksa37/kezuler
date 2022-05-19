package utils

import (
	"github.com/dgrijalva/jwt-go/v4"
	"time"
)

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

type UserToken struct {
	TokenType             string `json:"tokenType"`
	AccessToken           string `json:"accessToken"`
	AccessTokenExpiresIn  int    `json:"accessTokenExpiresIn"`
	RefreshToken          string `json:"refreshToken"`
	RefreshTokenExpiresIn int    `json:"refreshTokenExpiresIn"`
}

type PostUserClaims struct {
	UserId           string    `json:"userId"`
	UserName         string    `json:"userName"`
	UserPhoneNumber  string    `json:"userPhoneNumber"`
	UserProfileImage string    `json:"userProfileImage"`
	UserToken        UserToken `json:"userToken"`
}

type kakaoUserInfo struct {
	Id          int64     `json:"id"`
	ConnectedAt time.Time `json:"connected_at"`
	Properties  struct {
		Nickname       string `json:"nickname"`
		ProfileImage   string `json:"profile_image"`
		ThumbnailImage string `json:"thumbnail_image"`
	} `json:"properties"`
	KakaoAccount struct {
		ProfileNicknameNeedsAgreement bool `json:"profile_nickname_needs_agreement"`
		ProfileImageNeedsAgreement    bool `json:"profile_image_needs_agreement"`
		Profile                       struct {
			Nickname          string `json:"nickname"`
			ThumbnailImageUrl string `json:"thumbnail_image_url"`
			ProfileImageUrl   string `json:"profile_image_url"`
			IsDefaultImage    bool   `json:"is_default_image"`
		} `json:"profile"`
	} `json:"kakao_account"`
}

type T struct {
	UserId        string `json:"userId"`
	PendingEvents []struct {
		EventId           string `json:"eventId"`
		EventTitle        string `json:"eventTitle"`
		EventDescription  string `json:"eventDescription"`
		EventTimeDuration int    `json:"eventTimeDuration"`
		DeclinedUsers     []struct {
			UserId            string `json:"userId"`
			UserProfileImage  string `json:"userProfileImage"`
			UserDeclineReason string `json:"userDeclineReason"`
		} `json:"declinedUsers"`
		EventTimeCandidates []struct {
			eventDate []struct {
				EventStartsAt string `json:"eventStartsAt"`
				PossibleUsers []struct {
					UserId           string `json:"userId"`
					UserProfileImage string `json:"userProfileImage,omitempty"`
					UserImage        string `json:"userImage,omitempty"`
				} `json:"possibleUsers"`
			} `json:"eventDate"`
		} `json:"eventTimeCandidates"`
		EventZoomAddress *string `json:"eventZoomAddress"`
		EventPlace       string  `json:"eventPlace"`
		EventAttachment  string  `json:"eventAttachment"`
	} `json:"pendingEvents"`
}

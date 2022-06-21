package utils

import (
	"github.com/dgrijalva/jwt-go/v4"
)

type unixTime int64

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
	TokenType             string   `json:"tokenType"`
	AccessToken           string   `json:"accessToken"`
	AccessTokenExpiresIn  unixTime `json:"accessTokenExpiresIn"`
	RefreshToken          string   `json:"refreshToken"`
	RefreshTokenExpiresIn unixTime `json:"refreshTokenExpiresIn"`
}

type PatchUserPayload struct {
	Name         string `json:"userName,omitempty" bson:"name,omitempty"`
	ProfileImage string `json:"userProfileImage,omitempty" bson:"profileImage,omitempty"`
	Timezone     string `json:"userTimezone,omitempty" bson:"timezone,omitempty"`
}

type PostUserClaims struct {
	UserId           string    `json:"userId"`
	UserName         string    `json:"userName"`
	UserPhoneNumber  string    `json:"userPhoneNumber"`
	UserProfileImage string    `json:"userProfileImage"`
	UserToken        UserToken `json:"userToken"`
}

type kakaoUserInfo struct {
	Id          int64    `json:"id"`
	ConnectedAt unixTime `json:"connected_at"`
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

type PostFixedEventPayload struct {
	PendingEventId string   `json:"pendingEventId" bson:"pendingEventId"`
	EventTime      unixTime `json:"eventTimeStartsAt" bson:"date"`
}

type PostPendingEventPayload struct {
	EventTitle          string     `json:"eventTitle" bson:"title"`
	EventDescription    string     `json:"eventDescription" bson:"description"`
	EventTimeDuration   int        `json:"eventTimeDuration" bson:"duration"`
	EventTimeCandidates []unixTime `json:"eventTimeCandidates" bson:"eventTimeCandidates"`
	EventZoomAddress    string     `json:"eventZoomAddress" bson:"placeUrl"`
	EventPlace          string     `json:"eventPlace" bson:"placeAddress"`
	EventAttachment     string     `json:"eventAttachment" bson:"attachment"`
}

type EventTimeCandidate struct {
	EventStartsAt unixTime     `json:"eventStartsAt" bson:"eventStartsAt"`
	PossibleUsers []AcceptUser `json:"possibleUsers" bson:"possibleUsers"`
}

type EventTimeCandidateWithInfo struct {
	EventStartsAt unixTime             `json:"eventStartsAt" bson:"eventStartsAt"`
	PossibleUsers []AcceptUserWithInfo `json:"possibleUsers" bson:"possibleUsers"`
}

type AcceptUser struct {
	UserId string `json:"userId" bson:"userId"`
}

type AcceptUserWithInfo struct {
	UserId           string `json:"userId" bson:"userId"`
	UserName         string `json:"userName" bson:"userName"`
	UserProfileImage string `json:"userProfileImage" bson:"userProfileImage"`
}

type DeclineUser struct {
	UserId            string `json:"userId" bson:"userId"`
	UserDeclineReason string `json:"userDeclineReason" bson:"userDeclineReason"`
}

type DeclineUserWithInfo struct {
	UserId            string `json:"userId" bson:"userId"`
	UserName          string `json:"userName" bson:"userName"`
	UserProfileImage  string `json:"userProfileImage" bson:"userProfileImage"`
	UserDeclineReason string `json:"userDeclineReason" bson:"userDeclineReason"`
}

type PatchPendingEventPayload struct {
	EventTitle          string               `json:"eventTitle,omitempty" bson:"title,omitempty"`
	EventDescription    string               `json:"eventDescription,omitempty" bson:"description,omitempty"`
	EventTimeDuration   int                  `json:"eventTimeDuration,omitempty" bson:"duration,omitempty"`
	EventTimeCandidates []EventTimeCandidate `json:"eventTimeCandidates,omitempty" bson:"eventTimeCandidates,omitempty"`
	EventZoomAddress    interface{}          `json:"eventZoomAddress,omitempty" bson:"placeUrl,omitempty"`
	EventPlace          string               `json:"eventPlace,omitempty" bson:"placeAddress,omitempty"`
	EventAttachment     string               `json:"eventAttachment,omitempty" bson:"attachment,omitempty"`
}

type PatchPendingEventCandidatePayload struct {
	AddEventTimeCandidate    []unixTime `json:"addTimeCandidates" bson:"eventTimeCandidates"`
	RemoveEventTimeCandidate []unixTime `json:"removeTimeCandidates" bson:"eventTimeCandidates"`
}

type DeletePendingEventCandidatePayload struct {
	UserDeclineReason string `json:"userDeclineReason" bson:"userDeclineReason"`
}

type PatchFixedEventWithIdPayload struct {
	EventTitle       string `json:"eventTitle,omitempty" bson:"title,omitempty"`
	EventDescription string `json:"eventDescription,omitempty" bson:"description,omitempty"`
}

type PostRemindPayload struct {
	TimeDelta unixTime `json:"timeDelta" bson:"timeDelta"`
}

type PendingEventClaims struct {
	PendingEventId      string                       `json:"eventId" bson:"pendingEventId"`
	Title               string                       `json:"eventTitle" bson:"title"`
	HostUser            PendingEventUserWithInfo     `json:"eventHost" bson:"hostUser"`
	Description         string                       `json:"eventDescription" bson:"description"`
	Duration            int                          `json:"eventTimeDuration" bson:"duration"`
	EventTimeCandidates []EventTimeCandidateWithInfo `json:"eventTimeCandidates" bson:"eventTimeCandidates"`
	DeclinedUsers       []DeclineUserWithInfo        `json:"declinedUsers" bson:"declinedUsers"`
	PlaceAddress        string                       `json:"eventPlace" bson:"placeAddress"`
	PlaceUrl            string                       `json:"eventZoomAddress" bson:"placeUrl"`
	Attachment          string                       `json:"eventAttachment" bson:"attachment"`
}

type FixedEventClaims struct {
	FixedEventId string                   `json:"eventId" bson:"fixedEventId"`
	HostUser     FixedEventUserWithInfo   `json:"eventHost" bson:"hostUser"`
	Title        string                   `json:"eventTitle" bson:"title"`
	Description  string                   `json:"eventDescription" bson:"description"`
	Duration     int                      `json:"eventTimeDuration" bson:"duration"`
	Date         unixTime                 `json:"eventTimeStartsAt" bson:"date"`
	PlaceAddress string                   `json:"eventPlace" bson:"placeAddress"`
	PlaceUrl     string                   `json:"eventZoomAddress" bson:"placeUrl"`
	Attachment   string                   `json:"eventAttachment" bson:"attachment"`
	Participants []FixedEventUserWithInfo `json:"participants" bson:"participants"`
	IsDisabled   bool                     `json:"isDisabled" bson:"isDisabled"`
}

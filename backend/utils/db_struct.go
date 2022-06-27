package utils

type PendingEventUser struct {
	UserId string `json:"userId" bson:"userId"`
}

type PendingEventUserWithInfo struct {
	UserId           string `json:"userId" bson:"userId"`
	UserName         string `json:"userName" bson:"userName"`
	UserProfileImage string `json:"userProfileImage" bson:"userProfileImage"`
}

type FixedEventUser struct {
	UserId     string `json:"userId" bson:"userId"`
	UserStatus string `json:"userStatus" bson:"userStatus"`
}

type FixedEventUserWithInfo struct {
	UserId           string `json:"userId" bson:"userId"`
	UserName         string `json:"userName" bson:"userName"`
	UserProfileImage string `json:"userProfileImage" bson:"userProfileImage"`
	UserStatus       string `json:"userStatus" bson:"userStatus"`
}

type Token struct {
	Type                  string   `json:"tokenType" bson:"type"`
	AccessToken           string   `json:"accessToken" bson:"accessToken"`
	AccessTokenExpiresAt  unixTime `json:"accessTokenExpiresAt" bson:"accessTokenExpiresAt"`
	RefreshToken          string   `json:"refreshToken" bson:"refreshToken"`
	RefreshTokenExpiresAt unixTime `json:"refreshTokenExpiresAt" bson:"refreshTokenExpiresAt"`
}

type User struct {
	UserId           string `json:"userId" bson:"userId"`
	Name             string `json:"userName" bson:"name"`
	Email            string `json:"userEmail" bson:"email"`
	PhoneNumber      string `json:"userPhoneNumber" bson:"phoneNumber"`
	ProfileImage     string `json:"userProfileImage" bson:"profileImage"`
	Timezone         string `json:"userTimezone" bson:"timezone"`
	KakaoId          int    `json:"userKakaoId" bson:"kakaoId"`
	GoogleCalendarId string `json:"userGoogleCalenderId" bson:"googleCalenderId"`
	Token            Token  `json:"userToken" bson:"token"`
}

type PendingEvent struct {
	PendingEventId      string               `json:"eventId" bson:"pendingEventId"`
	Title               string               `json:"eventTitle" bson:"title"`
	HostUser            PendingEventUser     `json:"eventHost" bson:"hostUser"`
	Description         string               `json:"eventDescription" bson:"description"`
	Duration            int                  `json:"eventTimeDuration" bson:"duration"`
	EventTimeCandidates []EventTimeCandidate `json:"eventTimeCandidates" bson:"eventTimeCandidates"`
	DeclinedUsers       []DeclineUser        `json:"declinedUsers" bson:"declinedUsers"`
	PlaceAddress        string               `json:"eventPlace" bson:"placeAddress"`
	PlaceUrl            string               `json:"eventZoomAddress" bson:"placeUrl"`
	Attachment          string               `json:"eventAttachment" bson:"attachment"`
}

type AcceptedSurvey struct {
	AcceptedSurveyId  string   `json:"acceptedSurveyId" bson:"acceptedSurveyId"`
	UserId            string   `json:"userId" bson:"userId"`
	PendingScheduleId string   `json:"pendingScheduleId" bson:"pendingScheduleId"`
	Date              unixTime `json:"date" bson:"date"`
}

type DeclinedSurvey struct {
	DeclinedSurveyId  string `json:"declinedSurveyId" bson:"declinedSurveyId"`
	UserId            string `json:"userId" bson:"userId"`
	PendingScheduleId string `json:"pendingScheduleId" bson:"pendingScheduleId"`
	Reason            string `json:"reason" bson:"reason"`
}

type FixedEvent struct {
	FixedEventId string           `json:"eventId" bson:"fixedEventId"`
	HostUser     FixedEventUser   `json:"eventHost" bson:"hostUser"`
	Title        string           `json:"eventTitle" bson:"title"`
	Description  string           `json:"eventDescription" bson:"description"`
	Duration     int              `json:"eventTimeDuration" bson:"duration"`
	Date         unixTime         `json:"eventTimeStartsAt" bson:"date"`
	PlaceAddress string           `json:"eventPlace" bson:"placeAddress"`
	PlaceUrl     string           `json:"eventZoomAddress" bson:"placeUrl"`
	Attachment   string           `json:"eventAttachment" bson:"attachment"`
	Participants []FixedEventUser `json:"participants" bson:"participants"`
	IsDisabled   bool             `json:"isDisabled" bson:"isDisabled"`
}

type Reminder struct {
	FixedEventId string   `json:"fixedEventId" bson:"fixedEventId"`
	UserId       string   `json:"userId" bson:"userId"`
	Date         unixTime `json:"date" bson:"date"`
	TimeDelta    unixTime `json:"timeDelta" bson:"timeDelta"`
}

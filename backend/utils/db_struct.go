package utils

import "time"

type Token struct {
	tokenId               string    `bson:"tokenId"`
	userId                string    `bson:"userId"`
	authToken             string    `bson:"authToken"`
	authTokenExpiresAt    time.Time `bson:"authTokenExpiresAt"`
	refreshToken          string    `bson:"refreshToken"`
	refreshTokenExpiresAt time.Time `bson:"refreshTokenExpiresAt"`
}

type User struct {
	userId           string `bson:"userId"`
	name             string `bson:"name"`
	kakaoId          string `bson:"kakaoId"`
	googleCalendarId string `bson:"googleCalendarId"`
	phoneNumber      string `bson:"phoneNumber"`
	profileImage     string `bson:"profileImage"`
}

type PendingEvent struct {
	pendingEventId string      `bson:"pendingEventId"`
	title          string      `bson:"title"`
	dates          []time.Time `bson:"dates"`
	duration       string      `bson:"duration"`
	placeAddress   string      `bson:"placeAddress"`
	placeUrl       string      `bson:"placeUrl"`
	attachment     string      `bson:"attachment"`
}

type AcceptedSurvey struct {
	acceptedSurveyId  string    `bson:"acceptedSurveyId"`
	userId            string    `bson:"userId"`
	pendingScheduleId string    `bson:"pendingScheduleId"`
	date              time.Time `bson:"date"`
}

type DeclinedSurvey struct {
	declinedSurveyId  string `bson:"declinedSurveyId"`
	userId            string `bson:"userId"`
	pendingScheduleId string `bson:"pendingScheduleId"`
	reason            string `bson:"reason"`
}

type FixedEvent struct {
	fixedEventId string    `bson:"fixedEventId"`
	hostUserId   string    `bson:"hostUserId"`
	title        string    `bson:"title"`
	duration     int       `bson:"duration"`
	date         time.Time `bson:"date"`
	placeAddress string    `bson:"placeAddress"`
	placeUrl     string    `bson:"placeUrl"`
	attachment   string    `bson:"attachment"`
	participants []string  `bson:"participants"`
	isDisabled   bool      `bson:"isDisabled"`
}

type Reminder struct {
	reminderId   string    `bson:"reminderId"`
	fixedEventId string    `bson:"fixedEventId"`
	userId       string    `bson:"userId"`
	date         time.Time `bson:"date"`
}

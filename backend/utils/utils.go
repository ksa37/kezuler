package utils

import (
	"bytes"
	"context"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"net/url"
	"time"
)

func mapToBsonD(fields url.Values) bson.D {
	var mapBson bson.D
	for field, value := range fields {
		mapBson = append(mapBson, bson.E{Key: field, Value: value})
	}
	bson.Marshal(mapBson)
	return mapBson
}

func findUnixTimeByEventStartsAt(targetTime unixTime, payloads []unixTime) int {
	for i := 0; i < len(payloads); i++ {
		if payloads[i] == targetTime {
			return i
		}
	}
	return -1
}

func findEventTimeCandidateByUnixTime(targetTime unixTime, targetCandidates []EventTimeCandidate) int {
	for i := 0; i < len(targetCandidates); i++ {
		if targetCandidates[i].EventStartsAt == targetTime {
			return i
		}
	}
	return -1
}

func findUserInAcceptUsers(targetUser User, acceptUsers []AcceptUser) int {
	for i := 0; i < len(acceptUsers); i++ {
		if acceptUsers[i].UserId == targetUser.UserId {
			return i
		}
	}
	return -1
}

func findUserInDeclinedUsers(targetUser User, declinedUsers []DeclineUser) int {
	for i := 0; i < len(declinedUsers); i++ {
		if declinedUsers[i].UserId == targetUser.UserId {
			return i
		}
	}
	return -1
}

func findUserInFixedEventUsers(targetUser User, slice []FixedEventUser) int {
	for i := 0; i < len(slice); i++ {
		if targetUser.UserId == slice[i].UserId {
			return i
		}
	}
	return -1
}

func findUserInUsers(userId string, users []User) int {
	for i := 0; i < len(users); i++ {
		if userId == users[i].UserId {
			return i
		}
	}
	return -1
}

func structToBsonD(v interface{}) (doc *bson.D, err error) {
	data, err := bson.Marshal(v)
	if err != nil {
		return
	}

	err = bson.Unmarshal(data, &doc)
	return
}

func bsonDToStruct(doc bson.D, st *interface{}) (err error) {
	data, err := bson.Marshal(doc)
	if err != nil {
		return
	}

	err = bson.Unmarshal(data, &st)
	return
}

func unixTimestampToEventTime(unixTimestamps []unixTime) []EventTimeCandidate {

	n := len(unixTimestamps)

	newEventTimeCandidate := make([]EventTimeCandidate, n)

	for i := 0; i < n; i++ {
		newEventTimeCandidate[i].EventStartsAt = unixTimestamps[i]
		newEventTimeCandidate[i].PossibleUsers = []AcceptUser{}
	}

	return newEventTimeCandidate
}

func unixTimestampToEventTimeWithInfo(unixTimestamps []unixTime) []EventTimeCandidateWithInfo {

	n := len(unixTimestamps)

	newEventTimeCandidate := make([]EventTimeCandidateWithInfo, n)

	for i := 0; i < n; i++ {
		newEventTimeCandidate[i].EventStartsAt = unixTimestamps[i]
		newEventTimeCandidate[i].PossibleUsers = []AcceptUserWithInfo{}
	}

	return newEventTimeCandidate
}

// Utils to make Middleware for logging

type LogResponseWriter struct {
	http.ResponseWriter
	statusCode int
	buf        bytes.Buffer
}

func NewLogResponseWriter(w http.ResponseWriter) *LogResponseWriter {
	return &LogResponseWriter{ResponseWriter: w}
}

func (w *LogResponseWriter) WriteHeader(code int) {
	w.statusCode = code
	w.ResponseWriter.WriteHeader(code)
}

func (w *LogResponseWriter) Write(body []byte) (int, error) {
	w.buf.Write(body)
	return w.ResponseWriter.Write(body)
}

type LogMiddleware struct {
	logger *log.Logger
}

func NewLogMiddleware(logger *log.Logger) *LogMiddleware {
	return &LogMiddleware{logger: logger}
}

func (m *LogMiddleware) Func() mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			startTime := time.Now()

			logRespWriter := NewLogResponseWriter(w)
			next.ServeHTTP(logRespWriter, r)

			m.logger.Printf(
				"[%s %s] | duration=%s | status=%d | body=%s",
				r.Method,
				r.RequestURI,
				time.Since(startTime).String(),
				logRespWriter.statusCode,
				logRespWriter.buf.String())
		})
	}
}

// Utils to make Set datastructures

type Set struct {
	list map[string]struct{} //empty structs occupy 0 memory
}

func (s *Set) Has(v string) bool {
	_, ok := s.list[v]
	return ok
}

func (s *Set) Add(v string) {
	s.list[v] = struct{}{}
}

func (s *Set) Remove(v string) {
	delete(s.list, v)
}

func (s *Set) Clear() {
	s.list = make(map[string]struct{})
}

func (s *Set) Size() int {
	return len(s.list)
}

func NewSet() *Set {
	s := &Set{}
	s.list = make(map[string]struct{})
	return s
}

func SetToSlices(s *Set) []string {
	keys := make([]string, 0, len(s.list))
	for key := range s.list {
		keys = append(keys, key)
	}

	return keys
}

// GetInfoInPendingEvent Appends Info to PendingEvent
func GetInfoInPendingEvent(client *mongo.Client, targetEvent PendingEvent) (PendingEventClaims, error) {
	userCol := client.Database("kezuler").Collection("user")

	targetUsers := NewSet()
	targetUsers.Add(targetEvent.HostUser.UserId)

	for i := 0; i < len(targetEvent.EventTimeCandidates); i++ {
		for j := 0; j < len(targetEvent.EventTimeCandidates[i].PossibleUsers); j++ {
			targetUsers.Add(targetEvent.EventTimeCandidates[i].PossibleUsers[j].UserId)
		}
	}

	for i := 0; i < len(targetEvent.DeclinedUsers); i++ {
		targetUsers.Add(targetEvent.DeclinedUsers[i].UserId)
	}
	userSlices := SetToSlices(targetUsers)

	// 2. Query once to retrieve Infos
	cursor, err := userCol.Find(
		context.TODO(),
		bson.M{"userId": bson.M{"$in": userSlices}},
	)
	if err != nil {
		return PendingEventClaims{}, err
	}

	// 3. Append data with *WithInfo scheme
	var resUsers []User
	err = cursor.All(context.TODO(), &resUsers)
	if err != nil {
		return PendingEventClaims{}, err
	}

	hostIdx := findUserInUsers(targetEvent.HostUser.UserId, resUsers)
	resHostUser := PendingEventUserWithInfo{
		UserId:           targetEvent.HostUser.UserId,
		UserName:         resUsers[hostIdx].Name,
		UserProfileImage: resUsers[hostIdx].ProfileImage,
	}
	resEventTimeCandidates := []EventTimeCandidateWithInfo{}
	resDeclinedUsers := []DeclineUserWithInfo{}

	for i := 0; i < len(targetEvent.EventTimeCandidates); i++ {
		newEventTimeCandidateWithInfo := EventTimeCandidateWithInfo{
			EventStartsAt: targetEvent.EventTimeCandidates[i].EventStartsAt,
			PossibleUsers: []AcceptUserWithInfo{},
		}
		for j := 0; j < len(targetEvent.EventTimeCandidates[i].PossibleUsers); j++ {
			targetIdx := findUserInUsers(targetEvent.EventTimeCandidates[i].PossibleUsers[j].UserId, resUsers)
			newEventTimeCandidateWithInfo.PossibleUsers =
				append(newEventTimeCandidateWithInfo.PossibleUsers, AcceptUserWithInfo{
					targetEvent.EventTimeCandidates[i].PossibleUsers[j].UserId,
					resUsers[targetIdx].Name,
					resUsers[targetIdx].ProfileImage,
				})
		}
		resEventTimeCandidates = append(resEventTimeCandidates, newEventTimeCandidateWithInfo)
	}

	for i := 0; i < len(targetEvent.DeclinedUsers); i++ {
		declineUserIdx := findUserInUsers(targetEvent.DeclinedUsers[i].UserId, resUsers)
		resDeclinedUsers = append(resDeclinedUsers, DeclineUserWithInfo{
			UserId:            targetEvent.DeclinedUsers[i].UserId,
			UserName:          resUsers[declineUserIdx].Name,
			UserProfileImage:  resUsers[declineUserIdx].ProfileImage,
			UserDeclineReason: targetEvent.DeclinedUsers[i].UserDeclineReason,
		})
	}

	targetEventWithInfo := PendingEventClaims{
		PendingEventId:      targetEvent.PendingEventId,
		Title:               targetEvent.Title,
		HostUser:            resHostUser,
		Description:         targetEvent.Description,
		EventTimeCandidates: resEventTimeCandidates,
		DeclinedUsers:       resDeclinedUsers,
		PlaceAddress:        targetEvent.PlaceAddress,
		PlaceUrl:            targetEvent.PlaceUrl,
		Attachment:          targetEvent.Attachment,
	}

	return targetEventWithInfo, nil
}

// GetInfoInPendingEvents Appends Infos to PendingEvents
func GetInfoInPendingEvents(client *mongo.Client, targetEvents []PendingEvent) ([]PendingEventClaims, error) {
	userCol := client.Database("kezuler").Collection("user")

	targetUsers := NewSet()

	for i := 0; i < len(targetEvents); i++ {
		targetEvent := targetEvents[i]
		targetUsers.Add(targetEvent.HostUser.UserId)

		for j := 0; j < len(targetEvent.EventTimeCandidates); j++ {
			for k := 0; k < len(targetEvent.EventTimeCandidates[j].PossibleUsers); k++ {
				targetUsers.Add(targetEvent.EventTimeCandidates[j].PossibleUsers[k].UserId)
			}
		}

		for j := 0; j < len(targetEvent.DeclinedUsers); j++ {
			targetUsers.Add(targetEvent.DeclinedUsers[j].UserId)
		}
	}
	userSlices := SetToSlices(targetUsers)

	// 2. Query once to retrieve Infos
	cursor, err := userCol.Find(
		context.TODO(),
		bson.M{"userId": bson.M{"$in": userSlices}},
	)
	if err != nil {
		return []PendingEventClaims{}, err
	}

	// 3. Append data with *WithInfo scheme
	var resUsers []User
	err = cursor.All(context.TODO(), &resUsers)
	if err != nil {
		return []PendingEventClaims{}, err
	}

	targetEventWithInfos := []PendingEventClaims{}

	for t := 0; t < len(targetEvents); t++ {
		targetEvent := targetEvents[t]
		hostIdx := findUserInUsers(targetEvent.HostUser.UserId, resUsers)
		resHostUser := PendingEventUserWithInfo{
			UserId:           targetEvent.HostUser.UserId,
			UserName:         resUsers[hostIdx].Name,
			UserProfileImage: resUsers[hostIdx].ProfileImage,
		}
		resEventTimeCandidates := []EventTimeCandidateWithInfo{}
		resDeclinedUsers := []DeclineUserWithInfo{}

		for i := 0; i < len(targetEvent.EventTimeCandidates); i++ {
			newEventTimeCandidateWithInfo := EventTimeCandidateWithInfo{
				EventStartsAt: targetEvent.EventTimeCandidates[i].EventStartsAt,
				PossibleUsers: []AcceptUserWithInfo{},
			}
			for j := 0; j < len(targetEvent.EventTimeCandidates[i].PossibleUsers); j++ {
				targetIdx := findUserInUsers(targetEvent.EventTimeCandidates[i].PossibleUsers[j].UserId, resUsers)
				newEventTimeCandidateWithInfo.PossibleUsers =
					append(newEventTimeCandidateWithInfo.PossibleUsers, AcceptUserWithInfo{
						targetEvent.EventTimeCandidates[i].PossibleUsers[j].UserId,
						resUsers[targetIdx].Name,
						resUsers[targetIdx].ProfileImage,
					})
			}
			resEventTimeCandidates = append(resEventTimeCandidates, newEventTimeCandidateWithInfo)
		}

		for i := 0; i < len(targetEvent.DeclinedUsers); i++ {
			declineUserIdx := findUserInUsers(targetEvent.DeclinedUsers[i].UserId, resUsers)
			resDeclinedUsers = append(resDeclinedUsers, DeclineUserWithInfo{
				UserId:            targetEvent.DeclinedUsers[i].UserId,
				UserName:          resUsers[declineUserIdx].Name,
				UserProfileImage:  resUsers[declineUserIdx].ProfileImage,
				UserDeclineReason: targetEvent.DeclinedUsers[i].UserDeclineReason,
			})
		}

		targetEventWithInfo := PendingEventClaims{
			PendingEventId:      targetEvent.PendingEventId,
			Title:               targetEvent.Title,
			HostUser:            resHostUser,
			Description:         targetEvent.Description,
			EventTimeCandidates: resEventTimeCandidates,
			DeclinedUsers:       resDeclinedUsers,
			PlaceAddress:        targetEvent.PlaceAddress,
			PlaceUrl:            targetEvent.PlaceUrl,
			Attachment:          targetEvent.Attachment,
		}

		targetEventWithInfos = append(targetEventWithInfos, targetEventWithInfo)
	}

	return targetEventWithInfos, nil
}

// GetInfoInFixedEvent Append Info to FixedEvent
func GetInfoInFixedEvent(client *mongo.Client, targetEvent FixedEvent) (FixedEventClaims, error) {
	userCol := client.Database("kezuler").Collection("user")

	targetUsers := NewSet()
	targetUsers.Add(targetEvent.HostUser.UserId)

	for i := 0; i < len(targetEvent.Participants); i++ {
		targetUsers.Add(targetEvent.Participants[i].UserId)
	}
	userSlices := SetToSlices(targetUsers)

	// 2. Query once to retrieve Infos
	cursor, err := userCol.Find(
		context.TODO(),
		bson.M{"userId": bson.M{"$in": userSlices}},
	)
	if err != nil {
		return FixedEventClaims{}, err
	}

	// 3. Append data with *WithInfo scheme
	var resUsers []User
	err = cursor.All(context.TODO(), &resUsers)
	if err != nil {
		return FixedEventClaims{}, err
	}

	hostIdx := findUserInUsers(targetEvent.HostUser.UserId, resUsers)
	resHostUser := FixedEventUserWithInfo{
		UserId:           targetEvent.HostUser.UserId,
		UserName:         resUsers[hostIdx].Name,
		UserProfileImage: resUsers[hostIdx].ProfileImage,
		UserStatus:       targetEvent.HostUser.UserStatus,
	}

	resParticipants := []FixedEventUserWithInfo{}
	for i := 0; i < len(targetEvent.Participants); i++ {
		participantIdx := findUserInUsers(targetEvent.Participants[i].UserId, resUsers)
		resParticipants = append(resParticipants, FixedEventUserWithInfo{
			UserId:           targetEvent.Participants[i].UserId,
			UserName:         resUsers[participantIdx].Name,
			UserProfileImage: resUsers[participantIdx].ProfileImage,
			UserStatus:       targetEvent.Participants[i].UserStatus,
		})
	}

	targetEventWithInfo := FixedEventClaims{
		FixedEventId: targetEvent.FixedEventId,
		HostUser:     resHostUser,
		Title:        targetEvent.Title,
		Description:  targetEvent.Description,
		Duration:     targetEvent.Duration,
		Date:         targetEvent.Date,
		PlaceAddress: targetEvent.PlaceAddress,
		PlaceUrl:     targetEvent.PlaceUrl,
		Attachment:   targetEvent.Attachment,
		Participants: resParticipants,
		IsDisabled:   targetEvent.IsDisabled,
	}

	return targetEventWithInfo, nil
}

// GetInfoInFixedEvent Append Info to FixedEvent
func GetInfoInFixedEvents(client *mongo.Client, targetEvents []FixedEvent) ([]FixedEventClaims, error) {
	userCol := client.Database("kezuler").Collection("user")

	targetUsers := NewSet()

	for t := 0; t < len(targetEvents); t++ {
		targetEvent := targetEvents[t]
		targetUsers.Add(targetEvent.HostUser.UserId)
		for i := 0; i < len(targetEvent.Participants); i++ {
			targetUsers.Add(targetEvent.Participants[i].UserId)
		}
	}

	userSlices := SetToSlices(targetUsers)

	// 2. Query once to retrieve Infos
	cursor, err := userCol.Find(
		context.TODO(),
		bson.M{"userId": bson.M{"$in": userSlices}},
	)
	if err != nil {
		return []FixedEventClaims{}, err
	}

	// 3. Append data with *WithInfo scheme
	var resUsers []User
	err = cursor.All(context.TODO(), &resUsers)
	if err != nil {
		return []FixedEventClaims{}, err
	}

	targetEventsWithInfo := []FixedEventClaims{}
	for t := 0; t < len(targetEvents); t++ {
		targetEvent := targetEvents[t]

		hostIdx := findUserInUsers(targetEvent.HostUser.UserId, resUsers)
		resHostUser := FixedEventUserWithInfo{
			UserId:           targetEvent.HostUser.UserId,
			UserName:         resUsers[hostIdx].Name,
			UserProfileImage: resUsers[hostIdx].ProfileImage,
			UserStatus:       targetEvent.HostUser.UserStatus,
		}

		resParticipants := []FixedEventUserWithInfo{}
		for i := 0; i < len(targetEvent.Participants); i++ {
			participantIdx := findUserInUsers(targetEvent.Participants[i].UserId, resUsers)
			resParticipants = append(resParticipants, FixedEventUserWithInfo{
				UserId:           targetEvent.Participants[i].UserId,
				UserName:         resUsers[participantIdx].Name,
				UserProfileImage: resUsers[participantIdx].ProfileImage,
				UserStatus:       targetEvent.Participants[i].UserStatus,
			})
		}

		targetEventWithInfo := FixedEventClaims{
			FixedEventId: targetEvent.FixedEventId,
			HostUser:     resHostUser,
			Title:        targetEvent.Title,
			Description:  targetEvent.Description,
			Duration:     targetEvent.Duration,
			Date:         targetEvent.Date,
			PlaceAddress: targetEvent.PlaceAddress,
			PlaceUrl:     targetEvent.PlaceUrl,
			Attachment:   targetEvent.Attachment,
			Participants: resParticipants,
			IsDisabled:   targetEvent.IsDisabled,
		}

		targetEventsWithInfo = append(targetEventsWithInfo, targetEventWithInfo)
	}

	return targetEventsWithInfo, nil
}

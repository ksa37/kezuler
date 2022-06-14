package utils

import (
	"bytes"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
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

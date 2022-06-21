package utils

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"strings"
)

func UserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		kakaoAuthToken := r.Header.Get("Authorization")
		splitToken := strings.Split(kakaoAuthToken, "Bearer")
		if len(splitToken) != 2 {
			// 401: Unauthorized
			http.Error(w, "Not Authorized", http.StatusUnauthorized)
			return
		}
		kakaoAuthToken = strings.TrimSpace(splitToken[1])
		postUser(w, kakaoAuthToken)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func UserWithTokenHandler(w http.ResponseWriter, r *http.Request) {
	serviceAuthToken := r.Header.Get("Authorization")
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	if len(splitToken) != 2 {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])
	if r.Method == "GET" {
		getUserWithId(w, serviceAuthToken)
	} else if r.Method == "PATCH" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PatchUserPayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err := decoder.Decode(&payload)
		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}
		patchUserWithId(w, serviceAuthToken, payload)
	} else if r.Method == "DELETE" {
		deleteUserWithId(w, serviceAuthToken)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func FixedEventHandler(w http.ResponseWriter, r *http.Request) { // GET
	serviceAuthToken := r.Header.Get("Authorization")
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	if len(splitToken) != 2 {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])

	if r.Method == "GET" {
		// TODO: implement GET /fixedEvents with given user
		startIndex, startIndexErr := strconv.Atoi(r.URL.Query().Get("startIndex"))
		endIndex, endIndexErr := strconv.Atoi(r.URL.Query().Get("endIndex"))
		if startIndexErr != nil || endIndexErr != nil {
			http.Error(w, "Error occured while retrieving startIndex and endIndex.", http.StatusNotFound)
			return
		}
		payload := map[string]int{
			"startIndex": startIndex,
			"endIndex":   endIndex,
		}
		getFixedEvents(w, serviceAuthToken, payload)
	} else if r.Method == "POST" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PostFixedEventPayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err := decoder.Decode(&payload)
		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}

		// TODO: implement POST /fixedEvents
		postFixedEvent(w, serviceAuthToken, payload)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func FixedEventWithIdHandler(w http.ResponseWriter, r *http.Request) { // GET, PATCH, DELETE
	serviceAuthToken := r.Header.Get("Authorization")
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	feId := mux.Vars(r)["fixedEventId"]

	if len(splitToken) != 2 {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])

	if r.Method == "GET" {
		// TODO: implement GET /fixedEvents/{feId}
		getFixedEventWithId(w, serviceAuthToken, feId)
	}

	if r.Method == "PATCH" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PatchFixedEventWithIdPayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err := decoder.Decode(&payload)
		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}
		patchFixedEventWithId(w, serviceAuthToken, feId, payload)
	}

	if r.Method == "DELETE" {
		// TODO: implement DELETE /fixedEvents/{feId}
		deleteFixedEventWithId(w, serviceAuthToken, feId)
	}
}

func FixedEventCandidateHandler(w http.ResponseWriter, r *http.Request) {
	serviceAuthToken := r.Header.Get("Authorization")
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	feId := mux.Vars(r)["fixedEventId"]

	if len(splitToken) != 2 {
		// 401: Unauthorized
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])
	if r.Method == "PUT" {
		putFixedEventCandidate(w, serviceAuthToken, feId)
	} else if r.Method == "DELETE" {
		deleteFixedEventCandidate(w, serviceAuthToken, feId)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func FixedEventReminderHandler(w http.ResponseWriter, r *http.Request) {
	serviceAuthToken := r.Header.Get("Authorization")
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	feId := mux.Vars(r)["fixedEventId"]

	if len(splitToken) != 2 {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])

	if r.Method == "GET" {
		getReminder(w, serviceAuthToken, feId)
	} else if r.Method == "PUT" || r.Method == "POST" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PostRemindPayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err := decoder.Decode(&payload)
		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request. "+err.Error(), http.StatusBadRequest)
			}
			return
		}

		if r.Method == "POST" {
			postReminder(w, serviceAuthToken, feId, payload.TimeDelta)
		} else {
			putReminder(w, serviceAuthToken, feId, payload.TimeDelta)
		}
	} else if r.Method == "DELETE" {
		deleteReminder(w, serviceAuthToken, feId)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func PendingEventHandler(w http.ResponseWriter, r *http.Request) {
	serviceAuthToken := r.Header.Get("Authorization")
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	if len(splitToken) != 2 {
		// 401: Unauthorized
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])
	if r.Method == "GET" {
		getPendingEvents(w, serviceAuthToken)
	} else if r.Method == "POST" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PostPendingEventPayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err := decoder.Decode(&payload)
		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}
		postPendingEvent(w, serviceAuthToken, payload)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func PendingEventWithIdHandler(w http.ResponseWriter, r *http.Request) {
	serviceAuthToken := r.Header.Get("Authorization")
	if serviceAuthToken == "" {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	serviceAuthToken = strings.TrimSpace(splitToken[1])
	peId := mux.Vars(r)["pendingEventId"]

	if len(splitToken) != 2 {
		// 401: Unauthorized
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])

	if r.Method == "GET" {
		// TODO: implement GET /pendingEvents/{peId}
		getPendingEventWithId(w, serviceAuthToken, peId)
	} else if r.Method == "PATCH" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PatchPendingEventPayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err := decoder.Decode(&payload)
		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}
		patchPendingEventWithId(w, serviceAuthToken, peId, payload)
	} else if r.Method == "DELETE" {
		// TODO: implement DELETE /pendingEvents/peId
		deletePendingEventWithId(w, serviceAuthToken, peId)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func PendingEventCandidateHandler(w http.ResponseWriter, r *http.Request) {
	serviceAuthToken := r.Header.Get("Authorization")
	if serviceAuthToken == "" {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	splitToken := strings.Split(serviceAuthToken, "Bearer")
	peId := mux.Vars(r)["pendingEventId"]

	if len(splitToken) != 2 {
		// 401: Unauthorized
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
	serviceAuthToken = strings.TrimSpace(splitToken[1])

	if r.Method == "PUT" {
		// TODO: implement PUT /pendingEvents/{peId}/candidate
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload PatchPendingEventCandidatePayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		err := decoder.Decode(&payload)

		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}

		putPendingEventCandidate(w, serviceAuthToken, peId, payload)
	} else if r.Method == "DELETE" {
		headerContentType := r.Header.Get("Content-Type")
		if headerContentType != "application/json" {
			http.Error(w, "Content Type is not application/json", http.StatusUnsupportedMediaType)
			return
		}

		var payload DeletePendingEventCandidatePayload
		var unmarshalError *json.UnmarshalTypeError
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		err := decoder.Decode(&payload)

		if err != nil {
			if errors.As(err, &unmarshalError) {
				http.Error(w, "Bad Request. Wrong Type provided for field "+unmarshalError.Field, http.StatusBadRequest)
			} else {
				http.Error(w, "Bad Request "+err.Error(), http.StatusBadRequest)
			}
			return
		}

		deletePendingEventCandidate(w, serviceAuthToken, peId, payload)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func InvitationHandler(w http.ResponseWriter, r *http.Request) {
	peId := mux.Vars(r)["pendingEventId"]

	if r.Method == "GET" {
		getInvitationInfo(w, peId)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

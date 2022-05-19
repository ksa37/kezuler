package utils

import (
	"net/http"
	"strings"
)

func UserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		//TODO: Support other tokens types (Apple, Google, ...)
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

func UserWithIdHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		serviceAuthToken := r.Header.Get("Authorization")
		splitToken := strings.Split(serviceAuthToken, "Bearer")
		if len(splitToken) != 2 {
			// 401: Unauthorized
			http.Error(w, "Not Authorized", http.StatusUnauthorized)
			return
		}
		serviceAuthToken = strings.TrimSpace(splitToken[1])
		getUserWithId(w, serviceAuthToken)
	}
}

func FixedEventHandler(w http.ResponseWriter, r *http.Request) {

}

func FixedEventWithIdHandler(w http.ResponseWriter, r *http.Request) {

}

func PendingEventHandler(w http.ResponseWriter, r *http.Request) {

}

func PendingEventWithIdHandler(w http.ResponseWriter, r *http.Request) {

}

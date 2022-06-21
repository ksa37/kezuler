package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"io"
	"kezuler/utils"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

// ref: https://setapp.com/how-to/use-go-with-mongodb
// ref: https://jeonghwan-kim.github.io/dev/2019/02/07/go-net-http.html#핸들러를-등록하는-handle과-handlefunc

func main() {
	logger := log.New(os.Stdout, "", log.LstdFlags)
	mainRouter := mux.NewRouter()

	userRouter := mainRouter.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("", utils.UserHandler).Methods("POST")
	userRouter.HandleFunc("", utils.UserWithTokenHandler).Methods("GET", "PATCH", "DELETE")

	fixedEventRouter := mainRouter.PathPrefix("/fixedEvents").Subrouter()
	fixedEventRouter.HandleFunc("", utils.FixedEventHandler).Methods("GET", "POST")
	fixedEventRouter.HandleFunc("/{fixedEventId}", utils.FixedEventWithIdHandler).Methods("GET", "PATCH", "DELETE")
	fixedEventRouter.HandleFunc("/{fixedEventId}/candidate", utils.FixedEventCandidateHandler).Methods("PUT", "DELETE")
	fixedEventRouter.HandleFunc("/{fixedEventId}/reminder", utils.FixedEventReminderHandler).Methods("GET", "POST", "PUT", "DELETE")

	pendingEventRouter := mainRouter.PathPrefix("/pendingEvents").Subrouter()
	pendingEventRouter.HandleFunc("", utils.PendingEventHandler).Methods("GET", "POST")
	pendingEventRouter.HandleFunc("/{pendingEventId}", utils.PendingEventWithIdHandler).Methods("GET", "PATCH", "DELETE")
	pendingEventRouter.HandleFunc("/{pendingEventId}/candidate", utils.PendingEventCandidateHandler).Methods("PUT", "DELETE")

	invitationRouter := mainRouter.PathPrefix("/invitation").Subrouter()
	invitationRouter.HandleFunc("/{pendingEventId}", utils.InvitationHandler).Methods("GET")

	logMiddleWare := utils.NewLogMiddleware(logger)
	mainRouter.Use(logMiddleWare.Func())

	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong")
	})

	// EventHandler for Redirect. Get Kakao AuthToken and pass it to /login/kakao
	http.HandleFunc("/oauth/kakao/token", func(w http.ResponseWriter, r *http.Request) {
		// 1. 받은 토큰 검증
		code := r.URL.Query().Get("code")
		if code == "" {
			fmt.Fprintf(w, "Error: 'code' parameter doesn't exist on query string")
		}

		payload := url.Values{
			"grant_type":   {"authorization_code"},
			"client_id":    {"0c7841de042de4b73e3a11c1af2f6671"},
			"redirect_uri": {"http://localhost:3000/oauth/kakao/token"},
			"code":         {code},
		}

		const ClientURI string = "https://kauth.kakao.com"
		const Resource string = "/oauth/token"

		// generate endpoint
		u, _ := url.ParseRequestURI(ClientURI)
		u.Path = Resource
		urlStr := u.String()

		client := &http.Client{}
		req, _ := http.NewRequest(http.MethodPost, urlStr, strings.NewReader(payload.Encode()))
		req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		req.Header.Add("charset", "utf-8")

		res, err := client.Do(req)
		if err != nil {
			panic(err)
		}

		body, err := io.ReadAll(res.Body)
		if err != nil {
			panic(err)
		}

		fmt.Fprintf(w, string(body))
		jsonBody := utils.KakaoOAuthTokenResponse{}
		json.Unmarshal(body, &jsonBody)

		fmt.Printf(jsonBody.AccessToken)
	})

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"accept", "authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		Debug:            true,
	})
	routerWithCors := c.Handler(mainRouter)
	http.Handle("/", routerWithCors)
	logger.Fatalln(http.ListenAndServe("0.0.0.0:8001", nil))
}

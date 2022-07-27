package main

import (
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"kezuler/utils"
	"log"
	"net/http"
	"os"
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
	fixedEventRouter.HandleFunc("/{fixedEventId}/invitation", utils.FixedEventInvitationHandler).Methods("GET")

	pendingEventRouter := mainRouter.PathPrefix("/pendingEvents").Subrouter()
	pendingEventRouter.HandleFunc("", utils.PendingEventHandler).Methods("GET", "POST")
	pendingEventRouter.HandleFunc("/{pendingEventId}", utils.PendingEventWithIdHandler).Methods("GET", "PATCH", "DELETE")
	pendingEventRouter.HandleFunc("/{pendingEventId}/candidate", utils.PendingEventCandidateHandler).Methods("PUT", "DELETE")
	pendingEventRouter.HandleFunc("/{pendingEventId}/invitation", utils.PendingEventInvitationHandler).Methods("GET")

	testRouter := mainRouter.PathPrefix("/test").Subrouter()
	testRouter.HandleFunc("/alimTalk", utils.AlimTalkTest).Methods("POST")

	logMiddleWare := utils.NewLogMiddleware(logger)
	mainRouter.Use(logMiddleWare.Func())

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

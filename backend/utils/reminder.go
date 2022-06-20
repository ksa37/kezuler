package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

func getReminder(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var hostUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&hostUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No user was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	reminderCol := client.Database("kezuler").Collection("reminder")
	var targetReminder Reminder
	err = reminderCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&targetReminder)

	if err == mongo.ErrNoDocuments {
		w.WriteHeader(http.StatusNoContent)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(targetReminder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func postReminder(w http.ResponseWriter, serviceAuthToken string, feId string, timeDelta unixTime) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var hostUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&hostUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No user was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var targetEvent FixedEvent
	err = fixedEventCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&targetEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if targetEvent.HostUser.UserId != hostUser.UserId && findUserInFixedEventUsers(hostUser, targetEvent.Participants) == -1 {
		http.Error(w, "Cannot handle reminder with unauthorized user.", http.StatusUnauthorized)
		return
	}

	newReminder := Reminder{
		FixedEventId: targetEvent.FixedEventId,
		UserId:       hostUser.UserId,
		Date:         targetEvent.Date - timeDelta,
		TimeDelta:    timeDelta,
	}

	reminderCol := client.Database("kezuler").Collection("reminder")
	_, err = reminderCol.InsertOne(context.TODO(), newReminder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(newReminder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func putReminder(w http.ResponseWriter, serviceAuthToken string, feId string, timeDelta unixTime) {

}

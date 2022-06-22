package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

func getPendingEventInvitationWithInfo(w http.ResponseWriter, peId string) {
	client := connect()
	defer disconnect(client)

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err := pendingEventCol.FindOne(context.TODO(), bson.M{"pendingEventId": peId}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", peId)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	targetEventWithInfo, err := GetInfoInPendingEvent(client, targetEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(targetEventWithInfo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func getFixedEventInvitationWithInfo(w http.ResponseWriter, feId string) {
	client := connect()
	defer disconnect(client)

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var targetEvent FixedEvent

	err := fixedEventCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&targetEvent)
	if err != nil {
		fmt.Printf("No Document was found with given feId: %s\n", feId)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	targetEventWithInfo, err := GetInfoInFixedEvent(client, targetEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(targetEventWithInfo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

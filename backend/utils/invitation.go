package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

func getInvitationInfo(w http.ResponseWriter, peId string) {
	client := connect()
	defer disconnect(client)

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err := pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", peId}}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", peId)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(targetEvent)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

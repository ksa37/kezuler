package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"reflect"
)

func getFixedEvents(w http.ResponseWriter, serviceAuthToken string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult bson.M
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	userId := tokenQueryResult["userId"]
	// TODO: participant도 찾도록 로직 수정
	cursor, err := fixedEventCol.Find(context.TODO(), bson.D{{"eventHost.userId", userId}})
	defer cursor.Close(context.TODO())
	if err != nil {
		panic(err)
	}

	var results []FixedEvent
	cursor.All(context.TODO(), &results)

	jsonRes, err := json.Marshal(results)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func postFixedEvent(w http.ResponseWriter, serviceAuthToken string, payload postPendingEventPayload) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult bson.M
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found in Token collection with given userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	userId := tokenQueryResult["userId"]

	var targetUser User
	userCol := client.Database("kezuler").Collection("user")
	err = userCol.FindOne(context.TODO(), bson.D{{"userId", userId}}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found in Token collection with given userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	// TODO: Get Pending Events 구현하기
	// Host로 있는 정보 찾기
	var targetEvent PendingEvent
	err = pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", payload.PendingEventId}}).Decode(targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", payload.PendingEventId)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	var newFixedEvent = FixedEvent{
		FixedEventId: "123123", // TODO: random generate with fixedEvent ID rule
		HostUser:     fixedEventUser{UserId: , UserName: , UserProfileImage: },
		Title:        targetEvent.Title,
		Description:  targetEvent.Description,
		Duration:     targetEvent.Duration,
		Date:         payload.EventTimeStartsAt,
		PlaceAddress: targetEvent.PlaceAddress,
		PlaceUrl:     targetEvent.PlaceUrl,
		Attachment:   targetEvent.Attachment,
		Participants: []fixedEventUser // TODO: Find eventTimeCandidate and set inner people to participants
		IsDisabled:   false,
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	fixedEventCol.InsertOne(context.TODO(), newFixedEvent)

	jsonRes, err := json.Marshal(newFixedEvent)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(jsonRes)
}

func getFixedEventWithId(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult bson.M
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEventCol")
	var targetEvent FixedEvent

	err = fixedEventCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&targetEvent)
	if err != nil {
		fmt.Printf("No Document was found with given feId: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(targetEvent)
	w.WriteHeader(200)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonRes)
}

func patchFixedEventWithId(w http.ResponseWriter, serviceAuthToken string, feId string, payload patchFixedEventWithIdPayload) {
	// Host 용 API - Title, Description 을 변경하는 데 사용
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult Token
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var fixedEventQueryResult FixedEvent
	err = fixedEventCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&fixedEventQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	targetUserId := tokenQueryResult.UserId
	hostUserId := fixedEventQueryResult.HostUser.UserId
	if targetUserId != hostUserId {
		http.Error(w, "Given userId is not an host of given fixedEvent", http.StatusForbidden)
		return
	}

	// TODO: make filter valid with given payload
	doc, err := fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId}, bson.M{"%set", {"": "", "":""}}, {new: true})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonRes, err := json.Marshal(doc)
	w.WriteHeader(200)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonRes)
}

func deleteFixedEventWithId(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult Token
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var fixedEventQueryResult FixedEvent
	err = fixedEventCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&fixedEventQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	targetUserId := tokenQueryResult.UserId
	hostUserId := fixedEventQueryResult.HostUser.UserId
	if targetUserId != hostUserId {
		http.Error(w, "Given userId is not an host of given fixedEvent", http.StatusForbidden)
		return
	}

	err = fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId}, bson.M{"$set", {"isDisabled": true}}, {new: true})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(204)
}

func patchFixedEventCandidate(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult Token
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var res FixedEvent
	err = fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId}, bson.M{"$set": bson.M{"participants.$.userStatus": "Accepted"}}).Decode(&res)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonRes, err := json.Marshal(res)
	w.WriteHeader(200)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonRes)
}

func deleteFixedEventCandidate(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var tokenQueryResult Token
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&tokenQueryResult)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var res FixedEvent
	err = fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId}, bson.M{"$set": bson.M{"participants.$.userStatus": "Declined"}}).Decode(&res)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonRes, err := json.Marshal(res)
	w.WriteHeader(200)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonRes)
}

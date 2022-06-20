package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"time"
)

func getFixedEvents(w http.ResponseWriter, serviceAuthToken string, payload map[string]int) {
	client := connect()
	defer disconnect(client)

	currentTime := time.Now()

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")

	options := options.Find()
	options.SetSort(bson.M{"date": 1})
	options.SetSkip(int64(payload["startIndex"]))
	options.SetLimit(int64(payload["endIndex"] - payload["startIndex"]))

	cursor, err := fixedEventCol.Find(
		context.TODO(),
		bson.M{"$and": []bson.M{{"date": bson.M{"$gt": currentTime.AddDate(0, -3, 0).UnixMilli()}},
			{"$or": []bson.M{{"participants": bson.M{"$elemMatch": bson.M{"userId": targetUser.UserId}}, "isDisabled": false},
				{"hostUser.userId": targetUser.UserId}}}}},
		options,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var fixedEvents []FixedEvent
	err = cursor.All(context.TODO(), &fixedEvents)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	results := bson.M{
		"startIndex":  payload["startIndex"],
		"endIndex":    payload["endIndex"],
		"totalAmount": len(fixedEvents),
		"fixedEvents": fixedEvents,
	}

	jsonRes, err := json.Marshal(results)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func postFixedEvent(w http.ResponseWriter, serviceAuthToken string, payload PostFixedEventPayload) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var targetEvent PendingEvent
	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	err = pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", payload.PendingEventId}}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", payload.PendingEventId)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	// Find AcceptParticipant and DeclineParticipant by iterating pendingEvent
	var participants []FixedEventUser
	visited := map[string]bool{} // userId: visited?
	for i := 0; i < len(targetEvent.DeclinedUsers); i++ {
		if visited[targetEvent.DeclinedUsers[i].UserId] == false {
			participants = append(participants, FixedEventUser{
				targetEvent.DeclinedUsers[i].UserId,
				"Declined",
			})
			visited[targetEvent.DeclinedUsers[i].UserId] = true
		}
	}

	targetIdx := findEventTimeCandidateByUnixTime(payload.EventTime, targetEvent.EventTimeCandidates) // get index
	if targetIdx == -1 {
		http.Error(w, "eventTime is not valid", http.StatusNotFound)
		return
	}
	for j := 0; j < len(targetEvent.EventTimeCandidates); j++ {
		if targetIdx == j {
			// Accept All
			for k := 0; k < len(targetEvent.EventTimeCandidates[j].PossibleUsers); k++ {
				currentUser := targetEvent.EventTimeCandidates[j].PossibleUsers[k]
				if visited[currentUser.UserId] == false {
					participants = append(participants, FixedEventUser{
						currentUser.UserId,
						"Accepted",
					})
					visited[currentUser.UserId] = true
					// TODO: Add Reminder with UpdateMany for AcceptUsers
				}
			}
		} else {
			// Deny All
			for k := 0; k < len(targetEvent.EventTimeCandidates[j].PossibleUsers); k++ {
				currentUser := targetEvent.EventTimeCandidates[j].PossibleUsers[k]
				if visited[currentUser.UserId] == false {
					participants = append(participants, FixedEventUser{
						currentUser.UserId,
						"Declined",
					})
					visited[currentUser.UserId] = true
				}
			}
		}
	}

	var newFixedEvent = FixedEvent{
		FixedEventId: targetEvent.PendingEventId,
		HostUser: FixedEventUser{
			UserId:     targetEvent.HostUser.UserId,
			UserStatus: "Accepted",
		},
		Title:        targetEvent.Title,
		Description:  targetEvent.Description,
		Duration:     targetEvent.Duration,
		Date:         payload.EventTime,
		PlaceAddress: targetEvent.PlaceAddress,
		PlaceUrl:     targetEvent.PlaceUrl,
		Attachment:   targetEvent.Attachment,
		Participants: participants,
		IsDisabled:   false,
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	fixedEventCol.InsertOne(context.TODO(), newFixedEvent)

	_, err = pendingEventCol.DeleteOne(
		context.TODO(), bson.M{"pendingEventId": targetEvent.PendingEventId},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	jsonRes, err := json.Marshal(newFixedEvent)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(jsonRes)
}

func getFixedEventWithId(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var targetEvent FixedEvent

	err = fixedEventCol.FindOne(context.TODO(), bson.D{{"fixedEventId", feId}}).Decode(&targetEvent)
	if err != nil {
		fmt.Printf("No Document was found with given feId: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(targetEvent)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func patchFixedEventWithId(w http.ResponseWriter, serviceAuthToken string, feId string, payload PatchFixedEventWithIdPayload) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var hostUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&hostUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
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

	userId := hostUser.UserId
	fmt.Print(payload)
	var updatedEvent FixedEvent
	if targetEvent.HostUser.UserId == userId {
		fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": targetEvent.FixedEventId}, bson.M{"$set": payload}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedEvent)
		jsonRes, _ := json.Marshal(updatedEvent)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonRes)
	} else {
		fmt.Printf("HostId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
}

func deleteFixedEventWithId(w http.ResponseWriter, serviceAuthToken string, feId string) {
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

	targetUserId := hostUser.UserId
	hostUserId := targetEvent.HostUser.UserId
	if targetUserId != hostUserId {
		http.Error(w, "Given userId is not an host of given fixedEvent", http.StatusForbidden)
		return
	}

	var updatedEvent FixedEvent
	updateErr := fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId}, bson.M{"$set": bson.M{"isDisabled": true}}).Decode(&updatedEvent)
	if updateErr == mongo.ErrNoDocuments {
		http.Error(w, "Target FixedEvent is not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(204)
}

func putFixedEventCandidate(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var updatedEvent FixedEvent
	err = fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId, "participants.userId": targetUser.UserId},
		bson.M{"$set": bson.M{"participants.$.userStatus": "Accepted"}},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&updatedEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(updatedEvent)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func deleteFixedEventCandidate(w http.ResponseWriter, serviceAuthToken string, feId string) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	fixedEventCol := client.Database("kezuler").Collection("fixedEvent")
	var updatedEvent FixedEvent
	err = fixedEventCol.FindOneAndUpdate(context.TODO(), bson.M{"fixedEventId": feId, "participants.userId": targetUser.UserId},
		bson.M{"$set": bson.M{"participants.$.userStatus": "Declined"}},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&updatedEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	jsonRes, err := json.Marshal(updatedEvent)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

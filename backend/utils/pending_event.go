package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dchest/uniuri"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
)

func getPendingEvents(w http.ResponseWriter, serviceAuthToken string) {
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

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	cursor, err := pendingEventCol.Find(context.TODO(), bson.M{"$or": []bson.M{
		{"declinedUsers": bson.M{"$elemMatch": bson.M{"userId": targetUser.UserId}}},
		{"eventTimeCandidates.possibleUsers": bson.M{"$elemMatch": bson.M{"userId": targetUser.UserId}}},
		{"hostUser.userId": targetUser.UserId},
	}})

	var pendingEvents []PendingEvent
	err = cursor.All(context.TODO(), &pendingEvents)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	pendingEventsWithInfo, err := GetInfoInPendingEvents(client, pendingEvents)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var res bson.M
	if pendingEvents == nil {
		res = bson.M{
			"pendingEvents": []PendingEvent{},
		}
	} else {
		res = bson.M{
			"pendingEvents": pendingEventsWithInfo,
		}
	}

	jsonRes, err := json.Marshal(res)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(jsonRes)
}
func postPendingEvent(w http.ResponseWriter, serviceAuthToken string, payload PostPendingEventPayload) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var hostUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&hostUser)
	log.Println(hostUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	newPendingEvent := PendingEvent{
		PendingEventId:      uniuri.NewLen(12),
		Title:               payload.EventTitle,
		HostUser:            PendingEventUser{hostUser.UserId},
		Description:         payload.EventDescription,
		Duration:            payload.EventTimeDuration,
		EventTimeCandidates: unixTimestampToEventTime(payload.EventTimeCandidates),
		DeclinedUsers:       []DeclineUser{},
		PlaceAddress:        payload.EventPlace,
		PlaceUrl:            payload.EventZoomAddress,
		Attachment:          payload.EventAttachment,
	}

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	_, err = pendingEventCol.InsertOne(context.TODO(), newPendingEvent)

	newPendingEventWithInfo := PendingEventClaims{
		PendingEventId:      newPendingEvent.PendingEventId,
		Title:               newPendingEvent.Title,
		HostUser:            PendingEventUserWithInfo{hostUser.UserId, hostUser.Name, hostUser.ProfileImage},
		Description:         newPendingEvent.Description,
		Duration:            newPendingEvent.Duration,
		EventTimeCandidates: unixTimestampToEventTimeWithInfo(payload.EventTimeCandidates),
		DeclinedUsers:       []DeclineUserWithInfo{},
		PlaceAddress:        newPendingEvent.PlaceAddress,
		PlaceUrl:            newPendingEvent.PlaceUrl,
		Attachment:          newPendingEvent.Attachment,
	}

	jsonRes, err := json.Marshal(newPendingEventWithInfo)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(jsonRes)
}

func getPendingEventWithId(w http.ResponseWriter, serviceAuthToken string, peId string) {
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

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err = pendingEventCol.FindOne(context.TODO(), bson.M{"pendingEventId": peId}).Decode(&targetEvent)
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

func patchPendingEventWithId(w http.ResponseWriter, serviceAuthToken string, peId string, payload PatchPendingEventPayload) {
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

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err = pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", peId}}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", peId)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	userId := hostUser.UserId
	var updatedEvent PendingEvent
	if targetEvent.HostUser.UserId == userId {
		pendingEventCol.FindOneAndUpdate(context.TODO(), bson.M{"pendingEventId": targetEvent.PendingEventId}, bson.M{"$set": payload}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedEvent)

		updatedEventWithInfo, err := GetInfoInPendingEvent(client, updatedEvent)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		jsonRes, _ := json.Marshal(updatedEventWithInfo)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonRes)
	} else {
		fmt.Printf("HostId: %s\n", serviceAuthToken)
		http.Error(w, "Given user is not an host of target PendingEvent.", http.StatusUnauthorized)
		return
	}
}

func deletePendingEventWithId(w http.ResponseWriter, serviceAuthToken string, peId string) {
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
	userId := hostUser.UserId

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err = pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", peId}}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", peId)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	if targetEvent.HostUser.UserId != userId {
		http.Error(w, "Given user cannot delete the pending event.", http.StatusUnauthorized)
		return
	}

	_, err = pendingEventCol.DeleteOne(context.TODO(), bson.M{"pendingEventId": peId})
	if err == mongo.ErrNoDocuments {
		fmt.Printf("Cannot delete user with given userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func putPendingEventCandidate(w http.ResponseWriter, serviceAuthToken string, peId string, payload PatchPendingEventCandidatePayload) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var guestUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&guestUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err = pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", peId}}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", peId)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	updatedEvent := targetEvent
	if len(payload.AddEventTimeCandidate) > 0 {
		for i := 0; i < len(payload.AddEventTimeCandidate); i++ {
			time := payload.AddEventTimeCandidate[i]
			targetIdx := findEventTimeCandidateByUnixTime(time, updatedEvent.EventTimeCandidates)
			if targetIdx == -1 {
				log.Println("\nThe time is", time)
				http.Error(w, "AddEventTimeCandidate has invalid time", http.StatusNotAcceptable)
				return
			}
			userIdx := findUserInAcceptUsers(guestUser, updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers)
			if userIdx == -1 {
				updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers = append(updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers,
					AcceptUser{UserId: guestUser.UserId})
			}
		}
		declineIdx := findUserInDeclinedUsers(guestUser, updatedEvent.DeclinedUsers)
		if declineIdx != -1 {
			updatedEvent.DeclinedUsers = append(updatedEvent.DeclinedUsers[:declineIdx], updatedEvent.DeclinedUsers[declineIdx+1:]...)
		}
	}

	if len(payload.RemoveEventTimeCandidate) > 0 {
		for i := 0; i < len(payload.RemoveEventTimeCandidate); i++ {
			time := payload.RemoveEventTimeCandidate[i]
			targetIdx := findEventTimeCandidateByUnixTime(time, updatedEvent.EventTimeCandidates)
			if targetIdx == -1 {
				http.Error(w, "AddEventTimeCandidate has invalid time", http.StatusNotAcceptable)
				return
			}
			userIdx := findUserInAcceptUsers(guestUser, updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers)
			if userIdx == -1 {
				http.Error(w, "There is no target user in EventTimeCandidates.PossibleUsers", http.StatusNotAcceptable)
				return
			}
			updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers = append(updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers[:userIdx], updatedEvent.EventTimeCandidates[targetIdx].PossibleUsers[userIdx+1:]...)
		}
	}

	if targetEvent.HostUser.UserId == guestUser.UserId {
		fmt.Printf("HostId: %s\n", serviceAuthToken)
		http.Error(w, "Cannot modify status of Host", http.StatusNotAcceptable)
		return
	} else {
		log.Println(updatedEvent)
		pendingEventCol.FindOneAndReplace(context.TODO(), bson.M{"pendingEventId": targetEvent.PendingEventId}, updatedEvent)
		updatedEventWithInfo, err := GetInfoInPendingEvent(client, updatedEvent)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		jsonRes, _ := json.Marshal(updatedEventWithInfo)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonRes)
	}
}

func deletePendingEventCandidate(w http.ResponseWriter, serviceAuthToken string, peId string, payload DeletePendingEventCandidatePayload) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var guestUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&guestUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	pendingEventCol := client.Database("kezuler").Collection("pendingEvent")
	var targetEvent PendingEvent
	err = pendingEventCol.FindOne(context.TODO(), bson.D{{"pendingEventId", peId}}).Decode(&targetEvent)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given peId: %s\n", peId)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	updatedEvent := targetEvent
	for i := 0; i < len(updatedEvent.EventTimeCandidates); i++ {
		userIdx := findUserInAcceptUsers(guestUser, updatedEvent.EventTimeCandidates[i].PossibleUsers)
		if userIdx != -1 {
			updatedEvent.EventTimeCandidates[i].PossibleUsers = append(updatedEvent.EventTimeCandidates[i].PossibleUsers[:userIdx], updatedEvent.EventTimeCandidates[i].PossibleUsers[userIdx+1:]...)
		}
	}

	newDeclineUser := DeclineUser{
		UserId:            guestUser.UserId,
		UserDeclineReason: payload.UserDeclineReason,
	}

	updatedEvent.DeclinedUsers = append(updatedEvent.DeclinedUsers, newDeclineUser)
	if targetEvent.HostUser.UserId == guestUser.UserId {
		fmt.Printf("HostId: %s\n", serviceAuthToken)
		http.Error(w, "Cannot modify status of Host", http.StatusNotAcceptable)
		return
	} else {
		pendingEventCol.FindOneAndReplace(context.TODO(), bson.M{"pendingEventId": targetEvent.PendingEventId}, updatedEvent)
		updatedEventWithInfo, err := GetInfoInPendingEvent(client, updatedEvent)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		jsonRes, _ := json.Marshal(updatedEventWithInfo)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonRes)
	}
}

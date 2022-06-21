package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dchest/uniuri"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)

func postUser(w http.ResponseWriter, kakaoAuthToken string) {
	// KakaoAuth를 받아왔으니, 이를 바탕으로 생성
	const ClientURI string = "https://kapi.kakao.com"
	const Resource string = "/v2/user/me"

	// generate endpoint
	u, _ := url.ParseRequestURI(ClientURI)
	u.Path = Resource
	urlStr := u.String()
	authToken := "Bearer " + kakaoAuthToken

	// Add header on req
	client := &http.Client{}
	req, _ := http.NewRequest(http.MethodGet, urlStr, nil)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Authorization", authToken)
	req.Header.Add("charset", "utf-8")

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	var kakaoInfo kakaoUserInfo
	err = json.Unmarshal(body, &kakaoInfo)
	if err != nil {
		return
	}

	mongoDBClient := connect()
	defer disconnect(mongoDBClient)

	coll := mongoDBClient.Database("kezuler").Collection("user")
	var result bson.M
	err = coll.FindOne(context.TODO(), bson.D{{"userKakaoId", kakaoInfo.Id}}).Decode(&result)

	if err == mongo.ErrNoDocuments {
		postUserClaim := PostUserClaims{
			UserId:           uniuri.NewLen(8),
			UserName:         kakaoInfo.Properties.Nickname,
			UserPhoneNumber:  "010-0000-0000",
			UserProfileImage: "https://example.com",
			UserToken: UserToken{
				TokenType:             "bearer",
				AccessToken:           uniuri.NewLen(16),
				AccessTokenExpiresIn:  unixTime(time.Now().UnixMilli() + int64(259200000)),
				RefreshToken:          uniuri.NewLen(16),
				RefreshTokenExpiresIn: unixTime(time.Now().UnixMilli() + int64(2592000000)),
			},
		}
		coll.InsertOne(context.TODO(), postUserClaim)

		claimByte, err := json.Marshal(postUserClaim)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		w.Header().Set("content-type", "application/json")
		w.Write(claimByte)
	} else {
		var resStruct = PostUserClaims{}
		bsonBytes, _ := bson.Marshal(result)
		bson.Unmarshal(bsonBytes, &resStruct)
		postUserClaim := PostUserClaims{
			UserId:           resStruct.UserId,
			UserName:         resStruct.UserName,
			UserPhoneNumber:  resStruct.UserPhoneNumber,
			UserProfileImage: resStruct.UserProfileImage,
			UserToken:        resStruct.UserToken,
		}
		claimByte, err := json.Marshal(postUserClaim)
		if err != nil {
			panic(err)
		}
		w.Header().Set("content-type", "application/json")
		w.Write(claimByte)
	}
}

func getUserWithId(w http.ResponseWriter, serviceAuthToken string) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err := userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	log.Println(targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	jsonRes, err := json.Marshal(targetUser)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func patchUserWithId(w http.ResponseWriter, serviceAuthToken string, payload PatchUserPayload) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var updatedUser User
	err := userCol.FindOneAndUpdate(context.TODO(),
		bson.M{"token.accessToken": serviceAuthToken},
		bson.M{"$set": payload},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&updatedUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	log.Println(updatedUser)

	jsonRes, err := json.Marshal(updatedUser)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func deleteUserWithId(w http.ResponseWriter, serviceAuthToken string) {
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	_, err := userCol.DeleteOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken})
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

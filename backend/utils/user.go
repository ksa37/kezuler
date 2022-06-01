package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dchest/uniuri"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"io"
	"net/http"
	"net/url"
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

	kakaoInfo := kakaoUserInfo{}
	json.Unmarshal(body, &kakaoInfo)

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
				AccessTokenExpiresIn:  400,
				RefreshToken:          uniuri.NewLen(16),
				RefreshTokenExpiresIn: 1600,
			},
		}
		coll.InsertOne(context.TODO(), postUserClaim)
		fmt.Printf("YES")

		claimByte, err := json.Marshal(postUserClaim)
		if err != nil {
			panic(err)
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

	tokenCol := client.Database("kezuler").Collection("token")
	var result bson.M
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	userCol := client.Database("kezuler").Collection("user")
	err = userCol.FindOne(context.TODO(), bson.D{{"userId", result["userId"]}}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	jsonData, err := json.MarshalIndent(result, "", "    ")
	if err != nil {
		panic(err)
	}

	w.Header().Set("content-type", "application/json")
	w.Write(jsonData)
}

func patchUserWithId(w http.ResponseWriter, claim url.Values, serviceAuthToken string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var result bson.M
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	userId := result["userId"]
	userCol := client.Database("kezuler").Collection("user")
	_, err = userCol.UpdateOne(context.TODO(),
		bson.D{{"userId", userId}},
		mapToBsonD(claim),
	)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	jsonData, err := json.MarshalIndent(result, "", "    ")
	if err != nil {
		panic(err)
	}

	w.Header().Set("content-type", "application/json")
	w.Write(jsonData)
}

func deleteUserWithId(w http.ResponseWriter, serviceAuthToken string) {
	client := connect()
	defer disconnect(client)

	tokenCol := client.Database("kezuler").Collection("token")
	var result bson.M
	err := tokenCol.FindOne(context.TODO(), bson.D{{"AccessToken", serviceAuthToken}}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given  userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	userId := result["userId"]
	userCol := client.Database("kezuler").Collection("user")
	_, err = userCol.DeleteOne(context.TODO(),
		bson.D{{"userId", userId}},
	)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("Cannot delete user with given userId: %s\n", serviceAuthToken)
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

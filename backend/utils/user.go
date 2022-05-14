package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"io"
	"net/http"
	"net/url"
	"time"
)

var expirationTime = 5 * time.Minute

var JwtKey = []byte("MySecretKey") // JWT Key를 담당

var users = map[string]string{
	"user1": "pw1",
	"user2": "pw2",
} // 해답 코드

type Credentials struct {
	UserId   string `json: "userId"`
	UserName string `json: "userName"`
}

type Claims struct {
	UserId   string `json: "userId"`
	UserName string `json: "userName"`
	jwt.StandardClaims
}

func PostUser(w http.ResponseWriter, r *http.Request, kakaoAuthToken string) {
	// KakaoAuth를 받아왔으니, 이를 바탕으로 생성
	const ClientURI string = "https://kapi.kakao.com"
	const Resource string = "/v2/user/me"

	// generate endpoint
	u, _ := url.ParseRequestURI(ClientURI)
	u.Path = Resource
	urlStr := u.String()
	authToken := "Bearer " + kakaoAuthToken

	fmt.Printf("%s %s", urlStr, authToken)
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

	w.Header().Set("content-type", "application/json")
	w.Write(body)

	// 받아온 body에서 id를 검색
	//// 만약 id가 있다? 해당하는 정보를 바탕으로 accessToken 전달
	//// 만약 id가 없다? 새로운 document 생성 후 accessToken 전달

	body
}

func GetUser(serviceAuthToken string) {
	// JWT 검증

	// JWT의 Payload에 다음과 같은 정보 참조
	//{
	//  "userId": 123123
	//  "accessData": ["...", "...", ...]
	//}

	// 연결 후 DB Collection 다루기
	client := connect()
	defer disconnect(client)

	coll := client.Database("kezuler").Collection("user")
	var result bson.M
	err := coll.FindOne(context.TODO(), bson.D{{"userId", serviceAuthToken}}).Decode(&result)

	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with the userId: %s\n", serviceAuthToken)
		return
	}

	if err != nil {
		panic(err)
	}

	jsonData, err := json.MarshalIndent(result, "", "    ")
	if err != nil {
		panic(err)
	}

	fmt.Printf("%s\n", jsonData)
}

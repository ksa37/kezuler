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
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

func postUser(w http.ResponseWriter, kakaoAuthToken string) {
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
	var result User
	err = coll.FindOne(context.TODO(), bson.D{{"kakaoId", kakaoInfo.Id}}).Decode(&result)

	if err == mongo.ErrNoDocuments {
		newUserId := uniuri.NewLen(8)
		newProfileImagePath := "https://kezuler-images.s3.ap-northeast-2.amazonaws.com/profileImage/" + newUserId + ".png"
		newProfileImage := kakaoInfo.KakaoAccount.Profile.ThumbnailImageUrl
		err := s3UploadImage(newUserId, newProfileImage)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		postUserClaim := User{
			UserId:       newUserId,
			Name:         kakaoInfo.KakaoAccount.Profile.Nickname,
			Email:        kakaoInfo.KakaoAccount.Email,
			PhoneNumber:  kakaoInfo.KakaoAccount.PhoneNumber,
			Timezone:     "Asia/Seoul",
			KakaoId:      kakaoInfo.Id,
			ProfileImage: newProfileImagePath,
			Token: Token{
				Type:                  "bearer",
				AccessToken:           uniuri.NewLen(16),
				AccessTokenExpiresAt:  unixTime(time.Now().UnixMilli() + int64(259200000)),
				RefreshToken:          uniuri.NewLen(16),
				RefreshTokenExpiresAt: unixTime(time.Now().UnixMilli() + int64(2592000000)),
			},
		}
		coll.InsertOne(context.TODO(), postUserClaim)

		claimByte, err := json.Marshal(postUserClaim)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("content-type", "application/json")
		_, err = w.Write(claimByte)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Send Alimtalk when new user is created
		err = postUserAlimTalk(postUserClaim)
		if err != nil {
			log.Println(err)
		}
	} else {
		jsonRes, err := json.Marshal(result)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(jsonRes)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
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
	_, err = w.Write(jsonRes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
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
	_, err = w.Write(jsonRes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func patchUseProfileImageWithId(w http.ResponseWriter, r *http.Request, serviceAuthToken string) {
	err := r.ParseMultipartForm(32 << 20) // Max Memory: 32MB
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//Access the photo key - First Approach
	file, fileHeader, err := r.FormFile("profileImage")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Println(fileHeader.Size)
	defer file.Close()

	//create destination file making sure the path is writeable.
	tmpFile, err := ioutil.TempFile(os.TempDir(), "*.png")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println(tmpFile.Name())
	// cleaning up by removing the file
	defer os.Remove(tmpFile.Name())

	//copy the uploaded file to the destination file
	if _, err := io.Copy(tmpFile, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fi, _ := tmpFile.Stat()
	log.Println(fi.Size())
	client := connect()
	defer disconnect(client)

	userCol := client.Database("kezuler").Collection("user")
	var targetUser User
	err = userCol.FindOne(context.TODO(), bson.M{"token.accessToken": serviceAuthToken}).Decode(&targetUser)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No Document was found with given token: %s\n", serviceAuthToken)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	err = s3UploadImageWithFile(targetUser.UserId, tmpFile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	jsonRes, err := json.Marshal(targetUser)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(jsonRes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
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

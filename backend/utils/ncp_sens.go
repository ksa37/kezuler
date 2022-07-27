package utils

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"
)

func createNcpSignature(method string, uri string, timestamp string, accessKey string, secretKey string) string {
	//TODO: Use Secret Key for encoding
	message := method + " " + uri + "\n" + timestamp + "\n" + accessKey

	hmacMessage := hmac.New(sha256.New, []byte(secretKey))
	hmacMessage.Write([]byte(message))
	b64Message := base64.StdEncoding.EncodeToString(hmacMessage.Sum(nil))
	fmt.Println(b64Message)
	return b64Message
}

func postUserAlimTalk(user User) error {
	b, err := ioutil.ReadFile("./utils/ncp_config.json")
	if err != nil {
		panic(err)
	}
	var data NcpAuthInfo
	err = json.Unmarshal(b, &data)
	if err != nil {
		log.Println("Error occurred while unmarshalling data")
		return err
	}
	const ClientURI string = "https://sens.apigw.ntruss.com/alimtalk/v2"
	const Method string = "POST"
	resource := "/services/" + data.ServiceId + "/messages"

	log.Println(data.ServiceId, data.AccessKey, data.SecretKey)
	log.Println(resource)
	// generate endpoint
	u, _ := url.ParseRequestURI(ClientURI)
	u.Path = resource
	urlStr := u.String()
	log.Println(urlStr)

	newAlimTalk := AlimTalkMessageInfo{
		To: user.PhoneNumber,
	}

	requestPayload := PostUserAlimTalkRequestPayload{
		PlusFriendId: "_VxoHtb",
		TemplateCode: "signup",
		Messages:     []AlimTalkMessageInfo{newAlimTalk},
	}

	reqPayloadJson, err := json.Marshal(requestPayload)
	// Add header on req
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodPost, urlStr, bytes.NewBuffer(reqPayloadJson))
	if err != nil {
		log.Println("Error occured while creating NewRequest")
	}
	currentTime := time.Now().String()
	stringToSign := createNcpSignature(Method, resource, currentTime, data.AccessKey, data.SecretKey)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("x-ncp-apigw-timestamp", currentTime)
	req.Header.Add("x-ncp-iam-access-key", data.AccessKey)
	req.Header.Add("x-ncp-apigw-signature-v2", stringToSign)

	res, err := client.Do(req)
	if err != nil {
		log.Print("Error occured while sending request")
		return err
	}
	log.Print(res.StatusCode)
	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Print("Error occured while reading response")
		return err
	}
	log.Print(string(body))
	var responsePayload PostUserAlimTalkResponsePayload
	err = json.Unmarshal(body, &responsePayload)
	if err != nil {
		log.Print("Error occured while unmarshalling res body")
		return err
	}

	log.Print(responsePayload)
	if responsePayload.StatusCode != "202" {
		return fmt.Errorf("error Occured in sending AlimTalk: %s", responsePayload.StatusName)
	}

	return nil
}

func AlimTalkTest(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadFile("./utils/ncp_config.json")
	if err != nil {
		panic(err)
	}
	var data NcpAuthInfo
	err = json.Unmarshal(b, &data)
	if err != nil {
		log.Println("Error occured while unmarshalling data")
		panic(err)
	}

	const ClientURI string = "https://sens.apigw.ntruss.com"
	const Method string = "POST"
	resource := "/alimtalk/v2/services/" + url.QueryEscape(data.ServiceId) + "/messages"
	// generate endpoint
	u, _ := url.ParseRequestURI(ClientURI)
	u.Path = resource
	urlStr := u.String()
	fmt.Println(urlStr)
	newAlimTalk := AlimTalkMessageInfo{
		To: "010-4886-5432",
	}

	requestPayload := PostUserAlimTalkRequestPayload{
		PlusFriendId: "_VxoHtb",
		TemplateCode: "signup",
		Messages:     []AlimTalkMessageInfo{newAlimTalk},
	}

	reqPayloadJson, err := json.Marshal(requestPayload)
	fmt.Println(requestPayload)
	// Add header on req
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodPost, urlStr, bytes.NewBuffer(reqPayloadJson))
	if err != nil {
		log.Println("Error Occurred while creating NewRequest")
	}

	currentTime := time.Now().String()
	stringToSign := createNcpSignature(Method, resource, currentTime, data.AccessKey, data.SecretKey)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("x-ncp-apigw-timestamp", currentTime)
	req.Header.Add("x-ncp-iam-access-key", data.AccessKey)
	req.Header.Add("x-ncp-apigw-signature-v2", stringToSign)

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}
	print(string(body))
	var responsePayload PostUserAlimTalkResponsePayload
	err = json.Unmarshal(body, &responsePayload)
	if err != nil {
		panic(err)
	}
	if responsePayload.StatusCode != "202" {
		log.Println(responsePayload.StatusCode)
		w.WriteHeader(400)
	}
}

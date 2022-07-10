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
	"net/http"
	"net/url"
	"time"
)

func createNcpSignature(method string, uri string, timestamp string, accessKey string) string {
	//TODO: Use Secret Key for encoding
	message := method + " " + uri + "\n" + timestamp + "\n" + accessKey

	hmacMessage := hmac.New(sha256.New, []byte(message))
	b64Message := base64.StdEncoding.EncodeToString(hmacMessage.Sum(nil))
	return b64Message
}

func postUserAlimTalk(user User) error {
	b, err := ioutil.ReadFile("./utils/ncp_config.json")
	if err != nil {
		panic(err)
	}
	var data NcpAuthInfo
	json.Unmarshal(b, &data)

	const ClientURI string = "https://sens.apigw.ntruss.com"
	const Method string = "POST"
	resource := fmt.Sprintf("/alimtalk/v2/services/{%s}/messages", data.serviceId)

	// generate endpoint
	u, _ := url.ParseRequestURI(ClientURI)
	u.Path = resource
	urlStr := u.String()

	newAlimTalk := AlimTalkMessageInfo{
		To: user.PhoneNumber,
	}

	requestPayload := PostUserAlimTalkRequestPayload{
		PlusFriendId: "_VxoHtb",
		TemplateCode: "signup",
		Messages:     []AlimTalkMessageInfo{newAlimTalk},
	}

	var bufferPayload bytes.Buffer
	reqPayloadJson, err := json.Marshal(requestPayload)
	err = json.NewEncoder(&bufferPayload).Encode(requestPayload)
	if err != nil {
		return err
	}
	// Add header on req
	client := &http.Client{}
	req, _ := http.NewRequest(http.MethodPost, urlStr, bytes.NewBuffer(reqPayloadJson))
	currentTime := time.Now().String()
	stringToSign := createNcpSignature(Method, resource, currentTime, data.AccessKey)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("x-ncp-apigw-timestamp", currentTime)
	req.Header.Add("x-ncp-iam-access-key", data.AccessKey)
	req.Header.Add("x-ncp-apigw-signature-v2", stringToSign)

	res, err := client.Do(req)
	if err != nil {
		return err
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var responsePayload PostUserAlimTalkResponsePayload
	err = json.Unmarshal(body, &responsePayload)
	if err != nil {
		return err
	}

	if responsePayload.StatusCode != "202" {
		return fmt.Errorf("error Occured in sending AlimTalk: %s", responsePayload.StatusName)
	}

	return nil
}

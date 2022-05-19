package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"io/ioutil"
)

type MongoDBAuthInfo struct {
	Username   string `json:"username"`
	Password   string `json:"password"`
	Hostname   string `json:"hostname"`
	Port       string `json:"port"`
	PrimaryDB  string `json:"primary_db"`
	Parameters string `json:"parameters"`
}

func connect() *mongo.Client {
	b, err := ioutil.ReadFile("./utils/mongodb_auth.json")
	if err != nil {
		panic(err)
	}
	var data MongoDBAuthInfo
	json.Unmarshal(b, &data)

	uri := fmt.Sprintf("mongodb+srv://%s:%s@%s/%s?%s", data.Username, data.Password, data.Hostname, data.PrimaryDB, data.Parameters)

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	return client
}

func disconnect(client *mongo.Client) {
	if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
}

package utils

import (
	"go.mongodb.org/mongo-driver/bson"
	"net/url"
)

func mapToBsonD(fields url.Values) bson.D {
	var mapBson bson.D
	for field, value := range fields {
		mapBson = append(mapBson, bson.E{Key: field, Value: value})
	}
	bson.Marshal(mapBson)
	return mapBson
}

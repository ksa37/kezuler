package utils

import (
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"io"
	"io/ioutil"
	"log"
	"os"
)

func awsConnect() (*session.Session, error) {
	b, err := ioutil.ReadFile("./utils/s3_config.json")
	if err != nil {
		panic(err)
	}

	var data S3AuthInfo
	err = json.Unmarshal(b, &data)
	if err != nil {
		return nil, err
	}
	log.Printf("%s %s", data.AwsRegion, data.AwsAccessKeyId)
	sess, err := session.NewSession(
		&aws.Config{
			Region: aws.String(data.AwsRegion),
			Credentials: credentials.NewStaticCredentials(
				data.AwsAccessKeyId,
				data.AwsSecretAccessKey,
				"", // a token will be created when the session it's used.
			),
		})

	if err != nil {
		return nil, err
	}

	return sess, nil
}

func s3UploadImageWithFile(userId string, file *os.File) (err error) {
	fi, _ := file.Stat()
	log.Println(fi.Size())

	sess, err := awsConnect()
	if err != nil {
		return err
	}
	uploader := s3manager.NewUploader(sess)

	file.Seek(0, io.SeekStart)
	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String("kezuler-images"),
		Key:    aws.String("profileImage/" + userId + ".png"),
		Body:   file,
	})

	if err != nil {
		return err
	}

	return nil
}

func s3UploadImage(userId string, url string) (err error) {
	tmpFile, err := ioutil.TempFile(os.TempDir(), "pre-")
	if err != nil {
		fmt.Println("Cannot create temporary file", err)
	}
	// cleaning up by removing the file
	defer os.Remove(tmpFile.Name())

	err = downloadImage(tmpFile, url)
	if err != nil {
		return err
	}

	sess, err := awsConnect()
	if err != nil {
		return err
	}
	uploader := s3manager.NewUploader(sess)

	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String("kezuler-images"),
		Key:    aws.String("profileImage/" + userId + ".png"),
		Body:   tmpFile,
	})

	if err != nil {
		return err
	}

	return nil
}

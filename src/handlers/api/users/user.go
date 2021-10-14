package main

import (
	"crypto/md5"
	"encoding/hex"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type (
	userItem struct {
		PK   string
		SK   string
		Type string `json:"type"`
		User
	}

	User struct {
		ID        string `json:"id"`
		Email     string `json:"email"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}
)

func (u *User) Create() error {
	session := session.Must(session.NewSession())
	svc := dynamodb.New(session)

	h := md5.Sum([]byte(u.Email))
	u.ID = hex.EncodeToString(h[:])

	item := userItem{
		PK:   "U:" + u.ID,
		SK:   "U:" + u.ID,
		Type: "USER",
		User: *u,
	}

	av, err := dynamodbattribute.MarshalMap(item)
	if err != nil {
		return err
	}

	tableName := os.Getenv("TABLE_NAME")
	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}
	_, err = svc.PutItem(input)
	if err != nil {
		return err
	}

	return nil
}

func GetUserByID(id string) (*User, error) {
	session := session.Must(session.NewSession())
	svc := dynamodb.New(session)

	userID := "U:" + id

	tableName := os.Getenv("TABLE_NAME")
	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(userID),
			},
			"SK": {
				S: aws.String(userID),
			},
		},
	})
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil
	}

	user := &User{}
	err = dynamodbattribute.UnmarshalMap(result.Item, &user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

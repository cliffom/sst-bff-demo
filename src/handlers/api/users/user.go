package main

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
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
		Created   string `json:"created"`
	}
)

func CreateUser(dbSvc dynamodbiface.DynamoDBAPI, u *User) error {
	u.Created = NewTime().String()
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
		Item:                av,
		TableName:           aws.String(tableName),
		ConditionExpression: aws.String("attribute_not_exists(PK) AND attribute_not_exists(SK)"),
	}
	_, err = dbSvc.PutItem(input)
	if err != nil {
		return err
	}

	return nil
}

func GetUserByID(dbSvc dynamodbiface.DynamoDBAPI, id string) (*User, error) {
	userID := "U:" + id

	tableName := os.Getenv("TABLE_NAME")
	result, err := dbSvc.GetItem(&dynamodb.GetItemInput{
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

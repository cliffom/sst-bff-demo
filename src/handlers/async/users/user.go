package main

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

const (
	userEntryType = "USER"
	userPKPrefix  = "U:"
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

func (u *User) GetID() string {
	return userPKPrefix + u.ID
}

func CreateUser(dbSvc dynamodbiface.DynamoDBAPI, u *User) error {
	u.Created = NewTime().String()
	item := userItem{
		PK:   u.GetID(),
		SK:   u.GetID(),
		Type: userEntryType,
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

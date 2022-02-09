package user_schema

import (
	"os"
	"time"

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

// GetID returns a formated user ID based on the PK scheme
func (u *User) GetID() string {
	return userPKPrefix + u.ID
}

// CreateUser creates a user record
func CreateUser(dbSvc dynamodbiface.DynamoDBAPI, u *User) error {
	u.Created = time.Now().UTC().Format(time.RFC3339)
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

// UpdateUser updates the appropriate fields for a user
func UpdateUser(dbSvc dynamodbiface.DynamoDBAPI, u *User) error {
	tableName := os.Getenv("TABLE_NAME")
	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":fn": {
				S: aws.String(u.FirstName),
			},
			":ln": {
				S: aws.String(u.LastName),
			},
		},
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(u.GetID()),
			},
			"SK": {
				S: aws.String(u.GetID()),
			},
		},
		ReturnValues:     aws.String("ALL_NEW"),
		UpdateExpression: aws.String("set firstName = :fn, lastName = :ln"),
	}

	_, err := dbSvc.UpdateItem(input)
	return err
}

// GetUserByID queries a user by a given ID
func GetUserByID(dbSvc dynamodbiface.DynamoDBAPI, id string) (*User, error) {
	userID := userPKPrefix + id

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

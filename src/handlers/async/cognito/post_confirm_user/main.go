package main

import (
	"context"
	"errors"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

func Handler(ctx context.Context, dbSvc dynamodbiface.DynamoDBAPI, req events.CognitoEventUserPoolsPostConfirmation) (events.CognitoEventUserPoolsPostConfirmation, error) {
	user, err := getUserFromEvent(&req.Request)
	if err != nil {
		log.Printf("could not get user from event: %v", err)
	}

	if err := createUser(dbSvc, *user); err != nil {
		log.Printf("could not save user to table: %v", err)
	} else {
		log.Printf("successfully saved user to table")
	}

	return req, nil
}

// handler is a wrapper to Handler and allows us to setup dependencies
// for easier testing of Handler
func handler(ctx context.Context, req events.CognitoEventUserPoolsPostConfirmation) (events.CognitoEventUserPoolsPostConfirmation, error) {
	session := session.Must(session.NewSession())
	dbSvc := dynamodb.New(session)

	return Handler(ctx, dbSvc, req)
}

func main() {
	lambda.Start(handler)
}

func getUserFromEvent(event *events.CognitoEventUserPoolsPostConfirmationRequest) (*User, error) {
	id, ok := event.UserAttributes["sub"]
	if !ok {
		return nil, errors.New("could not get userID from event")
	}

	email, ok := event.UserAttributes["email"]
	if !ok {
		return nil, errors.New("could not get email from event")
	}

	firstName, ok := event.UserAttributes["given_name"]
	if !ok {
		firstName = ""
	}

	lastName, ok := event.UserAttributes["family_name"]
	if !ok {
		lastName = ""
	}

	return &User{
		ID:        id,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
	}, nil
}

func createUser(dbSvc dynamodbiface.DynamoDBAPI, user User) error {
	return CreateUser(dbSvc, &user)
}

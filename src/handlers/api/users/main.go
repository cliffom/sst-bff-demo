package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

// Handler is the main function that handles the request
func Handler(ctx context.Context, dbSvc dynamodbiface.DynamoDBAPI, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	userFromJWT, err := getUserFromJWT(req.RequestContext.Authorizer.JWT)
	if err != nil {
		// we should never enter this conditional as auth is handled at the APIG
		// but we do this just in case.
		return response(http.StatusUnauthorized, ""), err
	}

	switch httpMethod := req.RequestContext.HTTP.Method; httpMethod {
	case http.MethodGet:
		return getUserByID(dbSvc, userFromJWT.ID)

	case http.MethodPost:
		if err := json.Unmarshal([]byte(req.Body), &userFromJWT); err != nil {
			return response(http.StatusInternalServerError, ""), err
		}
		return createUser(dbSvc, *userFromJWT)
	}

	return response(http.StatusMethodNotAllowed, ""), nil
}

// handler is a wrapper to Handler and allows us to setup dependencies
// for easier testing of Handler
func handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	session := session.Must(session.NewSession())
	dbSvc := dynamodb.New(session)

	return Handler(ctx, dbSvc, req)
}

func main() {
	lambda.Start(handler)
}

func createUser(dbSvc dynamodbiface.DynamoDBAPI, userToCreate User) (events.APIGatewayProxyResponse, error) {
	if err := CreateUser(dbSvc, &userToCreate); err != nil {
		errJSON, _ := json.Marshal(err)
		return response(http.StatusConflict, string(errJSON)), nil
	}

	u, _ := json.Marshal(userToCreate)
	return response(http.StatusCreated, string(u)), nil
}

func getUserFromJWT(jwt *events.APIGatewayV2HTTPRequestContextAuthorizerJWTDescription) (*User, error) {
	id, ok := jwt.Claims["sub"]
	if !ok {
		return nil, errors.New("could not get userID from JWT claims")
	}

	email, ok := jwt.Claims["email"]
	if !ok {
		return nil, errors.New("could not get email from JWT claims")
	}

	firstName, ok := jwt.Claims["given_name"]
	if !ok {
		return nil, errors.New("could not get given_name from JWT claims")
	}

	lastName, ok := jwt.Claims["family_name"]
	if !ok {
		return nil, errors.New("could not get family_name from JWT claims")
	}

	return &User{
		ID:        id,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
	}, nil
}

func getUserByID(dbSvc dynamodbiface.DynamoDBAPI, id string) (events.APIGatewayProxyResponse, error) {
	user, _ := GetUserByID(dbSvc, id)
	u, err := json.Marshal(user)
	if err != nil {
		return response(http.StatusInternalServerError, ""), err
	}

	return response(http.StatusOK, string(u)), nil
}

func response(statusCode int, body string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"content-type": "application/json",
		},
		MultiValueHeaders: map[string][]string{},
		Body:              body,
		IsBase64Encoded:   false,
	}
}

package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// Handler is the main function that handles the request
func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	session := session.Must(session.NewSession())
	svc := dynamodb.New(session)

	switch httpMethod := req.RequestContext.HTTP.Method; httpMethod {
	case http.MethodGet:
		return getUser(svc, req.PathParameters["id"])

	case http.MethodPut:
		var user User
		if err := json.Unmarshal([]byte(req.Body), &user); err != nil {
			return response(http.StatusInternalServerError, ""), err
		}
		return createUser(svc, user)
	}

	return response(http.StatusMethodNotAllowed, ""), nil
}

// handler is a wrapper to Handler and allows us to setup dependencies
// for easier testing of Handler
func handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	return Handler(ctx, req)
}

func main() {
	lambda.Start(handler)
}

func createUser(svc *dynamodb.DynamoDB, userToCreate User) (events.APIGatewayProxyResponse, error) {
	if err := CreateUser(svc, &userToCreate); err != nil {
		log.Printf("error: %v", err)
	}

	u, _ := json.Marshal(userToCreate)
	return response(http.StatusCreated, string(u)), nil
}

func getUser(svc *dynamodb.DynamoDB, id string) (events.APIGatewayProxyResponse, error) {
	user, _ := GetUserByID(svc, id)
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

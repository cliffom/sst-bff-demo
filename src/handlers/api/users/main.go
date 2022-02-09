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
	"github.com/cliffom/sst-bff-demo/src/schemas/user_schema"
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

	case http.MethodPatch:
		targetUser, _ := user_schema.GetUserByID(dbSvc, userFromJWT.ID)
		var srcUser *user_schema.User
		json.Unmarshal([]byte(req.Body), &srcUser)

		return updateUser(dbSvc, targetUser, srcUser)
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

func getUserFromJWT(jwt *events.APIGatewayV2HTTPRequestContextAuthorizerJWTDescription) (*user_schema.User, error) {
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
		firstName = ""
	}

	lastName, ok := jwt.Claims["family_name"]
	if !ok {
		lastName = ""
	}

	return &user_schema.User{
		ID:        id,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
	}, nil
}

func getUserByID(dbSvc dynamodbiface.DynamoDBAPI, id string) (events.APIGatewayProxyResponse, error) {
	user, _ := user_schema.GetUserByID(dbSvc, id)
	u, err := json.Marshal(user)
	if err != nil {
		return response(http.StatusInternalServerError, ""), err
	}

	return response(http.StatusOK, string(u)), nil
}

func updateUser(dbSvc dynamodbiface.DynamoDBAPI, targetUser, srcUser *user_schema.User) (events.APIGatewayProxyResponse, error) {
	if len(srcUser.FirstName) > 0 {
		targetUser.FirstName = srcUser.FirstName
	}

	if len(srcUser.LastName) > 0 {
		targetUser.LastName = srcUser.LastName
	}

	if err := user_schema.UpdateUser(dbSvc, targetUser); err != nil {
		return response(http.StatusInternalServerError, ""), err
	}

	u, _ := json.Marshal(targetUser)

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

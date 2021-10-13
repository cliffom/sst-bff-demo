package main

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Handler is the main function that handles the request
func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode:        http.StatusOK,
		Headers:           map[string]string{},
		MultiValueHeaders: map[string][]string{},
		Body:              "Your request was received at " + req.RequestContext.Time + ".",
		IsBase64Encoded:   false,
	}, nil
}

// handler is a wrapper to Handler and allows us to setup dependencies
// for easier testing of Handler
func handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	return Handler(ctx, req)
}

func main() {
	lambda.Start(handler)
}

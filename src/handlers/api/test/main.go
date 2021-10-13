package main

import (
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode:        http.StatusOK,
		Headers:           map[string]string{},
		MultiValueHeaders: map[string][]string{},
		Body:              "Your request was received at " + request.RequestContext.Time + ".",
		IsBase64Encoded:   false,
	}, nil
}

func main() {
	lambda.Start(Handler)
}

package main

import (
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/stretchr/testify/assert"
)

type mockDynamoDBClient struct {
	dynamodbiface.DynamoDBAPI
}

func (m *mockDynamoDBClient) PutItem(*dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error) {
	return nil, nil
}

func (m *mockDynamoDBClient) GetItem(*dynamodb.GetItemInput) (*dynamodb.GetItemOutput, error) {
	return &dynamodb.GetItemOutput{
		ConsumedCapacity: &dynamodb.ConsumedCapacity{},
		Item: map[string]*dynamodb.AttributeValue{
			"id":        {S: aws.String("123")},
			"firstName": {S: aws.String("Firstname")},
			"lastName":  {S: aws.String("Lastname")},
			"email":     {S: aws.String("email@address.com")},
		},
	}, nil
}

func TestCreateUser(t *testing.T) {
	mockSvc := &mockDynamoDBClient{}
	u := &User{
		FirstName: "Firstname",
		LastName:  "Lastname",
		Email:     "email@address.com",
	}
	err := CreateUser(mockSvc, u)

	assert.NoError(t, err)
	assert.NotEmpty(t, u.ID)
}

func TestGetUserByID(t *testing.T) {
	mockSvc := &mockDynamoDBClient{}
	mockUser := &User{
		ID:        "123",
		FirstName: "Firstname",
		LastName:  "Lastname",
		Email:     "email@address.com",
	}
	u, err := GetUserByID(mockSvc, "123")

	assert.NoError(t, err)
	assert.Equal(t, u, mockUser)

}

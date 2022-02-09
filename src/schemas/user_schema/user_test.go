package user_schema

import (
	"math/rand"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/stretchr/testify/assert"
)

type mockDynamoDBClient struct {
	dynamodbiface.DynamoDBAPI
	fakerSeed int64
}

func (m *mockDynamoDBClient) PutItem(*dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error) {
	return nil, nil
}

func (m *mockDynamoDBClient) GetItem(*dynamodb.GetItemInput) (*dynamodb.GetItemOutput, error) {
	gofakeit.Seed(m.fakerSeed)
	return &dynamodb.GetItemOutput{
		ConsumedCapacity: &dynamodb.ConsumedCapacity{},
		Item: map[string]*dynamodb.AttributeValue{
			"id":        {S: aws.String(gofakeit.LetterN(16))},
			"firstName": {S: aws.String(gofakeit.FirstName())},
			"lastName":  {S: aws.String(gofakeit.LastName())},
			"email":     {S: aws.String(gofakeit.Email())},
		},
	}, nil
}

func TestCreateUser(t *testing.T) {
	mockSvc := &mockDynamoDBClient{}
	u := &User{
		ID:        gofakeit.UUID(),
		FirstName: gofakeit.FirstName(),
		LastName:  gofakeit.LastName(),
		Email:     gofakeit.Email(),
	}
	err := CreateUser(mockSvc, u)

	assert.NoError(t, err)
	assert.NotEmpty(t, u.ID)
}

func TestGetUserByID(t *testing.T) {
	seed := rand.Int63n(100)
	gofakeit.Seed(seed)

	userID := gofakeit.LetterN(16)
	mockSvc := &mockDynamoDBClient{
		fakerSeed: seed,
	}

	mockUser := &User{
		ID:        userID,
		FirstName: gofakeit.FirstName(),
		LastName:  gofakeit.LastName(),
		Email:     gofakeit.Email(),
	}
	u, err := GetUserByID(mockSvc, userID)

	assert.NoError(t, err)
	assert.Equal(t, u, mockUser)

}

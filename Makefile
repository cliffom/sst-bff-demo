API_BASE_PATH=src/handlers/api
COGNITO_COMMAND=aws cognito-idp
REGION ?= us-east-1

.PHONY: delete-user
delete-user:
	@$(COGNITO_COMMAND) admin-delete-user \
	--region $(REGION) \
	--user-pool-id $(USER_POOL_ID) \
	--username $(EMAIL)

.PHONY: test
test:
	cd $(API_BASE_PATH)/users && go test

.PHONY: token
token:
	@$(COGNITO_COMMAND) initiate-auth \
    --region $(REGION) \
    --client-id $(CLIENT_ID) \
    --auth-flow USER_PASSWORD_AUTH \
    --auth-parameters USERNAME=$(EMAIL),PASSWORD=$(PASSWORD) \
    | jq -r '.AuthenticationResult.IdToken'

.PHONY: user
user:
	@$(COGNITO_COMMAND) sign-up \
		--region $(REGION) \
		--client-id $(CLIENT_ID) \
		--username $(EMAIL) \
		--password $(PASSWORD)

	@$(COGNITO_COMMAND) admin-confirm-sign-up \
		--region $(REGION) \
		--user-pool-id $(USER_POOL_ID) \
		--username $(EMAIL)

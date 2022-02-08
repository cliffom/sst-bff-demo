API_BASE_PATH=src/handlers/api
COGNITO_COMMAND=aws cognito-idp
REGION ?= us-east-1

.PHONY: test
test:
	cd $(API_BASE_PATH)/users && go test

# helper commands to manage users
.PHONY: create-user
create-user:
	@$(COGNITO_COMMAND) sign-up \
		--no-cli-pager \
		--region $(REGION) \
		--client-id $(CLIENT_ID) \
		--username $(EMAIL) \
		--password $(PASSWORD)

	@$(COGNITO_COMMAND) admin-confirm-sign-up \
		--region $(REGION) \
		--user-pool-id $(USER_POOL_ID) \
		--username $(EMAIL)

.PHONY: delete-user
delete-user:
	@$(COGNITO_COMMAND) admin-delete-user \
		--region $(REGION) \
		--user-pool-id $(USER_POOL_ID) \
		--username $(EMAIL)

.PHONY: user-token
user-token:
	@$(COGNITO_COMMAND) initiate-auth \
		--region $(REGION) \
		--client-id $(CLIENT_ID) \
		--auth-flow USER_PASSWORD_AUTH \
		--auth-parameters USERNAME=$(EMAIL),PASSWORD=$(PASSWORD) \
		| jq -r '.AuthenticationResult.IdToken'


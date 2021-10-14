API_BASE_PATH=src/handlers/api

.PHONY: test
test:
	cd $(API_BASE_PATH)/users && go test

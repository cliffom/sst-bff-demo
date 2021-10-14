# sst-bff-demo [![lint](https://github.com/cliffom/sst-bff-demo/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/cliffom/sst-bff-demo/actions/workflows/lint.yml) [![deploy](https://github.com/cliffom/sst-bff-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/cliffom/sst-bff-demo/actions/workflows/deploy.yml)

A demonstration of how to use SST to build and deploy a GraphQL endpoint with backing services
written in Go.

This project was bootstrapped with
[Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ yarn install
```

### What this is

A sample application demonstrating how to build different services deployed as
Lambda functions.

Here we build and deploy 3 Lambda functions:
- One Lambda function with the NodeJS runtime for Apollo Server (Apollo Stack)
- One Lambda function with the Go runtime for user services (API Stack)
- One Lambda function with the Go runtime as a test route (API Stack)

Though the API Gateways fronting Apollo Server and API stacks are accessible
individually, here we are demonstrating using the RESTful API stack as a
datasource for the Apollo Server.

To demonstrate connection to a DynamoDB table from the RESTful services, a
DynamoDB table is created and accessible by the API stack.

Example Request Path:

```
User->API Gateway->Apollo Stack->API Gateway->API Stack
```

## Commands

### `yarn run start`

Starts the local Lambda development environment.

### `yarn run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the
synthesized CloudFormation stacks.

### `yarn run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy a specific stack.

### `yarn run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally remove a specific stack.

### `yarn run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Documentation

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or
[post on our forums](https://discourse.serverless-stack.com).

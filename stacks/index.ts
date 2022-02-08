import * as sst from '@serverless-stack/resources';
import {RemovalPolicy} from 'aws-cdk-lib';

import AuthStack from './AuthStack';
import TableStack from './TableStack';

import TestAPIStack from './test_api/TestAPIStack';
import UsersAPIStack from './users_api/UsersAPIStack';
import UsersAsyncStack from './users_async/UsersAsyncStack';
import ApolloStack from './ApolloStack';

export default function main(app: sst.App): void {
  // Remove all resources when non-prod stages are removed
  // https://docs.serverless-stack.com/constructs/App#setting-a-default-removal-policy
  if (app.stage !== 'prod') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }

  // Create our single DynamoDB table
  const tableStack = new TableStack(app, 'table-stack');

  // Create our Aynsc users stack
  const usersAsyncStack = new UsersAsyncStack(app, 'users-async-stack', {
    table: tableStack.table,
  });

  // Create our Auth stack that defines our Cognito pool and client
  const authStack = new AuthStack(app, 'auth-stack', {
    postConfirmationFunction: usersAsyncStack.createUserFunction,
  });

  // Create a simple, test API consisting of a single Lambda function
  // fronted with an API Gateway
  /* eslint-disable-next-line no-new */
  new TestAPIStack(app, 'test-api-stack');

  // Create our Users API
  const usersAPIStack = new UsersAPIStack(app, 'users-api-stack', {
    authorizer: authStack.authorizer,
    table: tableStack.table,
  });

  // Create the Apollo stack where the Apollo Server is defined
  /* eslint-disable-next-line no-new */
  new ApolloStack(app, 'apollo-stack', {
    usersAPI: usersAPIStack.api,
  });
}

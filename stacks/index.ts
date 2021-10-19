import * as sst from '@serverless-stack/resources';
import {RemovalPolicy} from '@aws-cdk/core';
import ApolloStack from './ApolloStack';
import APIStack from './APIStack';
import AuthStack from './AuthStack';

export default function main(app: sst.App): void {
  // Remove all resources when non-prod stages are removed
  // https://docs.serverless-stack.com/constructs/App#setting-a-default-removal-policy
  if (app.stage !== 'prod') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }

  // Create our Auth stack that defines our Cognito pool and client
  const authStack = new AuthStack(app, 'auth-stack');

  // Create the API stack where all services are defined
  const apiStack = new APIStack(app, 'api-stack', {authorizer: authStack.authorizer});

  // Create the Apollo stack where the Apollo Server is defined
  /* eslint-disable no-new */
  new ApolloStack(app, 'apollo-stack', {api: apiStack.api});
}

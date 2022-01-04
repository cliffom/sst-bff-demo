import * as cognito from '@aws-cdk/aws-cognito';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';
import * as sst from '@serverless-stack/resources';
import {Duration} from '@aws-cdk/core';

export default class AuthStack extends sst.Stack {
  public readonly authorizer: apigAuthorizers.HttpUserPoolAuthorizer;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: {email: true},
      signInCaseSensitive: false,
    });

    // Create User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: {userPassword: true},
      idTokenValidity: Duration.days(1),
    });

    this.authorizer = new apigAuthorizers.HttpUserPoolAuthorizer({
      userPool,
      userPoolClients: [userPoolClient],
    });

    this.addOutputs({
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: userPoolClient.userPoolClientId,
    });
  }
}

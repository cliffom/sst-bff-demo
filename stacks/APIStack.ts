import * as cognito from '@aws-cdk/aws-cognito';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';
import * as sst from '@serverless-stack/resources';
import {Duration} from '@aws-cdk/core';
import {createTestHandler, createUsersHandler} from './functions/api';

export default class APIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Let's Go!
    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

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

    // Create DynamoDB Table
    const table = new sst.Table(this, 'Storage', {
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
      },
      primaryIndex: {partitionKey: 'PK', sortKey: 'SK'},
    });

    // Create our route handlers
    const usersHandler = createUsersHandler({scope: this, table});
    const testHandler = createTestHandler({scope: this});

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer({
        userPool,
        userPoolClient,
      }),
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        'GET /test': {
          function: testHandler,
          authorizationType: sst.ApiAuthorizationType.NONE,
        },
        'PUT /user': usersHandler,
        'GET /user/me': usersHandler,
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: userPoolClient.userPoolClientId,
    });
  }
}

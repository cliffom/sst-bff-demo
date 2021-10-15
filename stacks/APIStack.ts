import * as cognito from '@aws-cdk/aws-cognito';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';
import * as sst from '@serverless-stack/resources';

export default class APIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

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
    });

    const table = new sst.Table(this, 'Storage', {
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
      },
      primaryIndex: {partitionKey: 'PK', sortKey: 'SK'},
    });

    const usersHandler = new sst.Function(this, 'usersHandler', {
      handler: 'src/handlers/api/users',
      environment: {
        TABLE_NAME: table.dynamodbTable.tableName,
      },
    });

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer({
        userPool,
        userPoolClient,
      }),
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        'GET /test': {
          function: 'src/handlers/api/test',
          authorizationType: sst.ApiAuthorizationType.NONE,
        },
        'PUT /user': usersHandler,
        'GET /user/{id}': usersHandler,
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: userPoolClient.userPoolClientId,
    });
  }
}

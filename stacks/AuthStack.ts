import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import * as sst from '@serverless-stack/resources';
import {Duration} from 'aws-cdk-lib';

interface AuthStackProps extends sst.StackProps {
  readonly table: sst.Table;
}

export default class AuthStack extends sst.Stack {
  public readonly authorizer: apigAuthorizers.HttpUserPoolAuthorizer;

  constructor(scope: sst.App, id: string, props?: AuthStackProps) {
    super(scope, id, props);

    // Create our async handlers
    const createUserFunction = new sst.Function(this, 'postConfirmationHandler', {
      handler: 'src/handlers/tasks/cognito/post_confirm_user',
      runtime: 'go1.x',
      environment: {
        TABLE_NAME: props?.table.dynamodbTable.tableName as string,
      },
    });
    createUserFunction.attachPermissions([props?.table as sst.Table]);

    // Create User Pool and User Pool Client
    const auth = new sst.Auth(this, 'Auth', {
      cognito: {
        userPool: {
          selfSignUpEnabled: true,
          signInAliases: {email: true},
          signInCaseSensitive: false,
        },
        userPoolClient: {
          authFlows: {userPassword: true},
          idTokenValidity: Duration.days(1),
        },
        triggers: {
          postConfirmation: createUserFunction,
        },
      },
    });

    const userPool = auth.cognitoUserPool as cognito.UserPool;
    const userPoolClient = auth.cognitoUserPoolClient as cognito.UserPoolClient;

    const authorizerProps = {
      userPoolClients: [userPoolClient],
    };
    this.authorizer = new apigAuthorizers.HttpUserPoolAuthorizer(
      'Authorizer',
      userPool,
      authorizerProps
    );

    this.addOutputs({
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: userPoolClient.userPoolClientId,
    });
  }
}

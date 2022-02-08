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

    // Let's Go!
    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

    // Create our async handlers
    const postConfirmationHandler = new sst.Function(this, 'postConfirmationHandler', {
      handler: 'src/handlers/async/cognito/post_confirm_user',
      environment: {
        TABLE_NAME: props?.table.dynamodbTable.tableName as string,
      },
    });

    postConfirmationHandler.attachPermissions([props?.table as sst.Table]);

    // Create User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: {email: true},
      signInCaseSensitive: false,
      lambdaTriggers: {
        postConfirmation: postConfirmationHandler,
      },
    });

    // Create User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: {userPassword: true},
      idTokenValidity: Duration.days(1),
    });

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

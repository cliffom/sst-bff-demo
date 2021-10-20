import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';
import * as sst from '@serverless-stack/resources';
import {createTestHandler, createUsersHandler} from './functions/api';

interface APIStackProps extends sst.StackProps {
  readonly authorizer: apigAuthorizers.HttpUserPoolAuthorizer;
  readonly table: sst.Table;
}

export default class APIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: APIStackProps) {
    super(scope, id, props);

    // Let's Go!
    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

    // Create our route handlers
    const usersHandler = createUsersHandler({scope: this, table: props?.table as sst.Table});
    const testHandler = createTestHandler({scope: this});

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizer: props?.authorizer,
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        'GET /test': {
          function: testHandler,
          authorizationType: sst.ApiAuthorizationType.NONE,
        },
        'POST /users': usersHandler,
        'GET /users/me': usersHandler,
      },
    });

    this.api.attachPermissions([props?.table as sst.Table]);
  }
}

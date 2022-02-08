import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import * as sst from '@serverless-stack/resources';

interface APIStackProps extends sst.StackProps {
  readonly authorizer: apigAuthorizers.HttpUserPoolAuthorizer;
  readonly table: sst.Table;
}

export default class UsersAPIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: APIStackProps) {
    super(scope, id, props);

    // Let's Go!
    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

    // Create our route handlers
    const usersHandler = new sst.Function(this, 'usersHandler', {
      handler: 'src/handlers/api/users',
      environment: {
        TABLE_NAME: props!.table.dynamodbTable.tableName as string,
      },
    });

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizer: props!.authorizer,
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        'GET /users/me': usersHandler,
      },
    });

    this.api.attachPermissions([props!.table as sst.Table]);
  }
}

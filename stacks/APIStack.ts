import * as sst from '@serverless-stack/resources';

export default class APIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.setDefaultFunctionProps({
      runtime: 'go1.x',
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
      routes: {
        'GET /test': 'src/handlers/api/test',
        'ANY /user': usersHandler,
      },
    });

    this.api.attachPermissions([table]);
  }
}

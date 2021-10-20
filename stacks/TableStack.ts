import * as sst from '@serverless-stack/resources';

export default class TableStack extends sst.Stack {
  public readonly table: sst.Table;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create DynamoDB Table
    this.table = new sst.Table(this, 'AppTable', {
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
      },
      primaryIndex: {partitionKey: 'PK', sortKey: 'SK'},
    });
  }
}

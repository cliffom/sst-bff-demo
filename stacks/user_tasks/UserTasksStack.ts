import * as sst from '@serverless-stack/resources';

interface UserTasksStackProps extends sst.StackProps {
  readonly table: sst.Table;
}

export default class UserTasksStack extends sst.Stack {
  public readonly createUserFunction: sst.Function;

  constructor(scope: sst.App, id: string, props?: UserTasksStackProps) {
    super(scope, id, props);

    // Let's Go!
    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

    // Create our async handlers
    this.createUserFunction = new sst.Function(this, 'postConfirmationHandler', {
      handler: 'src/handlers/tasks/cognito/post_confirm_user',
      environment: {
        TABLE_NAME: props?.table.dynamodbTable.tableName as string,
      },
    });

    this.createUserFunction.attachPermissions([props?.table as sst.Table]);
  }
}

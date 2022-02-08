import * as sst from '@serverless-stack/resources';
import AuthStack from '../stacks/AuthStack';
import UsersAsyncStack from '../stacks/users_async/UsersAsyncStack';
import {Template} from 'aws-cdk-lib/assertions';
import TableStack from '../stacks/TableStack';

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const tableStack = new TableStack(app, 'table-stack');
  const usersAsyncStack = new UsersAsyncStack(app, 'users-async-stack', {
    table: tableStack.table,
  });
  const stack = new AuthStack(app, 'test-stack', {
    postConfirmationFunction: usersAsyncStack.createUserFunction,
  });
  const template = Template.fromStack(stack);

  // THEN
  template.resourceCountIs('AWS::Cognito::UserPool', 1);
  template.resourceCountIs('AWS::Cognito::UserPoolClient', 1);
});

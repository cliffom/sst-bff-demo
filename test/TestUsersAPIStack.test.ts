import * as sst from '@serverless-stack/resources';
import UsersAPIStack from '../stacks/users_api/UsersAPIStack';
import AuthStack from '../stacks/AuthStack';
import TableStack from '../stacks/TableStack';
import {Template} from 'aws-cdk-lib/assertions';
import UserTasksStack from '../stacks/user_tasks/UserTasksStack';

test('Test UsersAPIStack', () => {
  const app = new sst.App();

  // WHEN
  const tableStack = new TableStack(app, 'table-stack');
  const userTasksStack = new UserTasksStack(app, 'tasks-stack', {
    table: tableStack.table,
  });
  const authStack = new AuthStack(app, 'auth-stack', {
    postConfirmationFunction: userTasksStack.createUserFunction,
  });
  const stack = new UsersAPIStack(app, 'test-stack', {
    authorizer: authStack.authorizer,
    table: tableStack.table,
  });
  const template = Template.fromStack(stack);

  // THEN
  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::ApiGatewayV2::Route', 2);

  template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
    RouteKey: 'GET /users/me',
    AuthorizationType: 'JWT',
  });

  template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
    RouteKey: 'PATCH /users/me',
    AuthorizationType: 'JWT',
  });
});

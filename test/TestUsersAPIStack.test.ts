import * as sst from '@serverless-stack/resources';
import UsersAPIStack from '../stacks/users_api/UsersAPIStack';
import AuthStack from '../stacks/AuthStack';
import TableStack from '../stacks/TableStack';
import {Template} from 'aws-cdk-lib/assertions';

test('Test UsersAPIStack', () => {
  const app = new sst.App();

  // WHEN
  const tableStack = new TableStack(app, 'table-stack');
  const authStack = new AuthStack(app, 'auth-stack', {
    table: tableStack.table,
  });
  const stack = new UsersAPIStack(app, 'test-stack', {
    authorizer: authStack.authorizer,
    table: tableStack.table,
  });
  const template = Template.fromStack(stack);

  // THEN
  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::ApiGatewayV2::Route', 1);

  template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
    RouteKey: 'GET /users/me',
    AuthorizationType: 'JWT',
  });
});

import {countResources, countResourcesLike, expect, haveResource} from '@aws-cdk/assert';
import * as sst from '@serverless-stack/resources';
import UsersAPIStack from '../stacks/users_api/UsersAPIStack';
import AuthStack from '../stacks/AuthStack'
import TableStack from '../stacks/TableStack'

test('Test UsersAPIStack', () => {
  const app = new sst.App();

  // WHEN
  const authStack = new AuthStack(app, 'auth-stack');
  const tableStack = new TableStack(app, 'table-stack');
  const stack = new UsersAPIStack(app, 'test-stack', {
    authorizer: authStack.authorizer,
    table: tableStack.table
  });

  // THEN
  expect(authStack).to(haveResource('AWS::Cognito::UserPool'));
  expect(tableStack).to(haveResource('AWS::DynamoDB::Table'));

  expect(stack).to(countResources('AWS::Lambda::Function', 1));
  expect(stack).to(countResources('AWS::ApiGatewayV2::Route', 2));
  expect(stack).to(countResourcesLike('AWS::ApiGatewayV2::Route', 1, {
    RouteKey: 'GET /users/me',
    AuthorizationType: 'JWT'
  }));
  expect(stack).to(countResourcesLike('AWS::ApiGatewayV2::Route', 1, {
    RouteKey: 'POST /users',
    AuthorizationType: 'JWT'
  }));
});

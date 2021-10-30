import {countResourcesLike, expect, haveResource} from '@aws-cdk/assert';
import * as sst from '@serverless-stack/resources';
import TestAPIStack from '../stacks/test_api/TestAPIStack';

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new TestAPIStack(app, 'test-stack');
  // THEN
  expect(stack).to(haveResource('AWS::Lambda::Function'));
  expect(stack).to(countResourcesLike('AWS::ApiGatewayV2::Route', 1, {
    RouteKey: 'GET /test'
  }));
});

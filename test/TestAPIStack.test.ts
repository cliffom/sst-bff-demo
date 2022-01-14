import * as sst from '@serverless-stack/resources';
import TestAPIStack from '../stacks/test_api/TestAPIStack';
import { Template } from "aws-cdk-lib/assertions";

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new TestAPIStack(app, 'test-stack');
  const template = Template.fromStack(stack)

  // THEN
  template.resourceCountIs("AWS::Lambda::Function", 1);
  template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
    RouteKey: 'GET /test'
  });
});

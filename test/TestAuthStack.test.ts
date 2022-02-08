import * as sst from '@serverless-stack/resources';
import AuthStack from '../stacks/AuthStack';
import { Template } from 'aws-cdk-lib/assertions';

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new AuthStack(app, 'test-stack');
  const template = Template.fromStack(stack)

  // THEN
  template.resourceCountIs("AWS::Lambda::Function", 1);
  template.resourceCountIs('AWS::Cognito::UserPool', 1);
  template.resourceCountIs('AWS::Cognito::UserPoolClient', 1);
});

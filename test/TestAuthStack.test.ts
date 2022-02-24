import * as sst from '@serverless-stack/resources';
import AuthStack from '../stacks/AuthStack';
import {Template} from 'aws-cdk-lib/assertions';
import TableStack from '../stacks/TableStack';

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const tableStack = new TableStack(app, 'table-stack');
  const stack = new AuthStack(app, 'test-stack', {
    table: tableStack.table,
  });
  const template = Template.fromStack(stack);

  // THEN
  template.resourceCountIs('AWS::Cognito::UserPool', 1);
  template.resourceCountIs('AWS::Cognito::UserPoolClient', 1);
});

import * as sst from '@serverless-stack/resources';
import UsersAsyncStack from '../stacks/users_async/UsersAsyncStack';
import TableStack from '../stacks/TableStack';
import {Template} from 'aws-cdk-lib/assertions';

test('Test UsersAsyncStack', () => {
  const app = new sst.App();

  // WHEN
  const tableStack = new TableStack(app, 'table-stack');
  const stack = new UsersAsyncStack(app, 'test-stack', {
    table: tableStack.table,
  });
  const template = Template.fromStack(stack);

  // THEN
  template.resourceCountIs('AWS::Lambda::Function', 1);
});

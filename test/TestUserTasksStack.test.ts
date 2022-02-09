import * as sst from '@serverless-stack/resources';
import UserTasksStack from '../stacks/user_tasks/UserTasksStack';
import TableStack from '../stacks/TableStack';
import {Template} from 'aws-cdk-lib/assertions';

test('Test UserTasksStack', () => {
  const app = new sst.App();

  // WHEN
  const tableStack = new TableStack(app, 'table-stack');
  const stack = new UserTasksStack(app, 'test-stack', {
    table: tableStack.table,
  });
  const template = Template.fromStack(stack);

  // THEN
  template.resourceCountIs('AWS::Lambda::Function', 1);
});

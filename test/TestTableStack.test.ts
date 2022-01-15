import * as sst from '@serverless-stack/resources';
import TableStack from '../stacks/TableStack';
import { Template } from 'aws-cdk-lib/assertions';

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new TableStack(app, 'test-stack');
  const template = Template.fromStack(stack)

  // THEN
  template.resourceCountIs('AWS::DynamoDB::Table', 1);
  template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
          {
              AttributeName: 'PK',
              KeyType: 'HASH',
          },
          {
            AttributeName: 'SK',
            KeyType: 'RANGE',
          }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'PK',
          AttributeType: 'S'
        },
        {
          AttributeName: 'SK',
          AttributeType: 'S'
        }
      ],
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true
      },
  })
});

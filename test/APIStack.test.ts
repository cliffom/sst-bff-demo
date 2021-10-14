import {expect, haveResource} from '@aws-cdk/assert';
import * as sst from '@serverless-stack/resources';
import APIStack from '../stacks/APIStack';

test('Test Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new APIStack(app, 'test-stack');
  // THEN
  expect(stack).to(haveResource('AWS::Lambda::Function'));
});

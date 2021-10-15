import * as sst from '@serverless-stack/resources';
import {Construct} from '@aws-cdk/core';

export function createTestHandler({scope}: {scope: Construct}): sst.Function {
  const testHandler = new sst.Function(scope, 'testHandler', {
    handler: 'src/handlers/api/test',
  });

  return testHandler;
}

export function createUsersHandler({
  scope,
  table,
}: {
  scope: Construct;
  table: sst.Table;
}): sst.Function {
  const usersHandler = new sst.Function(scope, 'usersHandler', {
    handler: 'src/handlers/api/users',
    environment: {
      TABLE_NAME: table.dynamodbTable.tableName,
    },
  });

  return usersHandler;
}

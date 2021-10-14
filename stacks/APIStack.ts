import * as sst from '@serverless-stack/resources';

export default class APIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

    const testHandler = new sst.Function(this, 'testHandler', {
      handler: 'src/handlers/api/test',
    });

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      routes: {
        'GET /test': testHandler,
        'GET /user': 'src/handlers/api/user',
      },
    });
  }
}

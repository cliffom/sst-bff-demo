import * as sst from '@serverless-stack/resources';

export default class APIStack extends sst.Stack {
  public readonly api: sst.Api;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Let's Go!
    this.setDefaultFunctionProps({
      runtime: 'go1.x',
    });

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      routes: {
        'GET /test': {
          handler: 'src/handlers/api/test',
        },
      },
    });

    // Show the API endpoint in output
    this.addOutputs({
      TestStackURL: this.api.url,
    });
  }
}

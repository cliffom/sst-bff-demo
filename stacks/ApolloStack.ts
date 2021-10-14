import * as sst from '@serverless-stack/resources';

interface ApolloStackProps extends sst.StackProps {
  readonly api: sst.Api;
}

export default class ApolloStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: ApolloStackProps) {
    super(scope, id, props);

    this.setDefaultFunctionProps({
      runtime: 'nodejs12.x',
    });

    // Create the Apollo GraphQL API
    const apollo = new sst.ApolloApi(this, 'ApolloApi', {
      server: new sst.Function(this, 'ApolloLambda', {
        handler: 'src/handlers/apollo/lambda.handler',
        environment: {
          API_URL: props?.api.url as string,
          STAGE: scope.stage,
        },
      }),
    });

    // Show the API endpoint in output
    this.addOutputs({
      ApolloEndpoint: apollo.url,
    });
  }
}

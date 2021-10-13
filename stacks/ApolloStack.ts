import * as sst from "@serverless-stack/resources";

export default class ApolloStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.setDefaultFunctionProps({
      runtime: "nodejs12.x"
    });  

    // Create the Apollo GraphQL API
    const apollo = new sst.ApolloApi(this, "ApolloApi", {
      server: "src/handlers/apollo/lambda.handler",
    });

    // Show the API endpoint in output
    this.addOutputs({
      ApiEndpoint: apollo.url,
    });
  }
}

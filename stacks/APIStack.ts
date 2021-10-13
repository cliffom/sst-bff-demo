import * as sst from "@serverless-stack/resources";

export default class APIStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.setDefaultFunctionProps({
        runtime: "go1.x"
      });

    const testHandler = new sst.Function(this, "testHandler", {
        handler: "src/handlers/api/test",
    })
  
    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
    routes: {
        "GET /test": testHandler,
    }
    });

    // Show the endpoint in the output
    this.addOutputs({
    "ApiEndpoint": api.url,
    });
  }
}



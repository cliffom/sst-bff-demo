import ApolloStack from "./ApolloStack";
import APIStack from "./APIStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  // Create the API stack where all services are defined
  const apiStack = new APIStack(app, "api-stack");

  // Create the Apollo stack where the Apollo Server is defined
  new ApolloStack(app, "apollo-stack", { api: apiStack.api });  
}

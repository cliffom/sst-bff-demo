import ApolloStack from "./ApolloStack";
import APIStack from "./APIStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  new APIStack(app, "api-stack");
  new ApolloStack(app, "apollo-stack");  
}

import { gql, ApolloServer } from "apollo-server-lambda";
import { getConfig } from "./types/config"

const typeDefs = gql`
  type Config {
    apiBaseURL: String
    stage: String
    isLocal: Boolean
  }

  type Query {
    config: Config
  }
`;

const resolvers = {
  Query: {
    config: () => getConfig()
  },
  
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const handler = server.createHandler();
import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type Config {
    apiBaseURL: String
    stage: String
    isLocal: Boolean
  }

  type User {
    id: String
    first_name: String
    last_name: String
  }

  type Query {
    Config: Config
  }

  type Query {
    User: User
  }
`;

export default typeDefs;

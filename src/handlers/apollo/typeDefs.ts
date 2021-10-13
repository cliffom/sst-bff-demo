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
    config: Config
  }

  type Query {
    allUsers: User
  }
`;

export default typeDefs;

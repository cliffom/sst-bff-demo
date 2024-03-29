import {gql} from 'apollo-server-lambda';

const typeDefs = gql`
  type Config {
    usersAPIBaseURL: String
    stage: String
    isLocal: Boolean
  }

  type User {
    id: String
    email: String
    firstName: String
    lastName: String
    created: String
  }

  type Query {
    Config: Config
  }

  type Query {
    User: User
  }

  type Mutation {
    UpdateUser(firstName: String, lastName: String): User
  }
`;

export default typeDefs;

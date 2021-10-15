import {ApolloServer} from 'apollo-server-lambda';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import UsersAPI from './datasources/users';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    usersAPI: new UsersAPI(),
  }),
  context: ({event}) => ({
    headers: event.headers,
  }),
});

// eslint-disable-next-line import/prefer-default-export
export const handler = server.createHandler();

import {Config, getConfig} from './config';
import {UserContext, User} from './datasources/users';

const resolvers = {
  Query: {
    Config: (): Config => getConfig(),
    User: async (_: unknown, __: unknown, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.getUser(),
  },
  Mutation: {
    CreateUser: async (_: unknown, __: unknown, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.createUser(),
  },
};

export default resolvers;

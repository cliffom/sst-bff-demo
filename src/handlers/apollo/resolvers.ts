import {Config, getConfig} from './config';
import {UserContext, User} from './datasources/users';

const resolvers = {
  Query: {
    Config: (): Config => getConfig(),
    User: async (_: unknown, user: User, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.getUser(user.id as string),
  },
  Mutation: {
    NewUser: async (_: unknown, user: User, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.newUser(user),
  },
};

export default resolvers;

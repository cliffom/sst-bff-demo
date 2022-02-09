import {Config, getConfig} from './config';
import {UserContext, User} from './datasources/users';

const resolvers = {
  Query: {
    Config: (): Config => getConfig(),
    User: async (_: unknown, __: unknown, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.getUser(),
  },
  Mutation: {
    UpdateUser: async (_: unknown, args: any, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.updateUser(args.firstName, args.lastName),
  },
};

export default resolvers;

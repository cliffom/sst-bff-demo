import {Config, getConfig} from './config';
import {UserContext, User} from './datasources/users';

interface UpdateUserArgs {
  firstName: string;
  lastName: string;
}

const resolvers = {
  Query: {
    Config: (): Config => getConfig(),
    User: async (_: unknown, __: unknown, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.getUser(),
  },
  Mutation: {
    UpdateUser: async (
      _: unknown,
      args: UpdateUserArgs,
      {dataSources}: UserContext
    ): Promise<User> => {
      const user: User = {
        firstName: args.firstName,
        lastName: args.lastName,
      };
      return dataSources.usersAPI.updateUser(user);
    },
  },
};

export default resolvers;

import { Config, getConfig } from './config';
import { UserContext, User } from './datasources/users';

const resolvers = {
  Query: {
    config: (): Config => getConfig(),
    allUsers: async (
      _: unknown,
      __: unknown,
      { dataSources }: UserContext,
    ): Promise<User> => dataSources.usersAPI.getUser(),
  },
};

export default resolvers;

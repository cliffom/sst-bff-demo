import {Config, getConfig} from './config';
import {UserContext, User} from './datasources/users';

const resolvers = {
  Query: {
    Config: (): Config => getConfig(),
    User: async (_: unknown, __: unknown, {dataSources}: UserContext): Promise<User> =>
      dataSources.usersAPI.getUser(),
  },
  Mutation: {
    NewUser: async (
      _: unknown,
      {email, firstName, lastName}: User,
      {dataSources}: UserContext
    ): Promise<User> => {
      const user = {email, firstName, lastName};
      return dataSources.usersAPI.newUser(user);
    },
  },
};

export default resolvers;

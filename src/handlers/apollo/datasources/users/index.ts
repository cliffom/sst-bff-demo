import {RESTDataSource} from 'apollo-datasource-rest';
import {getConfig} from '../../config';

export interface UserDataSources {
  usersAPI: UsersAPI;
}

export interface UserContext {
  dataSources: UserDataSources;
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default class UsersAPI extends RESTDataSource {
  constructor() {
    super();

    this.baseURL = getConfig().apiBaseURL;
  }

  async getUser(id: string): Promise<User> {
    return this.get(`user/${encodeURIComponent(id)}`);
  }

  async newUser(user: User): Promise<User> {
    return this.put('user', user);
  }
}

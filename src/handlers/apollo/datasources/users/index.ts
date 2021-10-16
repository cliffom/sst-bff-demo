import {RESTDataSource, RequestOptions} from 'apollo-datasource-rest';
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
  created?: string;
}

export default class UsersAPI extends RESTDataSource {
  constructor() {
    super();

    this.baseURL = getConfig().apiBaseURL;
  }

  protected willSendRequest?(request: RequestOptions): void {
    request.headers.set('Authorization', this.context.headers.authorization);
  }

  async getUser(): Promise<User> {
    return this.get(`user/me`);
  }

  async createUser(): Promise<User> {
    return this.post('user', {});
  }
}

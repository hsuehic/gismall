import { Controller } from 'egg';
import { route } from 'egg-controller';
import * as admin from 'firebase-admin';

export default class UserController extends Controller {
  @route({
    url: '/api/users',
    method: 'get',
    validateMetaInfo: [
      {
        name: 'pageSize',
        rule: {
          type: 'number',
          default: 10,
        },
      },
      {
        name: 'pageIndex',
        rule: {
          type: 'number',
          default: 0,
        },
      },
    ],
  })
  public async getUsers(pageIndex: number, pageSize: number) {
    return await this.ctx.service.user.listUsers(pageIndex, pageSize);
  }

  @route({
    url: '/api/users',
    method: 'post',
    validateMetaInfo: [
      {
        name: 'email',
        rule: {
          type: 'string',
        },
      },
      {
        name: 'password',
        rule: {
          type: 'string',
        },
      },
    ],
  })
  public async createUser(
    email: string,
    password: string,
    phoneNumber: string,
    emailVerified?: boolean,
    displayName?: string,
    photoURL?: string
  ) {
    return await this.ctx.service.user.createUser(
      email,
      password,
      phoneNumber,
      emailVerified,
      displayName,
      photoURL
    );
  }

  @route({
    url: '/api/users/:uid',
    method: 'patch',
  })
  public async updateUser(uid: string, data: Partial<admin.auth.UserRecord>) {
    return await this.ctx.service.user.updateUser(uid, data);
  }

  @route({
    url: '/api/users/:uid',
    method: 'delete',
  })
  public async deleteUser(uid: string) {
    return await this.ctx.service.user.deleteUser(uid);
  }

  @route({
    url: '/api/users/sync',
    method: 'get',
  })
  public async syncUsers() {
    return await this.ctx.service.user.syncUsers();
  }
}

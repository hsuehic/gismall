import { Service } from 'egg';

import * as admin from 'firebase-admin';

/**
 * User Operation Service
 */
export default class UserService extends Service {
  public static listUserResultPageTokens = new Map<
    number,
    Map<number, string>
  >();
  /**
   * Create User
   * @param email {string} user email
   * @param password {string} user password
   * @param phoneNumber {string} phone number
   * @param emailVerified {boolean} is email verified
   * @param displayName {string} display name
   * @param photoURL {string} photo url
   */
  public async createUser(
    email: string,
    password: string,
    phoneNumber: string,
    emailVerified?: boolean,
    displayName?: string,
    photoURL?: string
  ) {
    return await admin.auth().createUser({
      uid: email,
      email,
      password,
      phoneNumber,
      emailVerified,
      displayName,
      photoURL,
    });
  }

  /**
   * Update User Information
   * @param uid {string} user id
   * @param data {admin.auth.UserRecord} updated user record
   */
  public async updateUser(uid: string, data: Partial<admin.auth.UserRecord>) {
    return await admin.auth().updateUser(uid, data);
  }

  /**
   * Delete user by uid
   * @param uid {string} user id
   */
  public async deleteUser(uid: string) {
    return await admin.auth().deleteUser(uid);
  }

  /**
   * Get users
   * @param pageIndex {number} 0 based page index
   * @param pageSize {number} page size
   */
  public async listUsers(pageIndex: number, pageSize: number = 10) {
    let pageTokens = UserService.listUserResultPageTokens.get(pageSize);
    if (!pageTokens) {
      pageTokens = new Map<number, string>();
      UserService.listUserResultPageTokens.set(pageSize, pageTokens);
    }
    let pageToken = pageTokens.get(pageIndex);
    let users = [];
    if (pageToken) {
      const listUsersResult = await admin.auth().listUsers(pageSize, pageToken);
      pageTokens.set(pageIndex + 1, listUsersResult.pageToken);
      users = [...listUsersResult.users];
    } else {
      if (pageIndex > 0) {
        let listUsersResult = await admin.auth().listUsers(pageSize);
        let p = 1;
        pageTokens.set(p, listUsersResult.pageToken);
        while (p <= pageIndex) {
          listUsersResult = await admin
            .auth()
            .listUsers(pageSize, listUsersResult.pageToken);
          p++;
          pageTokens.set(p, listUsersResult.pageToken);
          users = [...listUsersResult.users];
        }
      } else {
        const listUsersResult = await admin.auth().listUsers(pageSize);
        users = [...listUsersResult.users];
        pageTokens.set(1, listUsersResult.pageToken);
      }
    }
    return users;
  }

  /**
   * synchronous users
   */
  public async syncUsers() {
    const pageSize = 1000;
    let listUsersResult = await admin.auth().listUsers(pageSize);
    let users = [...listUsersResult.users];
    while (listUsersResult.pageToken) {
      listUsersResult = await admin
        .auth()
        .listUsers(pageSize, listUsersResult.pageToken);
      users = [...users, ...listUsersResult.users];
    }
    const db = admin.firestore();
    users.map(async (user: admin.auth.UserRecord) => {
      await db
        .collection('users')
        .doc(user.uid)
        .set({
          email: user.email,
          displayName: user.displayName,
          providerId: 'firebase',
          uid: user.uid,
        });
    });
    return { status: 'ok' };
  }
}

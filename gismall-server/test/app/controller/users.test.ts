import { app, mock, assert } from 'egg-mock/bootstrap';
import * as admin from 'firebase-admin';

describe('app/controller/user.ts', () => {
  afterEach(mock.restore);

  it('GET /admin/api/users 401', async () => {
    app.mockCsrf();

    await app
      .httpRequest()
      .get('/admin/api/users')
      .expect(401)
      .expect({ error: 401, message: 'No authentication' });
  });

  it('GET /admin/api/users 403', async () => {
    app.mockCookies({
      GISMALL_ADMIN_AUTH: 'test cookie',
    });
    mock(admin.auth(), 'verifySessionCookie', () => {
      return {
        claims: {
          username: 'test1',
          role: 'user',
        },
      };
    });
    app.mockService('user', 'listUsers', () => {
      return [
        {
          uid: 1,
          email: 'test1@gmail.com',
          displayName: 'test1',
          photoURL: '',
        },
      ];
    });
    await app
      .httpRequest()
      .get('/admin/api/users')
      .expect(403)
      .expect({ error: 403, message: 'Permission Denied!' });
  });

  it('GET /admin/api/users 200', async () => {
    app.mockCookies({
      GISMALL_ADMIN_AUTH: 'test cookie',
    });
    mock(admin.auth(), 'verifySessionCookie', () => {
      return {
        username: 'test1',
        role: 'administrator',
      };
    });
    app.mockService('user', 'listUsers', async () => {
      return [
        {
          uid: 1,
          email: 'test1@gmail.com',
          displayName: 'test1',
          photoURL: '',
        },
      ];
    });

    const ctx = app.mockContext();
    const users = await ctx.service.user.listUsers(0, 10);
    assert(users.length === 1);
    await app
      .httpRequest()
      .get('/admin/api/users?pageIndex=0&pageSize=10')
      .expect(200)
      .expect([
        {
          uid: 1,
          email: 'test1@gmail.com',
          displayName: 'test1',
          photoURL: '',
        },
      ]);
  });
});

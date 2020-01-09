import mock, { MockApplication } from 'egg-mock';
import * as admin from 'firebase-admin';
import { assert } from 'egg-mock/bootstrap';
import { describe, before, after } from 'mocha';

describe('app/services/user.ts', () => {
  let app: MockApplication;
  before(async () => {
    app = mock.app();
    await app.ready();
  });

  afterEach(() => {
    mock.restore();
  });

  it('listUsers', async () => {
    mock(admin.auth(), 'listUsers', () => {
      return {
        users: [
          {
            uid: 1,
            email: 'test1@gmail.com',
            photoURL: '',
            displayName: 'test1',
          },
          {
            uid: 2,
            email: 'test2@gmail.com',
            photoURL: '',
            displayName: 'test1',
          },
        ],
        pageToken: undefined,
      };
    });
    const ctx = app.mockContext();
    const users = await ctx.service.user.listUsers(1, 10);
    assert(users.length === 2);
  });
  after(() => {
    app.close();
  });
});

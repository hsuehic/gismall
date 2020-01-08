import { app } from 'egg-mock/bootstrap';

describe('Auth controller', () => {
  it('Get /admin/login', async () => {
    await app
      .httpRequest()
      .get('/admin/login')
      .expect(200);
  });
});

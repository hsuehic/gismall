import { app } from 'egg-mock/bootstrap';

describe('app/controller/auth.ts', () => {
  it('Get /admin/login', async () => {
    await app
      .httpRequest()
      .get('/admin/login')
      .expect(200);
  });
});
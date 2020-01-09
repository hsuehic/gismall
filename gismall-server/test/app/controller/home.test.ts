import { app } from 'egg-mock/bootstrap';

describe('app/controller/home.ts', () => {
  it('GET /', async () => {
    await app
      .httpRequest()
      .get('/')
      .expect(200);
  });
});

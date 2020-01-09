import { app, assert, mock } from 'egg-mock/bootstrap';

describe('app/controller/admin.ts', () => {
  it('Get /admin/users', () => {
    const ctx = app.mockContext();
    mock(ctx.request, 'url', '/admin/users');
    assert(ctx.request.url === '/admin/users');
  });
});

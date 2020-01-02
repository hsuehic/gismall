import { Controller } from 'egg';
import { route, controller } from 'egg-controller';

import createAuthMiddleware from '../middleware/auth';

@controller({
  middleware: [createAuthMiddleware(['administrator'])],
})
export default class HomeController extends Controller {
  @route('/admin/:mid*', {
    middleware: [],
  })
  public async index() {
    const { ctx } = this;
    await ctx.helper.renderAdminPageWithMeta(ctx);
  }
}

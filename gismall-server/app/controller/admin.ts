import { Controller } from 'egg';
import { route, controller } from 'egg-controller';

import createAuthMiddleware from '../middleware/auth';

@controller({
  middleware: [],
})
export default class HomeController extends Controller {
  private async renderPageWithBasicInfo<T extends {}>(state?: T) {
    const { ctx } = this;
    const locale = ctx.cookies.get('locale') || 'en-US';
    await ctx.render('admin.js', {
      title: 'Gismall Admin',
      keywords: 'gismall, react, server side render, ant design',
      description: 'Ant Design Tab Theme and Code Spliting',
      locale,
      location: {
        pathname: ctx.helper.getPathname(ctx.request.path),
      },
      currentUser: ctx.currentUser,
      ...state,
    });
  }

  @route('/admin/login')
  public async login() {
    await this.renderPageWithBasicInfo();
  }

  @route('/admin/:mid*', {
    middleware: [createAuthMiddleware(['administrator'])],
  })
  public async index() {
    await this.renderPageWithBasicInfo();
  }
}

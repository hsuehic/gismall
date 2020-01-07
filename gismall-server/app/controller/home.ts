import { Controller } from 'egg';
import { route } from 'egg-controller';
export default class HomeController extends Controller {
  @route('/')
  public async index() {
    const { ctx } = this;
    await ctx.helper.renderHomePageWithMeta();
  }
}

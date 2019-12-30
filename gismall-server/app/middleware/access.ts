import * as path from 'path';
import { Context } from 'egg';
import { Next } from 'koa';

export default function() {
  const skipExt = ['.png', '.jpeg', '.jpg', '.ico', '.gif'];
  return async (ctx: Context, next: Next) => {
    const start = new Date().getTime();

    const rs = Math.ceil(new Date().getTime() - start);

    ctx.set('X-Response-Time', rs.toString(10));

    const ext = path.extname(ctx.url).toLocaleLowerCase();
    const isSkip = skipExt.indexOf(ext) !== -1 && ctx.status < 400;

    if (!isSkip) {
      if (!ctx.currentUser) {
        ctx.redirect('/admin/login');
      }
    }
    await next();
  };
}

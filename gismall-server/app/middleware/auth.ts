import { Context, Application } from 'egg';
import * as admin from 'firebase-admin';
import { Next } from 'koa';
import { COOKIE_ADMIN_AUTH_NAME } from '../constant';

import { CustomClaims } from '../typings/common';

export default (allowedRoles: string[]) => {
  return (app: Application) => {
    return async (ctx: Context, next: Next) => {
      const session = ctx.cookies.get(COOKIE_ADMIN_AUTH_NAME);
      if (session) {
        try {
          const auth = admin.auth();
          const decodedIdToken: admin.auth.DecodedIdToken = await auth.verifySessionCookie(
            session,
            true
          );
          const claims: CustomClaims = <CustomClaims>(<unknown>decodedIdToken);
          const { role, username } = claims;
          ctx.role = role;
          ctx.username = username;
          if (
            ctx.request.path !== '/amdin/login' &&
            allowedRoles.indexOf(role) === -1
          ) {
            ctx.body = { error: 403, message: 'Permission Denied!' };
            ctx.status = 403;
          } else {
            await next();
          }
        } catch (ex) {
          ctx.cookies.set(COOKIE_ADMIN_AUTH_NAME, '', {
            maxAge: -1,
          });
          if (ctx.request.path !== '/amdin/login') {
            ctx.redirect('/admin/login');
          }
        }
      } else {
        if (ctx.request.path !== '/admin/login') {
          ctx.redirect('/admin/login');
        } else if (ctx.request.path.indexOf('/api/') > -1) {
          ctx.body = { error: 401, message: 'No authentication' };
          ctx.status = 401;
        } else {
          await next();
        }
      }
    };
  };
};

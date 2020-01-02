import { Controller } from 'egg';
import { route } from 'egg-controller';
import * as admin from 'firebase-admin';

import { COOKIE_ADMIN_AUTH_NAME } from '../constant';
import { CustomClaims, ROLE } from '../typings/common';

const loginPath = '/admin/login';

export default class AuthController extends Controller {
  @route({
    url: '/admin/api/v3/verify',
    method: 'post',
    validateMetaInfo: [
      {
        name: 'token',
        rule: {
          type: 'string',
          required: true,
        },
      },
    ],
  })
  async verifyLogin(token: string) {
    const { ctx } = this;
    const auth = admin.auth();
    try {
      const claims = ((await auth.verifyIdToken(
        token
      )) as unknown) as CustomClaims;
      const { role, username } = claims;
      const expiresIn = 1000 * 60 * 24 * 30;
      const session = await auth.createSessionCookie(token, {
        expiresIn: expiresIn,
      });

      ctx.cookies.set(COOKIE_ADMIN_AUTH_NAME, session, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      });

      return {
        ...ctx.helper.defaultResponse,
        data: {
          role,
          username,
        },
      };
    } catch (error) {
      return {
        code: 1,
        error: 1,
        errorMsg: error,
      };
    }
  }

  @route('/admin/login')
  public async login() {
    const { ctx } = this;
    if (ctx.role === ROLE.administrator) {
      ctx.redirect('/admin');
    }
    await ctx.helper.renderAdminPageWithMeta(ctx);
  }

  @route('/admin/logout')
  async logout() {
    const { ctx } = this;
    const sessionCookie = ctx.cookies.get(COOKIE_ADMIN_AUTH_NAME);
    ctx.cookies.set(COOKIE_ADMIN_AUTH_NAME, null);
    if (sessionCookie) {
      admin
        .auth()
        .verifySessionCookie(sessionCookie)
        .then(decodedClaims => {
          return admin.auth().revokeRefreshTokens(decodedClaims.uid);
        })
        .then(() => {
          ctx.redirect(loginPath);
        })
        .catch(() => {
          ctx.redirect(loginPath);
        });
    } else {
      ctx.redirect(loginPath);
    }
  }
}

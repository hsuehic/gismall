import { Controller } from 'egg';
import { route } from 'egg-controller';
import * as admin from 'firebase-admin';

import { COOKIE_ADMIN_AUTH_NAME } from '../constant';
import { CustomClaims } from '../typings/common';

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
  async login(token: string) {
    const { ctx } = this;
    const auth = admin.auth();
    try {
      const claims = ((await auth.verifyIdToken(
        token
      )) as unknown) as CustomClaims;
      const { role, username } = claims;

      const session = await auth.createSessionCookie(token, {
        expiresIn: 1000 * 60 * 24 * 30,
      });

      ctx.cookies.set(COOKIE_ADMIN_AUTH_NAME, session);

      return {
        ...this.ctx.helper.defaultResponse,
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
}

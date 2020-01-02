import { Context, IHelper } from 'egg';

/**
 * get pathname from request url
 * @param requestPath {string} path name with query string
 */
function getPathname(requestPath: string): string {
  return decodeURIComponent(requestPath.split('?')[0]);
}

export function getUrlClaims() {}

/**
 * Render admin page html
 * @param ctx {egg.Context} context of the request
 * @param state {any} states for the renderer
 */
async function renderAdminPageWithMeta<T extends {}>(this: IHelper, state?: T) {
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

/**
 * Render home page html
 * @param ctx {egg.Context} context of the request
 * @param state {any} states for the renderer
 */
async function renderHomePageWithMeta<T extends {}>(this: IHelper, state?: T) {
  const { ctx } = this;
  const locale = ctx.cookies.get('locale') || 'en-US';
  await ctx.render('home.js', {
    title: 'Gismall Home',
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

/**
 * default api response structure
 */
const defaultResponse = {
  code: 0,
  error: 0,
  errorMsg: '',
  data: {},
};

export default {
  defaultResponse,
  getPathname,
  renderAdminPageWithMeta,
  renderHomePageWithMeta,
};

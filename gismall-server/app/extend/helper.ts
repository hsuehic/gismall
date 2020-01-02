import { Context } from 'egg';

function getPathname(requestPath: string): string {
  return decodeURIComponent(requestPath.split('?')[0]);
}

async function renderAdminPageWithMeta<T extends {}>(ctx: Context, state?: T) {
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

async function renderHomePageWithMeta<T extends {}>(ctx: Context, state?: T) {
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

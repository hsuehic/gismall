import { combineReducers } from 'redux';
import { getCookie, createCookie } from '../utils/cookie';
import { SET_LOCALE } from './constant';

import { HomeState, UserInfo, AdminState } from '../../typings/common';
import { Action } from '../../typings/frontend';

const COOKIE_NAME_LOCALE = 'locale';
const DEFAULT_LOCALE: Locale =
  getCookie(COOKIE_NAME_LOCALE) === 'zh-CN' ? 'zh-CN' : 'en-US';

const locale = (
  state: Locale = DEFAULT_LOCALE,
  action: Action<string, Locale>
): Locale => {
  const { type, payload } = action;
  if (type === SET_LOCALE) {
    createCookie(COOKIE_NAME_LOCALE, payload);
    return payload;
  }
  return state;
};

const currentUser = (
  // this is just to satisfy the rules of combineReducers.
  state: UserInfo = {
    userid: 1111,
    username: 'test',
    email: 'test@gmail.com',
    picture: '/',
  }
) => {
  return state;
};

export const homeReducer = combineReducers<HomeState>({
  locale,
  currentUser,
});

export const adminReducer = combineReducers<AdminState>({
  locale,
  currentUser,
});

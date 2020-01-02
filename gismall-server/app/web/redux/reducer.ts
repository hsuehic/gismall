import { combineReducers } from 'redux';
import { getCookie, createCookie } from '../utils/cookie';
import { SET_LOCALE } from './constant';

import { HomeState, AdminState } from '../../typings/common';
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

export const homeReducer = combineReducers<HomeState>({
  locale,
});

export const adminReducer = combineReducers<AdminState>({
  locale,
});

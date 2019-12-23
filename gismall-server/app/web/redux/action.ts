import { SET_LOCALE } from './constant';

export function setLocale(locale: Locale) {
  return {
    type: SET_LOCALE,
    payload: locale,
  };
}

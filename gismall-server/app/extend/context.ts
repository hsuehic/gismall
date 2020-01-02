import { Context } from 'egg';
export default {
  get pathname(this: Context) {
    return '';
  },
  getPathname(this: Context) {
    return this.path.substr(0, this.path.indexOf('?'));
  },
};

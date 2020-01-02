import { Application } from 'egg';

export default {
  get appid(this: Application) {
    return this.name;
  },
  getAppid(this: Application) {
    return this.name;
  },
};

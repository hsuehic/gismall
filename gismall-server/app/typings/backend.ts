import { UserInfo } from 'firebase';

declare module 'egg' {
  interface Context {
    currentUser?: UserInfo;
  }
}

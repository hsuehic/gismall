import { UserInfo } from 'firebase';
import { Role } from './common';

declare module 'egg' {
  interface Context {
    currentUser?: UserInfo;
    role?: Role;
    username?: string;
  }
}

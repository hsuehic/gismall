// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth from '../../../app/service/auth';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    auth: ExportAuth;
    user: ExportUser;
  }
}

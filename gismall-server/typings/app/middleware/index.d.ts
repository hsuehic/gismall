// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccess from '../../../app/middleware/access';
import ExportAuth from '../../../app/middleware/auth';

declare module 'egg' {
  interface IMiddleware {
    access: typeof ExportAccess;
    auth: typeof ExportAuth;
  }
}

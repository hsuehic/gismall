import { Application } from 'egg';
import * as path from 'path';
import * as admin from 'firebase-admin';

export default class AppBootHook {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  async willReady() {
    const serviceAccount = require(path.join(
      this.app.baseDir,
      'cert/gismall-firebase-adminsdk-cr05s-d4c02af13a.json'
    ));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://gismall.firebaseio.com',
    });
  }
}

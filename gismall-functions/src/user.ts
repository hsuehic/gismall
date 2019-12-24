import express, { Request, Response } from 'express';
import cors from 'cors';

import bodyParser from 'body-parser';

import * as admin from 'firebase-admin';

const responseDefaults = {
  code: 0,
  error: 0,
  err_msg: 0,
};

const listUserResultPageTokens = new Map<number, Map<number, string>>();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser());

/**
 * Get User count
 */
app.get('/count', async (_: Request, res: Response) => {
  const docSnapshot = await admin
    .firestore()
    .collection('counter')
    .doc('user')
    .get();
  const count = docSnapshot.get('count');
  res.json({
    ...responseDefaults,
    data: count,
  });
});

/**
 * Get user detail
 */
app.get('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  const userInfo = await admin.auth().getUser(uid);
  res.json({
    ...responseDefaults,
    data: userInfo.toJSON(),
  });
});

/**
 * Delete user
 */
app.delete('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  await admin.auth().deleteUser(uid);
  res.json(responseDefaults);
});

/**
 * Update user information, supported properties: displayName, photoURL
 */
app.patch('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { displayName, photoURL } = req.body;
  await admin.auth().updateUser(uid, {
    displayName,
    photoURL,
  });
});

/**
 * Create user, need to post properties: email, password, displayName
 */
app.post('/', async (req: Request, res: Response) => {
  const { email, password, displayName = '' } = req.body;
  const userInfo = await admin.auth().createUser({
    email,
    password,
    displayName,
  });
  res.json({
    ...responseDefaults,
    data: userInfo.toJSON(),
  });
});

/**
 * Get User list, need query parameters, pageIndex: 0 started index of page number, pageSize: Page size
 */
app.get('/', async (req: Request, res: Response) => {
  const {
    pageIndex: pageIndexStr = '0',
    pageSize: pageSizeStr = '10',
  } = req.query;
  const pageSize = parseInt(pageSizeStr);
  const pageIndex = parseInt(pageIndexStr);
  let pageTokens = listUserResultPageTokens.get(pageSize);
  if (!pageTokens) {
    pageTokens = new Map<number, string>();
    listUserResultPageTokens.set(pageSize, pageTokens);
  }
  let pageToken = pageTokens.get(pageIndex);
  let users: admin.auth.UserRecord[] = [];
  if (pageToken) {
    const listUsersResult = await admin.auth().listUsers(pageSize, pageToken);
    pageTokens.set(pageIndex + 1, listUsersResult.pageToken || '');
    users = [...listUsersResult.users];
  } else {
    if (pageIndex > 0) {
      let listUsersResult = await admin.auth().listUsers(pageSize);
      let p = 1;
      pageTokens.set(p, listUsersResult.pageToken || '');
      while (p <= pageIndex) {
        listUsersResult = await admin
          .auth()
          .listUsers(pageSize, listUsersResult.pageToken);
        p++;
        pageTokens.set(p, listUsersResult.pageToken || '');
        users = [...listUsersResult.users];
      }
    } else {
      const listUsersResult = await admin.auth().listUsers(pageSize);
      users = [...listUsersResult.users];
      pageTokens.set(1, listUsersResult.pageToken || '');
    }
  }
  const docSnap = await admin
    .firestore()
    .collection('counter')
    .doc('user')
    .get();
  const count = docSnap.get('count');
  res.json({
    ...responseDefaults,
    data: {
      count,
      pageIndex,
      pageSize,
      items: users,
    },
  });
});

export default app;

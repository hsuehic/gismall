import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

export const generateUser = functions.auth
  .user()
  .onCreate(
    async (user: admin.auth.UserRecord, context: functions.EventContext) => {
      await admin
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          email: user.email,
          displayName: user.displayName,
          providerId: user.providerData[0].providerId,
          uid: user.uid,
        });
      return await admin
        .firestore()
        .collection('counter')
        .doc('user')
        .update({
          count: admin.firestore.FieldValue.increment(1),
        });
    },
  );

export const deleteUser = functions.auth
  .user()
  .onDelete(async (user: admin.auth.UserRecord) => {
    await admin
      .firestore()
      .collection('users')
      .doc(user.uid)
      .delete();

    return await admin
      .firestore()
      .collection('counter')
      .doc('user')
      .update({
        count: admin.firestore.FieldValue.increment(-1),
      });
  });

export const getUsers = functions.https.onRequest(
  async (_req: functions.https.Request, res: functions.Response) => {
    const doc = await admin
      .firestore()
      .collection('counter')
      .doc('user')
      .get();
    const count = doc.get('count');
    res.json({
      code: 0,
      error: 0,
      error_msg: '',
      data: count,
    });
  },
);

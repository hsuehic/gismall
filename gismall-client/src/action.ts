import { Action, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import uuid from 'uuid/v4';
import {
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  ON_RECEIVE_MESSAGE,
  ON_SEND_MESSAGE,
  SIGN_OUT_FAILED,
  SIGN_OUT_REQUESTED,
  SIGN_OUT_SUCCESS,
  FETCH_USER_LIST_REQUESTED,
  FETCH_USER_LIST_FAILED,
  FETCH_USER_LIST_SUCCESS,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAILED,
  ADD_CONTACT_REQUESTED,
  FETCH_CONTACT_LIST_FAILED,
  FETCH_CONTACT_LIST_REQUESTED,
  FETCH_CONTACT_LIST_SUCCESS,
  FETCH_MESSAGES_REQUESTED,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILED,
  REGISTER_REQUESTES,
  REGISTER_FAILED,
  REGISTER_SUCCESS,
} from './constant';
import { signInAccount, signInWithToken, signOut } from './utils/auth';
import firebase, { RNFirebase } from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
import { AppState } from './redux';
import { QuerySnapshot } from 'react-native-firebase/firestore';
import { IMessage } from 'react-native-gifted-chat/lib/types';
import { findBestAvailableLanguage } from 'react-native-localize';

export const documentSnapshotsToMessages = (
  docs: RNFirebase.firestore.DocumentSnapshot[],
) => {
  return docs.map((doc: RNFirebase.firestore.DocumentSnapshot) => {
    return doc.data() as Redux.Message;
  });
};

export const SYSTEM_ACCOUNT = {
  uid: 'lXyeVP36LRaGsgg2zmdEbAqH4ns1',
  email: 'admin@gistop.com',
  displayName: 'System',
};

export const SYSTEM_USER = {
  _id: 'lXyeVP36LRaGsgg2zmdEbAqH4ns1',
  avatar: '',
  name: 'System',
};

export const prepareMessagesState = (
  uid: string,
  messages: Redux.Message[],
): Redux.Messages => {
  const state: Redux.Messages = messages.reduce(
    (prev: Redux.Messages, msg: Redux.Message) => {
      const to = msg.to === uid ? msg.user._id : msg.to;
      const msgs = (prev[to] = prev[to] || []);
      msgs.push(msg);
      return prev;
    },
    {},
  );
  return state;
};

let unsubscribe: (() => void) | null;
export const subscribeMessage = (dispatch: Dispatch, uid: string) => {
  const coll = firebase.firestore().collection(`messages/${uid}/message`);
  unsubscribe = coll.onSnapshot(
    (snapshot: RNFirebase.firestore.QuerySnapshot) => {
      const messages = snapshot.docChanges.reduce(
        (
          prev: Redux.Message[],
          documentChange: RNFirebase.firestore.DocumentChange,
        ) => {
          const messageFromServer = documentChange.doc.data() as Redux.MessageFromServer;
          if (
            documentChange.type === 'added' &&
            messageFromServer.to === uid &&
            messageFromServer.isNew === true
          ) {
            const { createdAt, ...rest } = messageFromServer;
            prev.push({
              ...rest,
              createdAt: createdAt.seconds * 1000,
            });
          }
          return prev;
        },
        [],
      );
      dispatch({
        type: ON_RECEIVE_MESSAGE,
        payload: prepareMessagesState(uid, messages),
      });
    },
  );
};

export const fetchMessages = (uid: string) => {
  return (dispatch: Dispatch) => {
    const coll = firebase.firestore().collection(`messages/${uid}/message`);
    dispatch({
      type: FETCH_MESSAGES_REQUESTED,
    });
    return coll
      .where('isNew', '==', true)
      .get()
      .then(
        (value: QuerySnapshot) => {
          const messages = documentSnapshotsToMessages(value.docs);
          dispatch({
            type: FETCH_MESSAGES_SUCCESS,
            payload: prepareMessagesState(uid, messages),
          });
        },
        reason => {
          dispatch({
            type: FETCH_MESSAGES_FAILED,
            payload: {
              uid,
              reason,
            },
          });
          console.error(reason);
        },
      );
  };
};

const loginSuccessfully = (
  dispatch: ThunkDispatch<Redux.AppState, any, Action>,
) => async (value: RNFirebase.UserCredential) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: value,
  });
  const { uid } = value.user;
  await dispatch(fetchMessages(uid));
  subscribeMessage(dispatch, uid);
  return value;
};

const loginFailed = (dispatch: Dispatch) => (resp: any) => {
  dispatch({
    type: LOGIN_FAILED,
    payload: { ...resp },
  });
};

firebase.auth().onAuthStateChanged((user: RNFirebase.User | null) => {
  if (user) {
    user.getIdToken(true).then((token: string) => {
      saveUserToken(token);
    });
  }
});

export function login(email: string, password: string) {
  return (dispatch: Dispatch) => {
    dispatch({ type: LOGIN_REQUESTED, payload: { email, password } });
    return signInAccount(
      email,
      password,
      loginSuccessfully(dispatch),
      loginFailed(dispatch),
    );
  };
}

export function loginWithToken() {
  return (dispath: Dispatch) => {
    return signInWithToken(loginSuccessfully(dispath), loginFailed(dispath));
  };
}

export const iMessagesToMessages = (
  iMessages: Redux.IMessages,
): Redux.Messages => {
  const messages: Redux.Messages = {};
  for (const to in iMessages) {
    messages[to] = iMessages[to].map((msg: IMessage) => {
      return {
        to: to,
        isNew: false,
        ...msg,
      };
    });
  }
  return messages;
};

export function sendMessage(iMessages: Redux.IMessages) {
  return async (dispath: Dispatch) => {
    for (const to in iMessages) {
      const msgs = iMessages[to];
      const from = msgs[0].user._id;
      const collTo = firebase.firestore().collection(`messages/${to}/message`);
      const collFrom = firebase
        .firestore()
        .collection(`messages/${from}/message`);
      const batch = firebase.firestore().batch();
      const len = msgs.length;
      for (let i = 0; i < len; i++) {
        const docRefTo = collTo.doc();
        const docRefFrom = collFrom.doc();
        batch.set(docRefTo, { to, ...msgs[i], isNew: true });
        batch.set(docRefFrom, { to, ...msgs[i], isNew: false });
      }
      await batch.commit();
    }
    dispath({
      type: ON_SEND_MESSAGE,
      payload: iMessagesToMessages(iMessages),
    });
  };
}

export const getToken = (token: string) => ({
  type: 'GET_TOKEN',
  token,
});

export const saveToken = (token: string) => ({
  type: 'SAVE_TOKEN',
  token,
});

export const removeToken = () => ({
  type: 'REMOVE_TOKEN',
});

export const loading = (bool: boolean) => ({
  type: 'LOADING',
  isLoading: bool,
});

export const error = (error: any) => ({
  type: 'ERROR',
  error,
});

export function getUserToken() {
  return (dispatch: Dispatch) =>
    AsyncStorage.getItem('userToken')
      .then(data => {
        dispatch(loading(false));
        dispatch(getToken(data || ''));
      })
      .catch(err => {
        dispatch(loading(false));
        dispatch(error(err.message || 'ERROR'));
      });
}

export function saveUserToken(token: string) {
  return AsyncStorage.setItem('userToken', token)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
}

export function removeUserToken() {
  return (dispatch: Dispatch) =>
    AsyncStorage.removeItem('userToken')
      .then(data => {
        dispatch(loading(false));
        dispatch(removeToken());
      })
      .catch(err => {
        dispatch(loading(false));
        dispatch(error(err.message || 'ERROR'));
      });
}

export function logout() {
  return (dispatch: Dispatch) => {
    dispatch({
      type: SIGN_OUT_REQUESTED,
      payload: {},
    });
    return signOut().then(
      () => {
        dispatch({
          type: SIGN_OUT_SUCCESS,
          payload: {},
        });
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        removeUserToken();
      },
      (error: Error) => {
        dispatch({
          type: SIGN_OUT_FAILED,
          payload: error,
        });
      },
    );
  };
}

export function fetchUserList() {
  return (dispatch: Dispatch, getState: () => Redux.AppState) => {
    const state = getState();
    const { userList } = state;
    if (userList.hasMore) {
      const { pageSize, currentPage } = userList;
      const newCurrentPage = currentPage + 1;
      dispatch({
        type: FETCH_USER_LIST_REQUESTED,
        payload: {
          pageSize,
          currentPage: newCurrentPage,
        },
      });
      return firebase
        .firestore()
        .collection('user')
        .orderBy('displayName', 'asc')
        .orderBy('email', 'asc')
        .orderBy('uid', 'asc')
        .startAt(currentPage * pageSize)
        .limit(pageSize)
        .get({
          source: 'server',
        })
        .then(
          (resp: RNFirebase.firestore.QuerySnapshot) => {
            const hasMore = resp.size === pageSize;
            const newUserList: Redux.UserList = {
              pageSize: pageSize,
              currentPage: newCurrentPage,
              hasMore: hasMore,
              items: resp.docs.map(doc => {
                return {
                  uid: '',
                  email: '',
                  providerId: '',
                  ...doc.data(),
                };
              }),
            };
            dispatch({
              type: FETCH_USER_LIST_SUCCESS,
              payload: newUserList,
            });
            return newUserList;
          },
          (error: Error) => {
            dispatch({
              type: FETCH_USER_LIST_FAILED,
              payload: error,
            });
            throw error;
          },
        );
    } else {
      throw new Error('No more users.');
    }
  };
}

export function fetchContactList({ currentPage }: { currentPage: number }) {
  return (dispatch: Dispatch, getState: () => Redux.AppState) => {
    const state = getState();
    const { contactList, userCredential } = state;
    const { uid } = userCredential.userInfo;
    if (contactList.hasMore || currentPage == 1) {
      const { pageSize } = contactList;
      dispatch({
        type: FETCH_CONTACT_LIST_REQUESTED,
        payload: {
          pageSize,
          currentPage,
        },
      });
      return firebase
        .firestore()
        .collection(`contacts/${uid}/contact`)
        .orderBy('email', 'asc')
        .startAt((currentPage - 1) * pageSize)
        .limit(pageSize)
        .get({
          source: 'server',
        })
        .then(
          (resp: RNFirebase.firestore.QuerySnapshot) => {
            const hasMore = resp.size === pageSize;
            const newContactList: Redux.ContactList = {
              pageSize: pageSize,
              currentPage,
              hasMore: hasMore,
              items: resp.docs.map(doc => {
                return {
                  uid: '',
                  email: '',
                  providerId: '',
                  ...doc.data(),
                };
              }),
            };
            dispatch({
              type: FETCH_CONTACT_LIST_SUCCESS,
              payload: newContactList,
            });
            return newContactList;
          },
          (error: Error) => {
            dispatch({
              type: FETCH_CONTACT_LIST_FAILED,
              payload: error,
            });
            throw error;
          },
        );
    }
  };
}

export function addContact(contact: RNFirebase.UserInfo) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const state = getState();
    const { userCredential } = state;
    const { uid } = userCredential.userInfo;
    dispatch({
      type: ADD_CONTACT_REQUESTED,
      payload: contact,
    });
    return firebase
      .firestore()
      .collection(`contacts/${uid}/contact`)
      .doc(contact.uid)
      .set(contact)
      .then(
        () => {
          dispatch({
            type: ADD_CONTACT_SUCCESS,
            payload: contact,
          });
        },
        (err: Error) => {
          dispatch({
            type: ADD_CONTACT_FAILED,
            payload: err,
          });
          throw err;
        },
      );
  };
}

export function updateProfile(updates: RNFirebase.UpdateProfile) {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    return currentUser.updateProfile(updates);
  }
}

export function updateEmail(email: string) {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    return currentUser.updateEmail(email);
  }
}

export function updateMessagesStatus(to: string) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const state = getState();
    const { uid } = state.userCredential.userInfo;
    return firebase
      .firestore()
      .collection(`messages/${uid}/message`)
      .where('to', '==', to)
      .get()
      .then((snapshot: RNFirebase.firestore.QuerySnapshot) => {
        if (snapshot.size > 0) {
          const writeBatch = firebase.firestore().batch();
          for (const doc of snapshot.docs) {
            doc.ref.set({
              isNew: false,
            });
          }
          writeBatch.commit();
        }
      });
  };
}

const initMessage = (uid: string) => {
  const p: Promise<number> = new Promise(resolve => {
    firebase
      .firestore()
      .collection('messages')
      .doc(uid)
      .get()
      .then(snapShot => {
        if (!snapShot.exists) {
          firebase
            .firestore()
            .collection('messages')
            .doc(uid)
            .collection('message')
            .doc(SYSTEM_USER._id)
            .set({
              _id: uuid(),
              text: '欢迎加入GIS Mall',
              isNew: false,
              to: uid,
              user: SYSTEM_USER,
              createdAt: new Date(),
            })
            .then(() => {
              resolve(1);
            });
        } else {
          resolve(1);
        }
      });
  });
  return p;
};

const initContact = (uid: string) => {
  const p: Promise<number> = new Promise(resolve => {
    firebase
      .firestore()
      .collection('contacts')
      .doc(uid)
      .collection('contact')
      .doc(SYSTEM_ACCOUNT.uid)
      .set(SYSTEM_ACCOUNT)
      .then(
        () => {
          resolve(1);
        },
        () => {
          resolve(0);
        },
      )
      .catch(() => {
        resolve(0);
      });
  });
  return p;
};

const initUser = (user: RNFirebase.UserInfo) => {
  const { uid } = user;
  const collection = firebase.firestore().collection('users');
  collection
    .doc(uid)
    .set(user)
    .then(() => {
      console.log('Success added');
    });
};

export function register(email: string, password: string, displayName: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: REGISTER_REQUESTES,
    });
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(
        (userCredential: RNFirebase.UserCredential) => {
          dispatch({
            type: REGISTER_SUCCESS,
            payload: userCredential,
          });

          const { user } = userCredential;
          const { uid } = user;
          const { currentUser } = firebase.auth();
          if (currentUser) {
            currentUser!.updateProfile({
              displayName,
            });
          }

          // create first contact
          initMessage(uid);
          // create first message
          initContact(uid);
          // init user
          initUser({
            displayName,
            email: user.email || '',
            providerId: user.providerId,
            uid: user.uid,
          });

          return userCredential;
        },
        reason => {
          console.error(reason);
          dispatch({
            type: REGISTER_FAILED,
            payload: reason,
          });
        },
      )
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: REGISTER_FAILED,
          payload: ex,
        });
      });
  };
}

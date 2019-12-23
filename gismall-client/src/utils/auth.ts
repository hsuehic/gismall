import { AsyncStorage } from 'react-native';
import firebase, { RNFirebase } from 'react-native-firebase';
import { Toast } from '@ant-design/react-native';

/**
 *
 * @param email {string} Email
 * @param password {string} Password
 * @param successCallback {function} success callback
 * @param onFailed
 */
export function signInAccount(
  email: string,
  password: string,
  successCallback?: (value: RNFirebase.UserCredential) => void,
  onFailed?: (reason: any) => void,
) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(
      (value: RNFirebase.UserCredential) => {
        if (successCallback) {
          successCallback(value);
        }
        return value;
      },
      (reason: any) => {
        if (onFailed) {
          onFailed(reason);
        }
        throw reason;
      },
    );
}

export function signInGoogle() {}

export function signInFacebook() {}

export function signInWithToken(
  successCallback?: (value: RNFirebase.UserCredential) => void,
  onFailed?: (reason: any) => void,
) {
  const auth = firebase.auth();
  const { currentUser } = auth;
  if (currentUser) {
    const userCredential = {
      user: currentUser,
      additionalUserInfo: {
        isNewUser: false,
        providerId: '',
      },
    };
    successCallback && successCallback(userCredential);
    return userCredential;
  }
  AsyncStorage.getItem('userToken').then(token => {
    if (token) {
      auth.signInWithCustomToken(token).then(successCallback, onFailed);
    } else {
      onFailed && onFailed('User token not found');
    }
    return token;
  });
}

export function signOut() {
  return firebase.auth().signOut();
}

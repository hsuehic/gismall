import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

export function initFirebase() {
  // this should be only executed at browser side
  var firebaseConfig = {
    apiKey: 'AIzaSyAOkK8BIniwj4zipGhQ-xhmMKfdiLLkrQM',
    authDomain: 'gismall.firebaseapp.com',
    databaseURL: 'https://gismall.firebaseio.com',
    projectId: 'gismall',
    storageBucket: 'gismall.appspot.com',
    messagingSenderId: '589198067629',
    appId: '1:589198067629:web:87e14d6e98f0ac26',
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

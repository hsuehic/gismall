import { RNFirebase } from 'react-native-firebase';
import {
  IMessage,
  User,
  QuickReplies,
} from 'react-native-gifted-chat/lib/types';

import { SET_STATUS_BAR_COLOR } from './constant';

// Type definitions for FirebaseChat 0.1.0
// Project: FirebaseChat
// Definitions by: Richard <https://www.gistop.com/>

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace Redux;

interface AppState {
  isLoggedIn: boolean;
  userList: UserList;
  contactList: ContactList;
  messages: Messages;
  userCredential: UserInformation;
  contacts: Contacts;

  statusBarColor: string;
  statusBarStyle: StatusBarStyle;
}

interface ItemList<P = any> {
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  items: Array<P>;
}

type ContactList = Redux.ItemList<RNFirebase.UserInfo>;

type Contacts = {
  [key: string]: RNFirebase.UserInfo;
};

type UserList = Redux.ItemList<RNFirebase.UserInfo>;
type Users = {
  [key: string]: RNFirebase.UserInfo;
};

interface Message extends IMessage {
  isNew: boolean;
  to: string;
}

interface MessageFromServer {
  isNew: boolean;
  to: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  _id: any;
  text: string;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

type Messages = {
  [key: string]: Array<Message>;
};

type IMessages = {
  [key: string]: Array<IMessage>;
};

type UserInformation = {
  userInfo: RNFirebase.UserInfo;
  additionalUserInfo: RNFirebase.AdditionalUserInfo | undefined;
};

/*~ If this module has methods, declare them as functions like so.
 */
// export function myMethod(a: string): string;
// export function myOtherMethod(a: number): number;

/*~ You can declare types that are available via importing the module */
// export interface someType {
//   name: string;
//   length: number;
//   extras?: string[];
// }

/*~ You can declare properties of the module using const, let, or var */
// export const myField: number;

/*~ If there are types, properties, or methods inside dotted names
 *~ of the module, declare them inside a 'namespace'.
 */
// export namespace State {
//   /*~ For example, given this definition, someone could write:
//    *~   import { subProp } from 'yourModule';
//    *~   subProp.foo();
//    *~ or
//    *~   import * as yourMod from 'yourModule';
//    *~   import { userList } from './reducer';
// yourMod.subProp.foo();
//    */
//   // export function foo(): void;

// }

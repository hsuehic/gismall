import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  ON_SEND_MESSAGE,
  ON_RECEIVE_MESSAGE,
  SIGN_OUT_SUCCESS,
  FETCH_USER_LIST_SUCCESS,
  FETCH_CONTACT_LIST_SUCCESS,
  FETCH_MESSAGE_LIST_SUCCESS,
  SET_STATUS_BAR_COLOR,
  SET_STATUS_BAR_STYLE,
} from './constant';
import { RNFirebase } from 'react-native-firebase';

export function isLoggedIn(state: boolean = false, action: Action): boolean {
  const { type } = action;
  if (type === LOGIN_SUCCESS) {
    return true;
  } else if (type === SIGN_OUT_SUCCESS) {
    return false;
  }
  return state;
}

export function statusBarColor(
  state: string = '#f5f5f9',
  action: Action<string, typeof SET_STATUS_BAR_COLOR>,
): string {
  if (action.type === SET_STATUS_BAR_COLOR) {
    return action.payload;
  }
  return state;
}

export function statusBarStyle(
  state: StatusBarStyle = 'dark-content',
  action: Action<StatusBarStyle, typeof SET_STATUS_BAR_STYLE>,
) {
  if (action.type === SET_STATUS_BAR_STYLE) {
    return action.payload;
  }
  return state;
}

export function userCredential(
  state: Redux.UserInformation | null = null,
  action: Action<RNFirebase.UserCredential>,
): Redux.UserInformation | null {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      const { user, additionalUserInfo } = payload;
      const {
        displayName,
        email,
        phoneNumber,
        photoURL,
        uid,
        providerId,
      } = user;
      const userInfo: RNFirebase.UserInfo = { uid, providerId };
      if (displayName) {
        userInfo.displayName = displayName;
      }
      if (email) {
        userInfo.email = email;
      }
      if (phoneNumber) {
        userInfo.phoneNumber = phoneNumber;
      }
      if (photoURL) {
        userInfo.photoURL = photoURL;
      }
      return {
        additionalUserInfo,
        userInfo,
      };
    case LOGIN_FAILED:
      return null;
    default:
      return state;
  }
}

export function messages(
  state: Redux.Messages = {},
  action: Action<Redux.Messages>,
) {
  const { type, payload } = action;
  switch (type) {
    case ON_SEND_MESSAGE:
    case ON_RECEIVE_MESSAGE:
    case FETCH_MESSAGE_LIST_SUCCESS:
      const keys = Object.keys(payload);
      const newState: Redux.Messages = {};
      keys.map((key: string) => {
        const originMessages = state[key] || [];
        newState[key] = [...payload[key], ...originMessages];
      });
      return { ...state, ...newState };
    case SIGN_OUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

export function token(state: String = '', action: Action<string>) {
  const { type, payload } = action;
  switch (type) {
    case 'GET_TOKEN':
    case 'SAVE_TOKEN':
      return payload;
    case 'REMOVE_TOKEN':
      return '';
    default:
      return state;
  }
}

// user list for listview
export function userList(
  state: Redux.UserList = {
    currentPage: 0,
    pageSize: 20,
    hasMore: true,
    items: [],
  },
  action: Action<Redux.UserList>,
): Redux.UserList {
  const { type, payload } = action;
  if (type === FETCH_USER_LIST_SUCCESS) {
    return {
      ...payload,
      items: [...state.items, ...payload.items].sort((a, b) =>
        a.displayName || a.uid > (b.displayName || b.uid) ? 1 : -1,
      ),
    };
  }
  return state;
}

// users for getting userinfo easily and repidly
export function users(state: Redux.Users = {}, action: Action<Redux.UserList>) {
  const { type, payload } = action;
  if (type === FETCH_USER_LIST_SUCCESS) {
    if (payload.items && payload.items.length > 0) {
      const newState = payload.items.reduce(
        (prevValue: Redux.Users, c: RNFirebase.UserInfo) => {
          return {
            [c.uid]: c,
            ...prevValue,
          };
        },
        {},
      );
      return {
        ...state,
        ...newState,
      };
    }
  }
  return state;
}

// contact lis for listview
export function contactList(
  state: Redux.ContactList = {
    currentPage: 0,
    pageSize: 20,
    hasMore: true,
    items: [],
  },
  action: Action<Redux.ContactList>,
): Redux.ContactList {
  const { type, payload } = action;
  if (type === FETCH_CONTACT_LIST_SUCCESS) {
    return {
      ...payload,
      items: [...state.items, ...payload.items],
    };
  } else if (type === SIGN_OUT_SUCCESS) {
    return {
      currentPage: 0,
      pageSize: 20,
      hasMore: true,
      items: [],
    };
  }
  return state;
}

// contacts for getting contactinfo easily and repidly
export function contacts(
  state: Redux.Contacts = {},
  action: Action<Redux.ContactList>,
) {
  const { type, payload } = action;
  if (type === FETCH_CONTACT_LIST_SUCCESS) {
    if (payload.items && payload.items.length > 0) {
      const newState = payload.items.reduce(
        (prevValue: Redux.Contacts, c: RNFirebase.UserInfo) => {
          return {
            [c.uid]: c,
            ...prevValue,
          };
        },
        {},
      );
      return {
        ...state,
        ...newState,
      };
    }
  } else if (type === SIGN_OUT_SUCCESS) {
    return {};
  }
  return state;
}

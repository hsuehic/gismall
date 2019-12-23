export interface UserInfo {
  userid: number;
  username: string;
  email: string;
  picture: string;
}

export interface HomeState {
  locale: Locale;
  currentUser: UserInfo;
}

export interface AdminState {
  locale: Locale;
  currentUser?: UserInfo;
}

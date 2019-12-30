import { UserInfo } from 'firebase';

export interface HomeState {
  locale: Locale;
  currentUser: UserInfo;
}

export interface AdminState {
  locale: Locale;
  currentUser?: UserInfo;
}

export type HttpResponse<T> = SuccessHttpResponse<T> | FailedHttpResponse;

export interface SuccessHttpResponse<T> {
  code: 0;
  data: T;
  error: 0;
  errorMsg: '' | undefined | null;
}

export interface FailedHttpResponse {
  data: undefined | null;
  error: number;
  errorMsg: string;
  code: number;
}

export const ROLE = {
  administrator: 'administrator',
  customer: 'customer',
  anonymous: 'anonymouse',
};

export type Role = keyof typeof ROLE;
export interface CustomClaims {
  role?: Role;
  username?: string;
}

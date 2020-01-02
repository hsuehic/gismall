export interface HomeState {
  locale: Locale;
}

export interface AdminState {
  locale: Locale;
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

// default roles
export const ROLE = {
  administrator: 'administrator',
  customer: 'customer',
  system: 'system',
};

export type Role = keyof typeof ROLE;
export interface CustomClaims {
  role?: Role;
  username?: string;
}

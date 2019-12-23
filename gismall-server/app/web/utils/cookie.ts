const { document } = global || window;
export function getCookies() {
  const cookies: { [key: string]: string } = {};
  if (!document || !document.cookie) {
    return cookies;
  }
  document.cookie.split(';').forEach((cookie: string) => {
    const linkerIndex = cookie.indexOf('=');
    const key = cookie.substring(0, linkerIndex);
    const val = cookie.substring(linkerIndex + 1);
    cookies[key.trim()] = decodeURIComponent(val);
  });
  return cookies;
}

export function getCookie(name: string): string | void {
  if (!document || !document.cookie) {
    return;
  }
  const regex = new RegExp(`(?:^|;\\s?)${name}=([^;$]+)`);
  const match = (document.cookie || '').match(regex);
  if (match) {
    return match[1];
  } else {
    return;
  }
}

export function createCookie(name: string, value: string, days?: number): void {
  if (!document || typeof document.cookie === 'undefined') {
    return;
  }
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/;`;
}

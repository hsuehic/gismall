function getPathname(requestPath: string): string {
  return decodeURIComponent(requestPath.split('?')[0]);
}

const defaultResponse = {
  code: 0,
  error: 0,
  errorMsg: '',
  data: {},
};

export default {
  getPathname,
  defaultResponse,
};

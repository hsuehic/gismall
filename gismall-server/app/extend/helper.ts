export function getPathname(requestPath: string): string {
  return decodeURIComponent(requestPath.split('?')[0]);
}

export default { getPathname };

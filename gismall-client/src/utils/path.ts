export function getFileName(uri: string): string {
  let startIndex = uri.lastIndexOf('/');
  startIndex = startIndex > -1 ? startIndex : 0;
  return uri.substring(startIndex);
}

export function getFileExt(uri: string): string {
  const startIndex = uri.lastIndexOf('.') + 1;
  return uri.substring(startIndex);
}

export function getFileNameWithoutExt(uri: string): string {
  let startIndex = uri.lastIndexOf('/');
  startIndex = startIndex > -1 ? startIndex : 0;
  const endIndex = uri.lastIndexOf('.');
  return uri.substring(startIndex, endIndex);
}

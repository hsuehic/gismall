/**
 * check whether all elements of the target array are in the arr array
 * @param arr {Array} scope
 * @param target {Array} target array
 */
export const checkAll = <T extends string | number>(
  arr: T[],
  target: T[]
): boolean => target.every(i => arr.indexOf(i) > -1);

/**
 * Check whether any element of the target array is in the arr array
 * @param arr {array} scope
 * @param target {array} target array
 */
export const checkAny = <T extends string | number>(
  arr: T[],
  target: T[]
): boolean => target.some(i => arr.indexOf(i) > -1);

/**
 * Merge all the arrays into one array, and remove the duplicated elements. For example, one user may have several roles, and each role may have several permissions, we need to get the permissions of the user, in this case we can use this util function.
 * @param args {Array<Array>} arrays to be merged.
 */
export const union = <T extends string | number>(...args: Array<T[]>): T[] => {
  const t = new Set<T>();
  args.forEach(arr => {
    arr.forEach(i => {
      t.add(i);
    });
  });
  return [...t];
};

/**
 * Get the common elements of all arrays
 * @param args {Array<Array<string|number>>} input arrays
 */
export const intersect = <T extends string | number>(
  ...args: Array<T[]>
): T[] => {
  const m = new Map<T, number>();
  args.forEach((arr: T[]) => {
    arr.forEach((i: T) => {
      m.set(i, (m.get(i) || 0) + 1);
    });
  });
  return [...m.keys()];
};

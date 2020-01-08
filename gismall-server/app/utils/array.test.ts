import { checkAll, checkAny, union, intersect } from './array';

it('Utils function should work', () => {
  const arr1 = [1, 2, 3];
  const arr2 = [2, 3, 4];
  const all1 = [1, 2, 3, 4, 5];
  const all2 = [1, 2, 3, 4];
  const without = [6, 7];
  const withAny = [1, 8];
  expect(checkAll([1, 2, 3, 4, 5], arr1)).toBe(true);
  expect(checkAny(arr1, withAny)).toBe(true);
  expect(union(arr1, arr2).sort()).toEqual(all2.sort());
  expect(intersect(arr1, arr2).sort()).toEqual([2, 3]);
  expect(checkAny(arr1, without)).toBe(false);
});

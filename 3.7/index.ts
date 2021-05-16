/**
 * TypeScript 3.7 2019/11/05
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
 */

/**
 * 1. Optional Chaining
 * おなじみ
 */

/**
 * 2. Nullish Coalescing
 * おなじみ
 */

import assert from 'assert';

/**
 * 3. Assertion Functions
 */
declare const a: unknown;
function isNumber (value: any): asserts value is number {
  //                            ^^^^^^^ この宣言
  assert(typeof value === 'string');
}
isNumber(a);
a.toFixed(1); // <= aがnumberに推論される

// type guardと同様
// type guardは条件を指定したが、assertsは例外を指定する

/**
 * 4. Better Support for never-Returning Functions
 */
function returnNever (condition: boolean) {
  if (condition) {
    return 'test'
  } else if (Math.random()) {
    return 1;
  }
  process.exit(1);
}








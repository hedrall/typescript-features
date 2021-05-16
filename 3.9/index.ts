/**
 * TypeScript 3.9 2020/03/12
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-3-9/
 */

/**
 * 1. Improvements in Inference and Promise.all
 * 推論とpromise.allの改善
 */
interface Lion { roar(): void }
interface Elephant {singKissFromARose(): void }
async function visitZoo(lionExhibit: Promise<Lion>, elephantExhibit: Promise<Elephant | undefined>) {
  let [lion, elephant] = await Promise.all([lionExhibit, elephantExhibit]);
  lion.roar(); // uh oh
//~~~~
//以前は, Object is possibly 'undefined'.
}

/**
 * 2. // @ts-expect-error Comments
 */
import assert from 'assert';
function doStuff(abc: string, xyz: string) {
  // ライブラリを開発している場合、
  // 下記の様なアサーションを使用して、JavaScriptユーザに警告を与えることがある
  assert(typeof abc === "string");
  assert(typeof xyz === "string");
}

expect(() => {
  // この関数のテストを書く場合、アサーションが上手く働くか確認する為に、
  // あえて型の不一致を発生させたいが、TSがエラーする
  doStuff(123, 456);
}).toThrow();

// そこでコメントを追加する
expect(() => {
  // @ts-expect-error
  doStuff(123, 456);
  // これによりエラーが消えるが
}).toThrow();

// @ts-expect-error <= エラーしない場合はコメントに警告が出る
console.log('正常');

/**
 * 3. Uncalled Function Checks in Conditional Expressions
 */
function hasImportantPermissions(): boolean {
  return false;
}

// 3.7からエラーが起きる
if (hasImportantPermissions) {}
// 3.9からこのパターンでもエラーが出る
const test = hasImportantPermissions ? 1 : 2;

declare function smushObjects<T, U>(x: T, y: U): T & U;

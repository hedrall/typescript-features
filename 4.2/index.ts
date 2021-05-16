/**
 * TypeScript 4.2 2021/02/23
 *
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/#smarter-type-alias-preservation
 * TypeScript 4.2　覚書
 * @see https://zenn.dev/yutama_kotaro/articles/43ac06011d3b47
 */

/**
 * 1. [Smarter Type Alias Preservation](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/#smarter-type-alias-preservation)
 * Type Aliasが保持されるようになった
 */
type BasicPrimitive = number | string | boolean;

export function doStuff(value: BasicPrimitive) {
  if (Math.random() < 0.5) {
    return undefined;
  }
  const x = value;
  return x;
}
/**
 * 戻り値が以下に推論される。
 * function doStuff(value: BasicPrimitive): BasicPrimitive | undefined
 *
 * 以前は
 * string | number | boolean | undefined
 * だった。
 */

/**
 * 2. Leading/Middle Rest Elements in Tuple Types
 * タプルの先頭と途中でもRest Elementsを置けるようになる
 */
// タプルの先頭
let preArray: [...string[], boolean];
preArray = ['1', '', false];

// 以前はこれがエラー: preArray = ['1', '', false];
// preArray = ['1', null, false]; // error

let middleArray: [boolean, number, ...string[], number];
middleArray = [false, 0, 'test', '', 1];

// type preAndOptional = [...string[], boolean?]; // error: An optional element cannot follow a rest element.
type optionalAndArray = [boolean?, ...string[]]; // ok
// type a = [boolean?, ...string[], boolean]; // error: A required element cannot follow an optional element.

/**
 * 3. Stricter Checks For The in Operator
 */
// "foo" in 42 // TS2361: The right-hand side of an 'in' expression must not be a primitive.
const _1 = "foo" in { a: 42 };
const _2 = "foo" in [42];

/**
 * 4. --noPropertyAccessFromIndexSignatureフラグの追加
 * もともとTypeScriptにあった古い動作に戻すフラグ
 */
interface Options {
  exclude: string[];
  [x: string]: any;
}

function processOptions(opts: Options) {
  // const a = opts.hogehoge; // TS4111: Property 'hogehoge' comes from an index signature, so it must be accessed with ['hogehoge'].
  const b = opts['hogehoge'];
}

let [_a, _b] = [1, 2];
const b = _a;

/**
 * 5. abstract Construct Signatures
 */

interface HasArea {
  getArea(): number;
}

abstract class Shape implements HasArea {
  abstract getArea(): number;
}

class Square extends Shape {
  #sideLength: number;

  constructor (sideLength: number) {
    super();
    this.#sideLength = sideLength;
  }

  getArea (): number {
    return this.#sideLength;
  }
}

// let _Ctor: new () => HasArea = Shape; // TS2322: Type 'typeof Shape' is not assignable to type 'new () => HasArea'. Cannot assign an abstract constructor type to a non-abstract constructor type.
let Ctor: abstract new () => HasArea = Shape;

/**
 * 6. Understanding Your Project Structure With --explainFiles
 */

// npx tsc --explainFiles を実行すると、ファイルが読み込まれた理由が見れる
// npm ls みたいな感じ

/**
 * 7. Destructured Variables Can Be Explicitly Marked as Unused
 * 未使用の変数が定義できる(JetBrainでは効かない?)
 */

let [_first, second] = [1,2];
console.log(second);

/**
 * 8. Relaxed Rules Between Optional Properties and String Index Signatures
 */
type WesAndersonWatchCount = {
  "Fantastic Mr. Fox"?: number;
  "The Royal Tenenbaums"?: number;
  // '鬼滅の刃': number | undefined; // この行があるとエラーが発生する
};

declare const wesAndersonWatchCount: WesAndersonWatchCount;
const movieWatchCount: { [key: string]: number } = wesAndersonWatchCount;
// 4.2以前は
// ~~~~~~~~~~~~~~~ error!
// Type 'WesAndersonWatchCount' is not assignable to type '{ [key: string]: number; }'.
//    Property '"Fantastic Mr. Fox"' is incompatible with index signature.
//      Type 'number | undefined' is not assignable to type 'number'.
//        Type 'undefined' is not assignable to type 'number'. (2322)

// numberをインデックスにした場合は場合は対象外
type WesAndersonWatchCount1 = {
  [1]: number;
  [2]?: number;
  // '鬼滅の刃': number | undefined; // この行があるとエラーが発生する
};
declare const wesAndersonWatchCount1: WesAndersonWatchCount1;
// const movieWatchCount1: { [key: number]: number } = wesAndersonWatchCount1; // error









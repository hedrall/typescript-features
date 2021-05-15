/**
 * TypeScript 4.0 2020/08/20
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/
 * (セマンティックバージョニングではない為、メジャーバージョンアップではない)
 */

/**
 * 1. Variadic Tuple Types
 */
// 変更1
// この...Tがかける様になった
// つまり、「タプル型シンタックスのスプレッドがジェネリック」
// => スプレッドでタプルの型の一部を束縛できる様になった
function tail<T extends any[]>(arr: readonly [any, ...T]) {
  const [_ignore, ...rest] = arr;
  return rest;
}

const myTuple = [1, 2, 3, 4] as const;
const myArray = ['hello', 'world'] ;

const r1 = tail(myTuple);
// => r1: [2, 3, 4]
const r2 = tail([...myTuple, ...myArray]);
// => r2: [2, 3, 4, 'hello', 'world']

// 変更2
// スプレットをどの位置にでも使える様になった
const _f1 = () => {
  type Strings = [string, string];
  type Numbers = [number, number];
  type StrStrNumNumBool = [...Strings, Numbers, boolean];
  // >= 4.0[string, string, number, number, boolean]
  // < 3.9の場合: TS1256: A rest element must be last in a tuple type.

  // これはできない
  // つまり可変長さ部分は最後だけ
  // type StrStrNumNumBool1 = [...Strings[], Numbers, boolean];
}

// 変更1と変更2を合わせて、concatの様な関数を型付けできる様になった
type Arr = readonly any[];
function concat<T extends Arr, U extends Arr>(arr1: T, arr2: U): [...T, ...U] {
  return [...arr1, ...arr2];
}

// 高度なパターンでも使える
function partialCall<T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R, ...headArgs: T
) {
  return (...tailArgs: U) => f(...headArgs, ...tailArgs)
}

const foo = (x: string, y: number, z: boolean) => {}

const f1 = partialCall(foo, '100');
// error: const f1 = partialCall(foo, 100);
const f2 = partialCall(foo, '100', 100);
// error: const f2 = partialCall(foo, '100', '100');
const f3 = partialCall(foo, '100', 100, false);
// error: const f3 = partialCall(foo, '100', 100, 'false');
// error: const f3 = partialCall(foo, '100', 100, false, 'ops');

f1(100, false);
// error: f1();
// error: f1('100', false);
// error: f1(100, false, 'ops');

/**
 * 2. Labeled Tuple Elements
 * タプルの要素に名前をつけられる
 */
const example1 = (...args: [number, string]) => { /* ... */ };
const example2 = (first: number, second: string) => { /* ... */ };
// example1とexample2の型は同じだけど、1は読みにくい...
// そこで、タプルにラベルをつけられる様になった
const example3 = (...args: [first: number, second: string]) => { /* ... */};
// => const example3: (first: number, second: string) => void

/**
 * 3. Class Property Inference from Constructors
 */
class Square {
  // 以前はanyに推論されていた
  area;       // numberに推論される
  sideLength; // numberに推論される

  constructor(sideLength: number) {
    this.sideLength = sideLength;
    this.area = sideLength ** 2;
  }
}

class Square2 {
  sideLength;

  constructor(sideLength: number) {
    if (Math.random()) {
      // 初期化されない可能性がある場合は、
      // sideLengthはオプショナルなパラメータとして扱われる
      this.sideLength = sideLength;
    }
  }

  get area () {
    // @ts-ignore
    return this.sideLength ** 2;
    //     ~~~~~~~~~~~~~~~
    // error! Object is possibly 'undefined'.
  }
}

/**
 * 4. Short-Circuiting Assignment Operators
 */
// 代入演算子が追加された
declare let a: string | undefined;
declare const b: string;

// 以下の三つの式は等しい
a ||= b; /* => */ if (!a) { a = b; }
a &&= b; /* => */ if (a) { a = b;}
a ??= b; /* => */ if (a === null || a === undefined) { a = b }

/**
 * 5. unknown on catch Clause Bindings
 * catchのxはもともとanyに推論されるが、unknownを指定することができる様になった
 */
try {}
catch (x: unknown) {
  // console.log(x.message); // error
  if (x instanceof Error) {
    // しっかりプロパティチェックをしないとエラーする
    console.log(x.message);
  }
}

/**
 * 6.
 * JSXの変換方法をカスタマイズできる様になった
 *
 * {
 *   "compilerOptions": {
 *     "target": "esnext",
 *     "module": "commonjs",
 *     "jsx": "react", // react互換
 *     "jsxFactory": "h", // React.createElement => h
 *     "jsxFragmentFactory": "Fragment" // React.Fragment  => Fragment
 *   }
 * }
 */
// ファイル単位では以下のDOC形式のコメントで適用できる
/** @jsx h */
/** @jsxFrag Fragment */

/**
 * 7. エディターの強化
 * 7.1 optional chainingとnullish coalescingへの変換ができる様になった
 * return a && a.b.c && a.b.c.d.e.f();
 * => a?.b.c?.d.e.f();
 *
 * 7.2 @deprecated が指定された変数に取消線が引かれる様になった
 */

/**
 * その他
 * VS code での起動が早くなった
 */
/**
 * 参考: https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/
 */

/**
 * 1. Template Literal Types
 */
type World = "world";
type Greeting = `hello ${World}`;
// => これと同じ type Greeting = "hello world";

type Color = 'red' | 'blue';
type Quantity = 'one' | 'two';
type Fish = `${Color | Quantity} fish`;
// 可能な全通りのStringリテラルのユニオンになる
// => type SeussFish = "one fish" | "two fish" | "red fish" | "blue fish";

/**
 * Use Case
 */
// 1. 二次元のalignment
type VerticalAlignment = 'top' | 'middle' | 'bottom';
type HorizontalAlignment = 'left' | 'center' | 'right';
type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`;
// =>  | "top-left"    | "top-center"    | "top-right"
//     | "middle-left" | "middle-center" | "middle-right"
//     | "bottom-left" | "bottom-center" | "bottom-right"

// 2. Objectにイベントを設置する時など
type PropEventSource<T> = {
  on<K extends string & keyof T>(eventName: `${K}Changed`, callback: (value: T[K]) => void): void;
};
// オブジェクトにonメソッドを追加する関数
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
const person = {
  firstName: "Homer",
  age: 42, // give-or-take
};
const watchedPerson = makeWatchedObject(person);
watchedPerson.on('firstNameChanged', (value /* stringに推論される */) => {});
watchedPerson.on('ageChanged', (value /* numberに推論される */ ) => {});

// さらに、新たな utility type alias を追加している
type HelloWorld = 'HelloWorld';
type HELLOWORLD = `${Uppercase<HelloWorld>}`;
type helloworld = `${Lowercase<HelloWorld>}`;
// type HelloWorld = `${Capitalize<HelloWorld>}`;
type helloWorld = `${Uncapitalize<HelloWorld>}`;

/**
 * 2. Key Remapping in Mapped Types
 */
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};
// このasで変換したり、フィルターをかけたりできる

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
// =>
// type LazyPerson = {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }

// フィルターする例
type RemoveKindField<T> = {
  [K in keyof T as Exclude<K, "kind">]: T[K]
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
// type KindlessCircle = {
//     radius: number;
// };

/**
 * 3. Recursive Conditional Types
 */
type ElementType<T> = T extends ReadonlyArray<infer U> ? ElementType<U> : T;
// 方を再起的に使用できる

function deepFlatten<T extends unknown[]>(x: T): ElementType<T>[] {
  throw "not implemented";
}

// 全て戻り値が number[] 型になっている
// あれ、以前もこれできてたよなぁと思ったけど、
// 以前は ElementType<number> に解決されていた為、その後の型補完が聞いていなかった
deepFlatten([1, 2, 3]);
deepFlatten([[1], [2, 3]]);
deepFlatten([[1], [[2]], [[[3]]]]);

/**
 * 4. noUncheckedIndexedAccessフラグの追加
 */
interface Options {
  path: string;
  permissions: number;

  // Extra properties are caught by this index signature.
  [propName: string]: string | number;
}

function checkOptions(opts: Options) {
  opts.path // string
  opts.permissions // number

  // これらは以前エラーしないコードだった。
  // なぜなら、全て string | number に推論されていたから
  // noUncheckedIndexedAccessフラグをONにした場合は、
  // string | number | undefined に解決する為、描きはエラーする
  // opts.yadda.toString();
  // opts["foo bar baz"].toString();
  // opts[Math.random()].toString();
}

/**
 * 5. @seeがエディター対応
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/
 */

/**
 * 6. any/unknown Are Propagated in Falsy Positions
 */
declare let foo: unknown;
declare let somethingElse: { someProp: string };

// もともと { someProp: string } に解決していたのが、
// unknownになった

let x = foo && somethingElse;
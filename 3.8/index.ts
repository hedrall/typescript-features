/**
 * TypeScript 3.8 2020/02/20
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-3-8/
 */

import has = Reflect.has;

/**
 * 1. Type-Only Imports and Exports
 */

// 明示的にimport/exportが型だけを利用したいことを示せる
import type { SomeThing } from './some-module';
// これはコンパイル時に消去される。(importに寄る副作用が起きない)

new SomeThing()
// その為、これはエラーする
// TS1361: 'SomeThing' cannot be used as a value because it was imported using 'import type'.

/**
 * 2. ECMAScript Private Fields
 *
 * ECMAのプライベートフィールドが定義できる様になった
 */
// private修飾子と違って、hard privacyと呼ばれる。
// 以下は違いの例
class A {
  #hard: number = 10;

  getHardA = () => this.#hard;
}

class B extends A {
  // privateと違いoverrideできるが
  #hard: number = 20;

  getHardB = () => this.#hard;
}
const b = new B();
b.getHardA(); // 10
b.getHardB(); // 20

/**
 * 3. export * as ns Syntax
 */
import * as SomeModule1 from "./some-module";
export { SomeModule1 };
// これが以下の様にかける様になった
export * as SomeModule2 from './some-module';

/**
 * 4. Top-Level await
 */
// トップレベルでawaitが使える様になった。
// ただし、実行環境は限られ、
// ビルド対象がES2017以上かつ、モジュールがesnextまたはsystemの時サポートされる







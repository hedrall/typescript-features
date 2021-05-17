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
const lsls = new B();
console.log( lsls.getHardA()); // 10 <= 別のスコープの変数として保存されている
console.log( lsls.getHardB()); // 20
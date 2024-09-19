# Функциональные выражения на JavaScript.

1. Разработайте функции `cnst`, `variable`, `add`, `subtract`, `multiply`, `divide` и `negate` для вычисления выражений с тремя переменными: `x`, `y` и `z`.
2. Функции должны позволять производить вычисления вида:
```js
let expr = subtract(
    multiply(
        cnst(2),
        variable("x")
    ),
    cnst(3)
);
println(expr(5, 0, 0));
```
При вычислении выражения вместо каждой переменной подставляется значение, переданное в качестве соответствующего параметра функции `expr`. Таким образом, результатом вычисления приведенного примера должно быть число `7`.

3. При выполнении задания следует обратить внимание на:
    - Применение функций высшего порядка.
    - Выделение общего кода для операций.

4. Модификация:
    - Добавьте функции `abs` и `branch`.
        * `abs` имеет один параметр и должна брать его модуль (подсказка: в JS есть `Math.abs`).
        * `branch` имеет три параметра и делает следующее: если первый аргумент больше либо равен нулю, то `branch` возвращает второй аргумент, иначе третий.

5. Не забудьте добавить `abs` и `branch` в `module.exports`. Теперь последняя строчка Вашего файла должна выглядеть так:
```js
module.exports = {cnst, variable, add, subtract, multiply, divide, negate, abs, branch};
```
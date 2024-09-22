"use strict";

const {cnst, variable, add, subtract, multiply, divide, negate, abs, branch} = require('./functional')

const sfc32 = require("./random-sfc32")
const rng = sfc32(0xCAFEBABE, 0xDEADBEEF, 0xF0CACC1A, 0xB16B00B5)


const numbersStr = ["0.0", "-0.0",
           "1000", "-1000",
           "0.001", "-0.001",
           "Number.MAX_SAFE_INTEGER", "Number.MIN_SAFE_INTEGER", "Number.MAX_SAFE_INTEGER + 1", "Number.MIN_SAFE_INTEGER - 1",
           "Number.MAX_VALUE", "-Number.MAX_VALUE",
           "Number.MIN_VALUE", "-Number.MIN_VALUE",
           "Number.EPSILON", "-Number.EPSILON",
           "Number.POSITIVE_INFINITY", "Number.NEGATIVE_INFINITY", "Number.NaN"]

const numbers = numbersStr.map(eval)

function testRange(expected, actualStr) {
    const actual = eval(actualStr)
    for (const x of numbers) {
        for (const y of numbers) {
            for (const z of numbers) {
                try {
                    // console.log(expected + ":" + actual(x, y, z));
                    expect(actual(x, y, z)).toBe(expected(x, y, z))
                } catch (err) {
                    err.message += "\n" + actualStr
                    throw err
                }
            }
        }
    }
}

test('constants', () => {
    for (const i in numbers) {
        testRange((x, y, z) => numbers[i], "cnst(" + numbersStr[i] + ")")
    }
})

test('variables', () => {
    testRange((x, y, z) => x, "variable('x')")

    testRange((x, y, z) => y, "variable('y')")

    testRange((x, y, z) => z, "variable('z')")
})

test('simple', () => {
    testRange((x, y, z) => 3 + y, "add(cnst(3), variable('y'))")

    testRange((x, y, z) => z - Number.MAX_SAFE_INTEGER, "subtract(variable('z'), cnst(Number.MAX_SAFE_INTEGER))")

    testRange((x, y, z) => x * z, "multiply(variable('x'), variable('z'))")

    testRange((x, y, z) => z / y, "divide(variable('z'), variable('y'))")

    testRange((x, y, z) => -x, "negate(variable('x'))")

    testRange((x, y, z) => Math.abs(y), "abs(variable('y'))")

    testRange((x, y, z) => z >= 0 ? 319760 : x, "branch(variable('z'), cnst(319760), variable('x'))")
})



function randomTest(depth, count) {
    // Wow, so ugly
    function generateRandomTest(depth) {
        const r = depth > 0 ? Math.floor(rng() * 9) : Math.floor(rng() * 2) + 7
        let left, middle, right
        if (r <= 6) {
            left = generateRandomTest(depth - 1)
        }
        if (r == 6) {
            middle = generateRandomTest(depth - 1)
        }
        if (r <= 3 || r == 6) {
            right = generateRandomTest(depth - 1)
        }
        switch (r) {
            case 0:
                return {a : "add(" + left.a + ", " + right.a + ")", e : "(" + left.e + "+" + right.e + ")"}
            case 1:
                return {a : "subtract(" + left.a + ", " + right.a + ")", e : "(" + left.e + "-" + right.e + ")"}
            case 2:
                return {a : "multiply(" + left.a + ", " + right.a + ")", e : "(" + left.e + "*" + right.e + ")"}
            case 3:
                return {a : "divide(" + left.a + ", " + right.a + ")", e : "(" + left.e + "/" + right.e + ")"}
            case 4:
                return {a : "negate(" + left.a + ")", e : "(-" + left.e + ")"}
            case 5:
                return {a : "abs(" + left.a + ")", e : "(Math.abs(" + left.e + "))"}
            case 6:
                return {a : "branch(" + left.a + ", " + middle.a + ", " + right.a + ")", e : "(" + left.e + "?" + middle.e + ":" + right.e + ")"}
            case 7:
                const c = rng() * 200001 - 100000
                return {a : "cnst(" + c + ")", e : "(" + c + ")"}
            case 8:
                const vars = ['x', 'y', 'z']
                const v = vars[Math.floor(rng() * 3)]
                return {a : "variable('" + v + "')", e : "(" + v + ")"}
        }
    }

    test("random with depth " + depth, () => {
        for (let i = 0; i < count; i++) {
            const {a : actual, e : expected} = generateRandomTest(depth)
            testRange(eval("(x, y, z) => " + expected), actual)
        }
    })
}

randomTest(2, 10)
randomTest(3, 10)
randomTest(5, 10)
randomTest(10, 5)

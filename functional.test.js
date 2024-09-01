const {cnst, variable, add, subtract, multiply, divide, negate} = require('./functional')

const sfc32 = require("./random-sfc32")
rng = sfc32(0xCAFEBABE, 0xDEADBEEF, 0xF0CACC1A, 0xB16B00B5)


numbersStr = ["0.0", "-0.0", "1", "-1",
           "10", "-10", "1000", "-1000",
           "0.1", "-0.1", "0.001", "-0.001",
           "Number.MAX_SAFE_INTEGER", "Number.MIN_SAFE_INTEGER", "Number.MAX_SAFE_INTEGER + 1", "Number.MIN_SAFE_INTEGER - 1",
           "Number.MAX_VALUE", "-Number.MAX_VALUE",
           "Number.MIN_VALUE", "-Number.MIN_VALUE",
           "Number.EPSILON", "-Number.EPSILON",
           "Number.POSITIVE_INFINITY", "Number.NEGATIVE_INFINITY", "Number.NaN"]

numbers = numbersStr.map(eval)

function testRange(expected, actualStr) {
    console.log("Testing " + actualStr)
    actual = eval(actualStr)
    for (const x of numbers) {
        for (const y of numbers) {
            for (const z of numbers) {
                expect(actual(x, y, z)).toBe(expected(x, y, z))
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
})



function randomTest(depth, count) {
    // Wow, so ugly
    function generateRandomTest(depth) {
        const r = depth > 0 ? Math.floor(rng() * 7) : Math.floor(rng() * 2) + 5
        let left
        if (r <= 4) {
            left = generateRandomTest(depth - 1)
        }
        let right
        if (r <= 3) {
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
                c = rng() * 200001 - 100000
                return {a : "cnst(" + c + ")", e : "(" + c + ")"}
            case 6:
                vars = ['x', 'y', 'z']
                v = vars[Math.floor(rng() * 3)]
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

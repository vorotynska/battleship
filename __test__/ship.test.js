// __test__/ship.test.js
const {
    Ship
} = require("../src/ship");

describe("Ship", () => {
    test("creates ship and reports not sunk initially", () => {
        const s = new Ship(3);
        expect(s.length).toBe(3);
        expect(s.isSunk()).toBe(false);
    });

    test("record hits and become sunk", () => {
        const s = new Ship(2);
        s.hitAt(0);
        expect(s.isSunk()).toBe(false);
        s.hitAt(1);
        expect(s.isSunk()).toBe(true);
    });

    test("hitAt invalid index throws", () => {
        const s = new Ship(2);
        expect(() => s.hitAt(2)).toThrow();
        expect(() => s.hitAt(-1)).toThrow();
    });
});
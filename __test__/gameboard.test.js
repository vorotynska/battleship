// __test__/gameboard.test.js
const {
    GameBoard
} = require("../src/gameboard");
const {
    Ship
} = require("../src/ship");

describe("GameBoard placement", () => {
    let board;
    beforeEach(() => {
        board = new GameBoard(10);
    });

    test("can place ship within bounds horizontally and vertically", () => {
        expect(board.canPlaceShip(0, 0, "H", 3)).toBe(true);
        expect(board.canPlaceShip(8, 0, "H", 3)).toBe(false); // out of bounds horizontally
        expect(board.canPlaceShip(0, 8, "V", 3)).toBe(false); // out of bounds vertically
        expect(board.canPlaceShip(7, 7, "V", 3)).toBe(true);
    });

    test("placing a ship stores its coords and prevents overlap", () => {
        const s1 = new Ship(3);
        board.placeShip(0, 0, "H", s1);
        const s2 = new Ship(2);
        expect(board.canPlaceShip(0, 0, "H", 2)).toBe(false); // overlap
        expect(() => board.placeShip(0, 0, "H", s2)).toThrow();
        expect(board.canPlaceShip(0, 1, "H", 2)).toBe(true);
        board.placeShip(0, 1, "H", s2);
        expect(board.ships.length).toBe(2);
    });

    test("placing invalid ship instance throws", () => {
        expect(() => board.placeShip(0, 0, "H", {})).toThrow();
    });
});

describe("GameBoard attacks", () => {
    let board;
    beforeEach(() => {
        board = new GameBoard(10);
    });

    test("miss when no ship", () => {
        const res = board.receiveAttack(5, 5);
        expect(res).toEqual({
            result: "miss"
        });
    });

    test("hit and sunk behavior", () => {
        const s = new Ship(2);
        board.placeShip(2, 2, "H", s); // occupies (2,2) and (3,2)
        expect(board.receiveAttack(2, 2)).toEqual({
            result: "hit"
        });
        // second hit sinks
        expect(board.receiveAttack(3, 2)).toEqual({
            result: "sunk",
            shipLength: 2
        });
    });

    test("cannot attack same coordinate twice", () => {
        board.receiveAttack(0, 0);
        expect(board.receiveAttack(0, 0)).toEqual({
            result: "already"
        });
    });

    test("allShipsSunk works", () => {
        const a = new Ship(1);
        const b = new Ship(2);
        board.placeShip(0, 0, "H", a); // at (0,0)
        board.placeShip(1, 0, "H", b); // at (1,0) and (2,0)

        expect(board.allShipsSunk()).toBe(false);
        board.receiveAttack(0, 0); // sinks a
        expect(board.allShipsSunk()).toBe(false);
        board.receiveAttack(1, 0);
        board.receiveAttack(2, 0);
        expect(board.allShipsSunk()).toBe(true);
    });

    test("invalid attack coordinates throw", () => {
        expect(() => board.receiveAttack(-1, 0)).toThrow();
        expect(() => board.receiveAttack(100, 100)).toThrow();
    });
});
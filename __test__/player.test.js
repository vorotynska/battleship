// __test__/player.test.js
const {
    Player
} = require("../src/player");
const {
    GameBoard
} = require("../src/gameboard");
const {
    Ship
} = require("../src/ship");

describe("Player class", () => {
    test("creates human plaer with board", () => {
        const p = new Player("Alice", "human");
        expect(p.name).toBe("Alice");
        expect(p.type).toBe("human");
        expect(p.board).toBeInstanceOf(GameBoard);
    });

    test("throus eroor for invalid type or missing name", () => {
        expect(() => new Player("A"));
        expect(() => new Player("Bob", "alien")).toThrow();
    });

    test("player can attack enemy board", () => {
        const attacker = new Player("A");
        const defender = new Player("B");
        const ship = new Ship(1);
        defender.board.placeShip(0, 0, "H", ship);
        const res = attacker.attack(defender.board, 0, 0);
        expect(res.result).toBe("sunk");
        expect(defender.board.allShipsSunk()).toBe(true);
    });

    test("computer picks random coords and doesn's repeat", () => {
        const cpu = new Player("CPU", "computer");
        const coords1 = cpu.getRandomAttackCoords(10);
        const coorda2 = cpu.getRandomAttackCoords(10);
        expect(Array.isArray(coords1)).toBe(true);
        expect(coords1.length).toBe(2);
        expect(cpu.attackedCoords.size).toBe(2);
    });

    test("computer can attack enemy board without repeating", () => {
        const cpu = new Player("CPU", "computer");
        const enemy = new Player("Enemy");
        const res1 = cpu.computerAttck(enemy.board);
        expect(["hit", "miss", "sunc"]).toContain(res1.result);
        expect(cpu.attackedCoords.size).toBe(1);
        const res2 = cpu.computerAttck(enemy.board);
        expect(cpu.attackedCoords.size).toBe(2);
    });
});
// __test__/game.test.js
const {
    Game
} = require("../src/game");
const {
    Ship
} = require("../src/ship");

describe("Game class", () => {
    test("creates game with two players", () => {
        const game = new Game("Alice");
        expect(game.human.name).toBe("Alice");
        expect(game.computer.name).toBe("Computer");
        expect(game.getCurrentPlayer()).toBe("human");
    });

    test("alternates turn between human and computer", () => {
        const gane = new Game("Bob");
        const ship = new Ship(1);
        gane.computer.board.placeShip(0, 0, "H", ship);

        const res1 = gane.humanAttack(0, 0);
        expect(res1.result).toBe("sunk");

        // If the ship is sunk, the game is over
        expect(gane.gameOver).toBe(true);
        expect(gane.getWinner()).toBe("human");
    });

    test("computer can attack player board", () => {
        const game = new Game("Test");
        const ship = new Ship(1);
        game.human.board.placeShip(0, 0, "H", ship);

        // a man shoots a blank shot
        game.computer.board.placeShip(1, 1, "H", new Ship(1)); // so as not to win right away
        game.humanAttack(5, 5);
        expect(game.getCurrentPlayer()).toBe("computer");

        const res = game.computerAttack();
        expect(["miss", "hit", "sunk"]).toContain(res.result);
        expect(game.getCurrentPlayer()).toBe("human");
    });

    test("throws error if attaking out of turn", () => {
        const game = new Game("Eve");
        expect(() => game.computerAttack()).toThrow("Not computer's turn");
        game.humanAttack(0, 0);
        expect(() => game.humanAttack(1, 1)).toThrow("Not human's turn");
    });
});
// src/player.js
const {
    GameBoard
} = require("./gameboard");

class Player {
    constructor(name, type = "human") {
        if (!name) throw new Error("Player must have a nsme");
        if (type !== "human" && type !== "computer") throw new Error("Invalid Player type");

        this.name = name;
        this.type = type;
        this.board = new GameBoard();
        this.attackedCoords = new Set(); // only for computer
    }

    /**
     * Attacks an opponent's board
     * @param {GameBoard} enemyBoard 
     * @param {number} x
     * @param {number} y
     * @param {object} shot result {result: "hit"|"miss"|"sunc", ...}
     */

    attack(enemyBoard, x, y) {
        if (!(enemyBoard instanceof GameBoard)) {
            throw new Error("Invalid target board");
        }
        return enemyBoard.receiveAttack(x, y);
    }

    /**
     * Select random coordinates for attack (for the computer)
     * does not repeat previously fired shot
     */
    getRandomAttackCoords(boardSise = 10) {
        if (this.type !== "computer") {
            throw new Error("Only computer can pick random attack coords");
        }

        let x, y, key;
        do {
            x = Math.floor(Math.random() * boardSise);
            y = Math.floor(Math.random() * boardSise);
            key = `${x}.${y}`;
        } while (this.attackedCoords.has(key));

        this.attackedCoords.add(key);
        return [x, y];
    }

    /**
     * The computer shoots at the other board
     */
    computerAttck(enemyBoard) {
        const [x, y] = this.getRandomAttackCoords(enemyBoard.size);
        return this.attack(enemyBoard, x, y);
    }
}

module.exports = {
    Player
};
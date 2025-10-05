// src/game.js
const {
    Player
} = require("./player");

class Game {
    constructor(playerName = "Player") {
        this.human = new Player(playerName, "human");
        this.computer = new Player("Computer", "computer");
        this.currentTurn = "human";
        this.gameOver = false;
    }

    /**
     * Checking game status
     */
    checkGameOver() {
        if (this.human.board.allShipsSunk()) {
            this.gameOver = true;
            return "computer";
        }
        if (this.computer.board.allShipsSunk()) {
            this.gameOver = true;
            return "human";
        }
        return null;
    }

    /**
     * Human move - attacks the computer board
     */
    humanAttack(x, y) {
        if (this.gameOver) throw new Error("Game already over");
        if (this.currentTurn !== "human") throw new Error("Not human's turn");

        const result = this.human.attack(this.computer.board, x, y);
        const winner = this.checkGameOver();

        if (!winner) {
            this.currentTurn = "computer";
        }
        return result;
    }

    /**
     * Computer move - attacks the player board
     */
    computerAttack() {
        if (this.gameOver) throw new Error("Game already over");
        if (this.currentTurn !== "computer") throw new Error("Not computer's turn");

        const result = this.computer.computerAttck(this.human.board);
        const winner = this.checkGameOver();

        if (!winner) {
            this.currentTurn = "human";
        }
        return result;
    }

    /**
     * Returns whose turn it is
     */
    getCurrentPlayer() {
        return this.currentTurn;
    }

    /**
     * Check who won (or null)
     */
    getWinner() {
        if (!this.gameOver) return null;
        if (this.human.board.allShipsSunk()) return "computer";
        if (this.computer.board.allShipsSunk()) return "human";
        return null;
    }
}

module.exports = {
    Game
};
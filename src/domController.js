// src/domController.js
const {
    Game
} = require("./game");

class DOMController {
    constructor() {
        this.game = new Game("Player");
        this.playerBoardEl = document.querySelector("#player-board");
        this.cpuBoardEl = document.querySelector("#cpu-board");
        this.messageEl = document.querySelector("message");
    }

    /**
     * Interface initialization
     * 
     */
    init() {
        this.renderBoards();
        this.updateMessage("Your move!");
        this.addBoardListeners();
    }

    /**
     * Render boards
     */
    renderBoards(container, grid, isEnemy = false) {
        container.innerHTML = "";
        grid.forEach((row, x) => {
            const rowEl = document.createElement("div");
            rowEl.classList.add("row");
        })
    }
}
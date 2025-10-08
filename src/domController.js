// src/domController.js
const {
    Game
} = require("./game");
const {
    Ship
} = require("./ship");
const {
    DragManager
} = require("./dragManager");


class DOMController {
    constructor() {
        // this.game = new Game("Player");
        this.restartBtn = document.querySelector("#restart-btn");
        this.playerBoardEl = document.querySelector("#player-board");
        this.cpuBoardEl = document.querySelector("#cpu-board");
        this.messageEl = document.querySelector("#message");
        this.init() // first initialization
    }

    /**
     * Interface initialization
     */
    init() {
        this.game = new Game("Player");

        // automatic placement of ship
        this.autoPlaceShips(this.game.human.board);
        this.autoPlaceShips(this.game.computer.board);

        this.renderBoards();
        // Drag & Drop
        const dock = document.querySelector("#ship-dock");
        this.dragManager = new DragManager(this.playerBoardEl, this.game.human.board, () => {
            this.renderBoards();
        });
        this.dragManager.renderShipDock(dock);
        this.dragManager.enable();

        this.updateMessage("You move!");
        this.addBoardListeners();
        this.addRestartListener();
    }
    // button Restart
    addRestartListener() {
        if (!this.restartBtn) return;
        this.restartBtn.addEventListener("click", () => {
            this.updateMessage("🔄 New Game");
            setTimeout(() => {
                this.init();
            }, 300);
        });
    }

    /**
     * Automatic placement of ship
     */
    autoPlaceShips(board) {
        const ships = [
            new Ship(4),
            new Ship(3), new Ship(3),
            new Ship(2), new Ship(2), new Ship(2),
            new Ship(1), new Ship(1), new Ship(1), new Ship(1),
        ];

        for (const ship of ships) {
            let placed = false;

            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const direction = Math.random() > 0.5 ? "H" : "V";

                try {
                    board.placeShip(x, y, direction, ship);
                    placed = true;
                } catch {
                    // we'll try again if couldn't set it up (busy or out of bounds)
                }
            }
        }
    }

    /**
     * Render boards
     */
    renderBoards() {
        this.renderBoard(this.playerBoardEl, this.game.human.board.grid, false);
        this.renderBoard(this.cpuBoardEl, this.game.computer.board.grid, true);
    }

    renderBoard(container, grid, isEnemy = false) {
        container.innerHTML = "";
        grid.forEach((row, x) => {
            const rowEl = document.createElement("div");
            rowEl.classList.add("row");

            row.forEach((cell, y) => {
                const cellEl = document.createElement("div");
                cellEl.classList.add("cell");
                cellEl.dataset.x = x;
                cellEl.dataset.y = y;

                if (!isEnemy && cell.hasShip) {
                    cellEl.classList.add("ship");
                }

                if (cell.hit) cellEl.classList.add("hit");
                if (cell.missed) cellEl.classList.add("miss");

                rowEl.appendChild(cellEl);
            });
            container.appendChild(rowEl);
        });
    }

    /**
     * Adding click events to the enemy board
     */
    addBoardListeners() {
        this.cpuBoardEl.addEventListener("click", (e) => {
            if (this.game.gameOver || this.game.getCurrentPlayer() !== "human") return;
            const cell = e.target.closest(".cell");
            if (!cell) return;

            const x = +cell.dataset.x;
            const y = +cell.dataset.y;
            const result = this.game.humanAttack(x, y);

            // если уже стреляли — ничего не делаем
            if (result.result === "already") return;

            this.renderBoards();

            if (this.game.getWinner()) {
                this.updateMessage(`🎉 Winner ${this.game.getWinner()}!`);
                return;
            }

            this.updateMessage("Computer move");
            setTimeout(() => {
                this.game.computerAttack();
                this.renderBoards();

                if (this.game.getWinner()) {
                    this.updateMessage(`🎉 Winner ${this.game.getWinner()}!`);
                } else {
                    this.updateMessage("You move!");
                }
            }, 800);
        });
    }

    /**
     * Message to the player
     */
    updateMessage(text) {
        this.messageEl.textContent = text;
    }
}

module.exports = {
    DOMController
};
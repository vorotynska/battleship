// srs/dragManager.js
const {
    Ship
} = require("./ship");

class DragManager {
    constructor(boardEl, gameBoard, onUpdate) {
        this.boardEl = boardEl;
        this.board = gameBoard;
        this.onUpdate = onUpdate;
        this.dragData = null;
    }

    /**
     * Инициализация drag&drop и кнопки вращения
     */
    enable() {
        this.makeCellsDroppable();
        this.addRotateSupport();
    }

    /**
     * Создаёт панель с кораблями для размещения
     */
    renderShipDock(container) {
        container.innerHTML = "";
        const ships = [
            new Ship(4),
            new Ship(3), new Ship(3),
            new Ship(2), new Ship(2), new Ship(2),
            new Ship(1), new Ship(1), new Ship(1), new Ship(1),
        ];

        ships.forEach((ship, index) => {
            const shipEl = document.createElement("div");
            shipEl.classList.add("draggable-ship");
            shipEl.draggable = true;
            shipEl.dataset.length = ship.length;
            shipEl.dataset.orientation = "H";
            shipEl.dataset.id = index;
            shipEl.textContent = "🚢".repeat(ship.length);

            shipEl.addEventListener("dragstart", (e) => {
                // if the ship is already placed, we don't allow it to be moved
                if (shipEl.classList.contains("placed")) {
                    e.preventDefault();
                    return;
                }
                this.dragData = {
                    length: ship.length,
                    orientation: shipEl.dataset.orientation,
                    shipInstance: ship,
                    id: index,
                    element: shipEl,
                };
                e.dataTransfer.effectAllowed = "move";
                shipEl.classList.add("dragging");
            });

            shipEl.addEventListener("dragend", () => {
                shipEl.classList.remove("dragging");
                this.dragData = null;
            })

            container.appendChild(shipEl);
        });
    }

    /**
     * Делает клетки доступными для дропа
     */
    makeCellsDroppable() {
        this.boardEl.addEventListener("dragover", (e) => e.preventDefault());

        this.boardEl.addEventListener("drop", (e) => {
            const cell = e.target.closest(".cell");
            if (!cell || !this.dragData) return;

            const x = +cell.dataset.x;
            const y = +cell.dataset.y;
            const {
                shipInstance,
                orientation,
                element
            } = this.dragData;

            try {
                this.board.placeShip(x, y, orientation, shipInstance);
                // mark the ship as placed
                element.classList.add("placed");
                element.draggable = false;
                this.dragData = null;
                this.onUpdate();
            } catch (err) {
                console.warn("❌ Нельзя разместить корабль здесь:", err.message);
            }
        });
    }

    /**
     * Добавляем кнопку для поворота кораблей
     */
    addRotateSupport() {
        document.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "r") {
                // если корабль выбран
                const dock = document.querySelector("#ship-dock");
                const selected = dock.querySelector(".selected");
                if (selected) {
                    const newOrientation = selected.dataset.orientation === "H" ? "V" : "H";
                    selected.dataset.orientation = newOrientation;
                    selected.classList.toggle("vertical", newOrientation === "V");
                }
            }
        });

        // выделяем корабль кликом
        document.addEventListener("click", (e) => {
            if (!e.target.classList.contains("draggable-ship")) return;
            document.querySelectorAll(".draggable-ship").forEach((el) => el.classList.remove("selected"));
            e.target.classList.add("selected");
        });
    }
}

module.exports = {
    DragManager
};
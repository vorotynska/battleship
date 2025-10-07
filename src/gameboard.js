// src/gameboard.js
const {
    Ship
} = require("../src/ship");

class GameBoard {
    constructor(size = 10) {
        if (!Number.isInteger(size) || size <= 0) throw new Error("Invalis board size");
        this.size = size;
        // create a visual grid for drawing
        this.grid = Array.from({
                length: size
            }, () =>
            Array.from({
                length: size
            }, () => ({
                hasShip: false,
                hit: false,
                missed: false,
                ship: null,
            }))
        );
        // track ships: each entry { ships, coords: [ [x,y], ... ]}
        this.ships = [];
        // attacked set to avoid double shots (stringified coords)
        this.attacked = new Set();
    }

    // helper: check coordinate in board
    _inBounds(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    // check if can place ship of given length at x,y with orientation 'H' or 'V'
    canPlaceShip(x, y, orientation, length) {
        if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
        if (orientation !== "H" && orientation !== "V") return false;
        if (!Number.isInteger(length) || length <= 0) return false;

        for (let i = 0; i < length; i++) {
            const nx = x + (orientation === "H" ? i : 0);
            const ny = y + (orientation === "V" ? i : 0);
            if (!this._inBounds(nx, ny)) return false;

            // check collision with existing ships
            for (const record of this.ships) {
                for (const [sx, sy] of record.coords) {
                    if (sx === nx && sy === ny) return false;
                }
            }
        }
        return true;
    }

    // placeShip: expects Ship instance
    placeShip(x, y, orientation, ship) {
        if (!(ship instanceof Ship)) throw new Error("ship must be Ship");
        if (!this.canPlaceShip(x, y, orientation, ship.length)) {
            throw new Error("Cannot place ship here");
        }
        const coords = [];
        for (let i = 0; i < ship.length; i++) {
            const nx = x + (orientation === "H" ? i : 0);
            const ny = y + (orientation === "V" ? i : 0);
            coords.push([nx, ny]);

            this.grid[nx][ny].hasShip = true;
            this.grid[nx][ny].ship = ship;
        }

        this.ships.push({
            ship,
            coords
        });
    }
    // receiveAttack returns { result: 'miss'|'hit'|'sunk', shipLength?: number }
    receiveAttack(x, y) {
        if (!Number.isInteger(x) || !Number.isInteger(y) || !this._inBounds(x, y)) {
            throw new Error("Invalid attack coordinates");
        }
        const key = `${x},${y}`;
        if (this.attacked.has(key)) {
            return {
                result: "already"
            };
        }
        this.attacked.add(key);

        /**
         *const cell = this.grid[x][y];
            if (cell.hasShip && cell.ship) {
                cell.hit = true; // 🔹 визуально отмечаем попадание
                cell.ship.hit();

                if (cell.ship.isSunk()) {
                    return {
                        result: "sunk",
                        shipLength: cell.ship.length
                    };
                }
                return {
                    result: "hit"
                };
            } else {
                cell.missed = true; // 🔹 визуально отмечаем промах
                return {
                    result: "miss"
                };
            } 
         */

        // find if any ship occupies this cell
        for (const record of this.ships) {
            for (let idx = 0; idx < record.coords.length; idx++) {
                const [sx, sy] = record.coords[idx];
                if (sx === x && sy === y) {
                    // hit ship at index idx
                    const cell = this.grid[x][y];
                    cell.hit = true;
                    cell.ship = record.ship;
                    record.ship.hitAt(idx);
                    if (record.ship.isSunk()) {
                        return {
                            result: "sunk",
                            shipLength: record.ship.length
                        };
                    }
                    return {
                        result: "hit"
                    };
                }
            }
        }
        // if miss
        const cell = this.grid[x][y];
        cell.missed = true;
        return {
            result: "miss"
        };

    }

    allShipsSunk() {
        return this.ships.length > 0 && this.ships.every(r => r.ship.isSunk());
    }
}

module.exports = {
    GameBoard
};
// src/gameboard.js
class Gameboard {
    constructor(size = 10) {
        if (!Number.isInteger(size) || size <= 0) throw new Error("Invalis board size");
        this.size = sise;
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
            throw new Error("This coordinate was already attacked");
        }
        this.attacked.add(key);

        // find if any ship occupies this cell
        for (const record of this.ships) {
            for (let idx = 0; idx < record.coords.length; idx++) {
                const [sx, sy] = record.coords[idx];
                if (sx === x && sy === y) {
                    // hit ship at index idx
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
        return {
            result: "miss"
        };
    }

    allShipsSunk() {
        return this.ships.length > 0 && this.ships.every(r => r.ship.isSunk());
    }
}

module.exports = {
    Gameboard
};
// src/gameboard.js
export default class Gameboard {
    constructor(size = 10) {
        if (!Number.isInteger(size) || size <= 0) throw new Error("Invalis board size");
        this.size = sise;
        // track ships: each entry { ships, coords: [ [x,y], ... ]}
        this.ships = [];
        // attacked set to avoid double shots (stringified coords)
        this.attacked = new Set();

        // helper: check coordinate in board
        _inBounds(x, y)
    }
}
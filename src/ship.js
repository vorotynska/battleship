// src/ship.js

export default class Ship {
    constructor(length) {
        if (!Number.isInteger(length) || length <= 0) {
            throw new Error("Invalid ship length");
        }
        this.length = length;
        this.hits = new Array(length).fill(false);
    }

    // register hit at ship-local index (0..length-1)
    hitAt(index) {
        if (index < 0 || index >= this.length) throw new Error("Invalid hit index");
        this.hits[index] = true;
    }

    isSunk() {
        return this.hits.every(Boolean);
    }
}
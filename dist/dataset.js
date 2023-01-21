"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dataset {
    constructor(id) {
        this.label = "";
        this.data = [];
        this.id = id;
    }
    get() {
        return this;
    }
    addPoint(value) {
        this.data.push(value);
    }
    setColor(color) {
        this.color = color;
    }
}
exports.default = Dataset;

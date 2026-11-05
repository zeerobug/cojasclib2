"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataPoint {
    constructor(x, y, z, options = {}) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.options = options;
    }
}
exports.default = DataPoint;

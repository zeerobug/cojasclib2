"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dataset {
    constructor(id, label = '', color = '', options = {}) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.options = options;
        this.data = [];
    }
    get() {
        return this;
    }
    addPoint(point) {
        this.data.push(Object.assign(Object.assign({}, point), { options: point.options || {} }));
        return this;
    }
    addPoints(points) {
        points.forEach((point) => this.addPoint(point));
        return this;
    }
    clear() {
        this.data = [];
        return this;
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setLabel(label) {
        this.label = label;
        return this;
    }
    setOptions(options) {
        this.options = Object.assign(Object.assign({}, this.options), options);
        return this;
    }
}
exports.default = Dataset;

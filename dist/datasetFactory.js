"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetFactory = void 0;
const dataset_1 = require("./dataset");
const colorUtils_1 = require("./colors/colorUtils");
class DatasetFactory {
    constructor(options = {}) {
        this.datasets = {};
        this.defaultScheme = 'Tableau20';
        this.datasetCount = 0;
        /** Number of colors handed out automatically; never decreases, so deleting a dataset doesn't cause color reuse. */
        this.colorIndex = 0;
        this.options = options;
        this.setScheme(options.scheme || this.defaultScheme);
    }
    addDataset(id, label = '', color = '', options = {}) {
        if (!this.datasets[id]) {
            if (!color) {
                color = this.getColor();
                this.colorIndex++;
            }
            this.datasets[id] = new dataset_1.default(id, label, color, options);
            this.datasetCount++;
        }
        return this.datasets[id];
    }
    getDataset(id) {
        return this.datasets[id];
    }
    /** Datasets in insertion order (numeric-looking ids are sorted first, as with any JS object). */
    getDatasets() {
        return Object.keys(this.datasets).map((key) => this.datasets[key]);
    }
    delDataset(id) {
        if (!this.datasets[id]) {
            return false;
        }
        delete this.datasets[id];
        this.datasetCount--;
        return true;
    }
    get() {
        return this;
    }
    setScheme(scheme) {
        this.colors = colorUtils_1.default.scheme(scheme);
        this.scheme = scheme;
        return this;
    }
    /**
     * Returns the color at `index` in the active scheme, wrapping around when the scheme runs out.
     * Without an index, returns the color the next auto-colored dataset will get.
     */
    getColor(index = this.colorIndex) {
        return this.colors[index % this.colors.length];
    }
}
exports.DatasetFactory = DatasetFactory;

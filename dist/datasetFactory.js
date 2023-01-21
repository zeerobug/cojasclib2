"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetFactory = void 0;
const dataset_1 = require("./dataset");
class DatasetFactory {
    constructor() {
        this.datasets = {};
    }
    addDataset(id) {
        if (!this.datasets[id])
            this.datasets[id] = new dataset_1.default(id);
        return this.datasets[id];
    }
    returnDatasets() {
        let res = [];
        for (const key in this.datasets) {
            let obj = this.datasets[key].get();
            res.push(obj);
        }
        return res;
    }
}
exports.DatasetFactory = DatasetFactory;

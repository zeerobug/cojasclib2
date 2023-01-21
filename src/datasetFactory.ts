import Dataset from "./dataset";

export class DatasetFactory {
  datasets: Object;

  constructor() {
    this.datasets = {};
  }
  addDataset(id) {
    if (!this.datasets[id]) this.datasets[id] = new Dataset(id);
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

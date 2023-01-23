import Dataset from './dataset';
import colorUtils from './colors/colorUtils';

import { Datasets, DataSetFactoryOptions } from './types';

export class DatasetFactory {
  datasets: Datasets = {};
  options: DataSetFactoryOptions;
  defautScheme: string = 'Tableau20';
  colors: Array<string>;
  datasetCount: number = 0;

  constructor(options?: DataSetFactoryOptions) {
    this.options = options;
    this.setScheme(this.defautScheme);
  }

  addDataset(id, label = '', color = '', options = {}) {
    if (!this.datasets[id]) {
      color = color ? color : this.getColor();
      this.datasets[id] = new Dataset(id, label, color, options);
      this.datasetCount++;
    }
    return this.datasets[id];
  }

  delDataset(id) {
    delete this.datasets[id];
    this.datasetCount--;
  }

  get() {
    return this;
  }

  setScheme(scheme) {
    this.colors = colorUtils.scheme(scheme);
  }

  getColor() {
    return this.colors[this.datasetCount];
  }
}

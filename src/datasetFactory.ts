import Dataset from './dataset';
import colorUtils from './colors/colorUtils';

import { DataSetFactoryOptions, DataSetOptions, DatasetId, DatasetFactoryType } from './types';

export class DatasetFactory implements DatasetFactoryType {
  datasets: { [key: string]: Dataset } = {};
  options: DataSetFactoryOptions;
  defaultScheme: string = 'Tableau20';
  scheme: string;
  colors: string[];
  datasetCount: number = 0;
  /** Number of colors handed out automatically; never decreases, so deleting a dataset doesn't cause color reuse. */
  private colorIndex: number = 0;

  constructor(options: DataSetFactoryOptions = {}) {
    this.options = options;
    this.setScheme(options.scheme || this.defaultScheme);
  }

  addDataset(id: DatasetId, label = '', color = '', options: DataSetOptions = {}): Dataset {
    if (!this.datasets[id]) {
      if (!color) {
        color = this.getColor();
        this.colorIndex++;
      }
      this.datasets[id] = new Dataset(id, label, color, options);
      this.datasetCount++;
    }
    return this.datasets[id];
  }

  getDataset(id: DatasetId): Dataset | undefined {
    return this.datasets[id];
  }

  /** Datasets in insertion order (numeric-looking ids are sorted first, as with any JS object). */
  getDatasets(): Dataset[] {
    return Object.keys(this.datasets).map((key) => this.datasets[key]);
  }

  delDataset(id: DatasetId): boolean {
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

  setScheme(scheme: string) {
    this.colors = colorUtils.scheme(scheme);
    this.scheme = scheme;
    return this;
  }

  /**
   * Returns the color at `index` in the active scheme, wrapping around when the scheme runs out.
   * Without an index, returns the color the next auto-colored dataset will get.
   */
  getColor(index: number = this.colorIndex): string {
    return this.colors[index % this.colors.length];
  }
}

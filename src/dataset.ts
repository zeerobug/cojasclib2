import { DataPointType, DataSetOptions } from './types';
import DataPoint from './dataPoint';

export default class Dataset {
  id: String | number;
  label?: String;
  data?: Array<DataPointType>;
  color?: String;
  options?: DataSetOptions;

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

  addPoint(point: DataPointType) {
    this.data.push(point);
  }

  setColor(color) {
    this.color = color;
  }
}

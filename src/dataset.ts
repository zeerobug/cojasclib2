import { DataPointType, DataSetOptions, DatasetId, DatasetType } from './types';

export default class Dataset implements DatasetType {
  id: DatasetId;
  label: string;
  data: DataPointType[];
  color: string;
  options: DataSetOptions;

  constructor(id: DatasetId, label = '', color = '', options: DataSetOptions = {}) {
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
    this.data.push({ ...point, options: point.options || {} });
    return this;
  }

  addPoints(points: DataPointType[]) {
    points.forEach((point) => this.addPoint(point));
    return this;
  }

  clear() {
    this.data = [];
    return this;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  setLabel(label: string) {
    this.label = label;
    return this;
  }

  setOptions(options: DataSetOptions) {
    this.options = { ...this.options, ...options };
    return this;
  }
}

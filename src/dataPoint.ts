import { DataPointType, DataPointOptions } from './types';

export default class DataPoint {
  x: Number;
  y?: Number;
  z?: Number;
  options: DataPointOptions;

  constructor(x, y, z, options) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.options = options;
  }
}

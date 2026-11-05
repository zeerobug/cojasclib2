import { DataPointType, DataPointOptions, XValue } from './types';
export default class DataPoint implements DataPointType {
    x: XValue;
    y?: number;
    z?: number;
    options: DataPointOptions;
    constructor(x: XValue, y?: number, z?: number, options?: DataPointOptions);
}

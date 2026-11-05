import { DataPointType, DataSetOptions, DatasetId, DatasetType } from './types';
export default class Dataset implements DatasetType {
    id: DatasetId;
    label: string;
    data: DataPointType[];
    color: string;
    options: DataSetOptions;
    constructor(id: DatasetId, label?: string, color?: string, options?: DataSetOptions);
    get(): this;
    addPoint(point: DataPointType): this;
    addPoints(points: DataPointType[]): this;
    clear(): this;
    setColor(color: string): this;
    setLabel(label: string): this;
    setOptions(options: DataSetOptions): this;
}

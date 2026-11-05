import Dataset from './dataset';
import { DataSetFactoryOptions, DataSetOptions, DatasetId, DatasetFactoryType } from './types';
export declare class DatasetFactory implements DatasetFactoryType {
    datasets: {
        [key: string]: Dataset;
    };
    options: DataSetFactoryOptions;
    defaultScheme: string;
    scheme: string;
    colors: string[];
    datasetCount: number;
    /** Number of colors handed out automatically; never decreases, so deleting a dataset doesn't cause color reuse. */
    private colorIndex;
    constructor(options?: DataSetFactoryOptions);
    addDataset(id: DatasetId, label?: string, color?: string, options?: DataSetOptions): Dataset;
    getDataset(id: DatasetId): Dataset | undefined;
    /** Datasets in insertion order (numeric-looking ids are sorted first, as with any JS object). */
    getDatasets(): Dataset[];
    delDataset(id: DatasetId): boolean;
    get(): this;
    setScheme(scheme: string): this;
    /**
     * Returns the color at `index` in the active scheme, wrapping around when the scheme runs out.
     * Without an index, returns the color the next auto-colored dataset will get.
     */
    getColor(index?: number): string;
}

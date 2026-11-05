export type DataPointOptions = { [key: string]: any };

/** x can be numeric (linear scales) or a string (category/time labels). */
export type XValue = number | string;

export interface DataPointType {
  x: XValue;
  y?: number;
  z?: number;
  options?: DataPointOptions;
}

export type DataSetOptions = { [key: string]: any };

export type DatasetId = string | number;

export interface DatasetType {
  id: DatasetId;
  label?: string;
  data?: DataPointType[];
  color?: string;
  options?: DataSetOptions;
}

export type Datasets = { [key: string]: DatasetType };

export type DataSetFactoryOptions = {
  /** Color scheme used for automatic dataset colors. Defaults to `Tableau20`. */
  scheme?: string;
  [key: string]: any;
};

export interface DatasetFactoryType {
  datasets: Datasets;
  datasetCount: number;
  options: DataSetFactoryOptions;
  getDatasets(): DatasetType[];
  getColor(index?: number): string;
}

export type DataPointOptions = { [key: string]: any };

export interface DataPointType {
  x: Number;
  y?: Number;
  z?: Number;
  options: DataPointOptions;
}
export type DataSetOptions = { [key: string]: any };

export type DatasetType = {
  id: String | number;
  label?: String;
  data?: Array<DataPointType>;
  color?: String;
  options?: DataSetOptions;
};

export type Datasets = { [key: string]: DatasetType };

export type DataSetFactoryOptions = { [key: string]: any };

export type DatasetFactoryType = {
  datasets: { id: Datasets };
  options: DataSetFactoryOptions;
};

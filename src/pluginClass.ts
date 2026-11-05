import { DatasetFactoryType } from './types';

export interface PluginInterface<TData, TConfig> {
  /** Converts the common data model into the target library's data format. */
  transformer(): TData;
  /** Returns the complete configuration object for the target library. */
  renderer(): TConfig;
}

export default abstract class PluginClass<TData = any, TConfig = any> implements PluginInterface<TData, TConfig> {
  datasetFactory: DatasetFactoryType;

  constructor(datasetFactory: DatasetFactoryType) {
    this.datasetFactory = datasetFactory;
  }

  abstract transformer(): TData;

  abstract renderer(): TConfig;
}

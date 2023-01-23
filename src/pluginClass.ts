import { DatasetFactoryType } from './types';

interface pluginInterface {
  transformer(): void;
  renderer(): Object;
}

export default class PluginClass implements pluginInterface {
  datasetFactory: DatasetFactoryType;
  constructor(datasetFactory) {
    this.datasetFactory = datasetFactory;
  }

  transformer() {}

  renderer() {
    return {};
  }
}

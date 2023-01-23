import { DatasetFactory } from '../src/datasetFactory';
import chartjs from '../plugins/chartjs.ts';

describe('Dataset factory', () => {
  let datasetfactory, dataset;
  beforeAll(() => {
    datasetfactory = new DatasetFactory();
    dataset = datasetfactory.addDataset(1);
  });
  it('Should return an object as chart', async () => {
    datasetfactory.addDataset(23);
    datasetfactory.addDataset(23);
    let ret = datasetfactory.get();
    expect(Object.keys(ret.datasets).length).toBe(2);
  });
});

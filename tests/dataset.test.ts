import { DatasetFactory } from './../src/datasetFactory';

describe('Dataset factory', () => {
  let datasetfactory, dataset;
  beforeAll(() => {
    datasetfactory = new DatasetFactory();
    dataset = datasetfactory.addDataset(1);
  });
  it('Should create two datasets and not three', async () => {
    datasetfactory.addDataset(23);
    datasetfactory.addDataset(23);
    let ret = datasetfactory.get();
    expect(Object.keys(ret.datasets).length).toBe(2);
  });
  it('Should add 2 points to a dataset', async () => {
    dataset.addPoint({ x: 2 });
    dataset.addPoint({ x: 4 });
    let ret = datasetfactory.get();
    expect(ret.datasets[1].data.length).toBe(2);
  });
  it('Should set a color even if none is given to a dataset', async () => {
    let ret = datasetfactory.get();
    expect(ret.datasets[1].color).toMatch(/^#.*/);
  });
  it('Should keep a color even if given to a dataset', async () => {
    datasetfactory.addDataset(2, 'Maurice', '#fff');
    let ret = datasetfactory.get();
    expect(ret.datasets[2].color).toBe('#fff');
  });
  it('Should delete a dataset', async () => {
    datasetfactory.addDataset(2, 'Maurice', '#fff');
    let count = datasetfactory.datasetCount;
    datasetfactory.delDataset(2);
    let ret = datasetfactory.get();
    expect(ret.datasets[2]).toBeUndefined();
    expect(ret.datasetCount).toBe(count - 1);
  });
});

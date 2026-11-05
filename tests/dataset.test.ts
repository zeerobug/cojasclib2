import { DatasetFactory } from './../src/datasetFactory';
import colorUtils from '../src/colors/colorUtils';

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

describe('Colors', () => {
  it('Should wrap around when there are more datasets than scheme colors', () => {
    const factory = new DatasetFactory({ scheme: 'Tableau10' });
    for (let i = 0; i < 11; i++) {
      factory.addDataset(i);
    }
    expect(factory.datasets[10].color).toBe(factory.datasets[0].color);
  });
  it('Should not reuse a color after a dataset is deleted', () => {
    const factory = new DatasetFactory();
    factory.addDataset('a');
    factory.addDataset('b');
    factory.delDataset('a');
    const c = factory.addDataset('c');
    expect(c.color).not.toBe(factory.datasets.b.color);
    expect(c.color).toBe(factory.getColor(2));
  });
  it('Should ignore deleting an unknown dataset', () => {
    const factory = new DatasetFactory();
    factory.addDataset('a');
    expect(factory.delDataset('nope')).toBe(false);
    expect(factory.datasetCount).toBe(1);
  });
  it('Should accept ColorBrewer and Office schemes', () => {
    const factory = new DatasetFactory();
    factory.setScheme('YlGn3');
    expect(factory.addDataset('a').color).toBe('#f7fcb9');
    factory.setScheme('Office6');
    expect(factory.colors.length).toBe(6);
  });
  it('Should throw on an unknown scheme', () => {
    expect(() => new DatasetFactory({ scheme: 'Nope' })).toThrow('Unknown color scheme "Nope"');
  });
  it('Should list every bundled scheme', () => {
    expect(colorUtils.list().length).toBe(477);
  });
  it('Should convert hex colors to rgba', () => {
    expect(colorUtils.alpha('#fff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
    expect(colorUtils.alpha('red', 0.5)).toBe('red');
  });
});

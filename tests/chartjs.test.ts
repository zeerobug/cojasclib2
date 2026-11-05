import { DatasetFactory } from '../src/datasetFactory';
import Chartjs from '../src/plugins/chartjs';

const buildFactory = () => {
  const factory = new DatasetFactory({ scheme: 'Tableau10' });
  factory.addDataset('sales', 'Sales').addPoints([
    { x: 2, y: 135 },
    { x: 1, y: 120 },
  ]);
  factory.addDataset('costs', 'Costs', '#ff0000', { borderDash: [5, 5] }).addPoints([
    { x: 1, y: 80 },
    { x: 3, y: 90, options: { color: '#00ff00', note: 'peak' } },
  ]);
  return factory;
};

describe('Chart.js plugin', () => {
  it('Should render a line chart config with sorted labels', () => {
    const config = new Chartjs(buildFactory()).renderer();
    expect(config.type).toBe('line');
    expect(config.options).toEqual({});
    expect(config.data.labels).toEqual([1, 2, 3]);
    expect(config.data.datasets).toHaveLength(2);

    const [sales, costs] = config.data.datasets;
    expect(sales.label).toBe('Sales');
    expect(sales.data).toEqual([
      { x: 2, y: 135 },
      { x: 1, y: 120 },
    ]);
    expect(sales.borderColor).toBe('#4E79A7');
    expect(sales.backgroundColor).toBe('rgba(78, 121, 167, 0.2)');

    expect(costs.borderColor).toBe('#ff0000');
    expect(costs.borderDash).toEqual([5, 5]);
    expect(costs.pointBackgroundColor).toEqual(['#ff0000', '#00ff00']);
    expect(costs.data[1]).toEqual({ x: 3, y: 90, note: 'peak' });
  });

  it('Should pass Chart.js options through and let dataset options override colors', () => {
    const factory = new DatasetFactory();
    factory.addDataset('a', 'A', '#123456', { backgroundColor: 'transparent' }).addPoint({ x: 1, y: 1 });
    const config = new Chartjs(factory, { type: 'bar', options: { responsive: false } }).renderer();
    expect(config.options).toEqual({ responsive: false });
    expect(config.data.datasets[0].backgroundColor).toBe('transparent');
    expect(config.data.datasets[0].borderColor).toBe('#123456');
  });

  it('Should not add labels to scatter charts', () => {
    const data = new Chartjs(buildFactory(), { type: 'scatter' }).transformer();
    expect(data.labels).toBeUndefined();
    expect(data.datasets[1].backgroundColor).toEqual(['#ff0000', '#00ff00']);
  });

  it('Should map z to the bubble radius', () => {
    const factory = new DatasetFactory();
    factory.addDataset('b').addPoints([
      { x: 1, y: 2, z: 10 },
      { x: 3, y: 4 },
    ]);
    const data = new Chartjs(factory, { type: 'bubble' }).transformer();
    expect(data.datasets[0].data).toEqual([
      { x: 1, y: 2, r: 10 },
      { x: 3, y: 4, r: 3 },
    ]);
  });

  it('Should build label-indexed data with one color per slice for pie charts', () => {
    const factory = new DatasetFactory({ scheme: 'Tableau10' });
    factory.addDataset('share', 'Market share').addPoints([
      { x: 'Apples', y: 10 },
      { x: 'Pears', y: 20, options: { color: '#000' } },
      { x: 'Plums', y: 30 },
    ]);
    const data = new Chartjs(factory, { type: 'pie' }).transformer();
    expect(data.labels).toEqual(['Apples', 'Pears', 'Plums']);
    expect(data.datasets[0].data).toEqual([10, 20, 30]);
    expect(data.datasets[0].backgroundColor).toEqual(['#4E79A7', '#000', '#E15759']);
  });

  it('Should align radar datasets on shared labels and fill gaps with null', () => {
    const factory = new DatasetFactory();
    factory.addDataset('a').addPoints([
      { x: 'speed', y: 1 },
      { x: 'power', y: 2 },
    ]);
    factory.addDataset('b').addPoint({ x: 'power', y: 5 });
    const data = new Chartjs(factory, { type: 'radar' }).transformer();
    expect(data.labels).toEqual(['speed', 'power']);
    expect(data.datasets[0].data).toEqual([1, 2]);
    expect(data.datasets[1].data).toEqual([null, 5]);
  });

  it('Should hand the config to a Chart constructor in render()', () => {
    const FakeChart = jest.fn();
    const plugin = new Chartjs(buildFactory(), { type: 'bar' });
    const chart = plugin.render(FakeChart as any, 'canvas');
    expect(FakeChart).toHaveBeenCalledWith('canvas', plugin.renderer());
    expect(chart).toBeInstanceOf(FakeChart);
  });
});

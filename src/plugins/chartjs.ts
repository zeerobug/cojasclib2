import PluginClass from '../pluginClass';
import colorUtils from '../colors/colorUtils';
import { DataPointType, DatasetFactoryType, DatasetType, XValue } from '../types';

export type ChartjsType = 'line' | 'bar' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';

export interface ChartjsPluginOptions {
  /** Chart.js chart type. Defaults to `line`. */
  type?: ChartjsType;
  /** Passed through untouched as the Chart.js `options` object (scales, plugins, responsive, ...). */
  options?: { [key: string]: any };
  /** Opacity used for area fills (line/radar backgrounds). Defaults to 0.2. */
  fillOpacity?: number;
}

export interface ChartjsDataset {
  label: string;
  data: any[];
  [key: string]: any;
}

export interface ChartjsData {
  labels?: XValue[];
  datasets: ChartjsDataset[];
}

export interface ChartjsConfig {
  type: ChartjsType;
  data: ChartjsData;
  options: { [key: string]: any };
}

/** Chart types whose data is one value per label rather than {x, y} points. */
const LABEL_INDEXED: ChartjsType[] = ['pie', 'doughnut', 'polarArea', 'radar'];
/** Chart types where every point (slice) gets its own color from the scheme. */
const PER_SLICE_COLORS: ChartjsType[] = ['pie', 'doughnut', 'polarArea'];
/** Chart types using a category x axis, which need a `labels` array. */
const CATEGORY_AXIS: ChartjsType[] = ['line', 'bar'];

const DEFAULT_BUBBLE_RADIUS = 3;

/**
 * Turns a DatasetFactory into a Chart.js (v3/v4) configuration.
 *
 * Mapping:
 * - `dataset.label` -> `label`, `dataset.color` -> `borderColor` / `backgroundColor`
 * - `dataset.options` are spread onto the Chart.js dataset last, so they can override anything
 * - point `x`/`y` -> `{x, y}`; for `bubble`, `z` -> `r`
 * - `pie`/`doughnut`/`polarArea`/`radar`: x values become `labels`, y values the data
 * - `point.options.color` overrides the color of that single point/bar/slice; other point
 *   options are kept on the data object (available as `context.raw` in Chart.js callbacks)
 */
export default class Chartjs extends PluginClass<ChartjsData, ChartjsConfig> {
  type: ChartjsType;
  options: ChartjsPluginOptions;

  constructor(datasetFactory: DatasetFactoryType, options: ChartjsPluginOptions = {}) {
    super(datasetFactory);
    this.options = options;
    this.type = options.type || 'line';
  }

  setType(type: ChartjsType) {
    this.type = type;
    return this;
  }

  transformer(): ChartjsData {
    const datasets = this.datasetFactory.getDatasets();
    const labelIndexed = LABEL_INDEXED.indexOf(this.type) !== -1;
    const needsLabels = labelIndexed || CATEGORY_AXIS.indexOf(this.type) !== -1;
    const labels = needsLabels ? this.collectLabels(datasets) : undefined;

    const result: ChartjsData = {
      datasets: datasets.map((dataset) =>
        labelIndexed ? this.labelIndexedDataset(dataset, labels) : this.pointDataset(dataset),
      ),
    };
    if (labels) {
      result.labels = labels;
    }
    return result;
  }

  renderer(): ChartjsConfig {
    return {
      type: this.type,
      data: this.transformer(),
      options: this.options.options || {},
    };
  }

  /**
   * Convenience wrapper: `plugin.render(Chart, canvas)` is `new Chart(canvas, plugin.renderer())`.
   * The Chart constructor is passed in so this library doesn't depend on chart.js.
   */
  render<T>(ChartConstructor: new (item: any, config: any) => T, item: any): T {
    return new ChartConstructor(item, this.renderer());
  }

  /** Unique x values across all datasets, in first-seen order (sorted if they're all numbers). */
  private collectLabels(datasets: DatasetType[]): XValue[] {
    const labels: XValue[] = [];
    datasets.forEach((dataset) =>
      (dataset.data || []).forEach((point) => {
        if (labels.indexOf(point.x) === -1) {
          labels.push(point.x);
        }
      }),
    );
    if (labels.every((label) => typeof label === 'number')) {
      (labels as number[]).sort((a, b) => a - b);
    }
    return labels;
  }

  private pointDataset(dataset: DatasetType): ChartjsDataset {
    const points = dataset.data || [];
    const color = dataset.color;
    const isLine = this.type === 'line' || this.type === 'radar';
    const pointColors = this.pointColors(points, color);

    const data = points.map((point) => {
      const { color: _ignored, ...extra } = point.options || {};
      const value: { [key: string]: any } = { ...extra, x: point.x, y: point.y };
      if (this.type === 'bubble') {
        value.r = point.z !== undefined ? point.z : DEFAULT_BUBBLE_RADIUS;
      }
      return value;
    });

    const colors: { [key: string]: any } = isLine
      ? {
          borderColor: color,
          backgroundColor: colorUtils.alpha(color, this.fillOpacity()),
          pointBackgroundColor: pointColors || color,
          pointBorderColor: pointColors || color,
        }
      : {
          borderColor: pointColors || color,
          backgroundColor: pointColors || color,
        };

    return { label: dataset.label || '', data, ...colors, ...dataset.options };
  }

  private labelIndexedDataset(dataset: DatasetType, labels: XValue[]): ChartjsDataset {
    const byX: { [key: string]: DataPointType } = {};
    (dataset.data || []).forEach((point) => (byX[String(point.x)] = point));
    const pointAt = (label: XValue) => byX[String(label)];

    const data = labels.map((label) => {
      const point = pointAt(label);
      return point && point.y !== undefined ? point.y : null;
    });

    let colors: { [key: string]: any };
    if (PER_SLICE_COLORS.indexOf(this.type) !== -1) {
      colors = {
        backgroundColor: labels.map((label, i) => {
          const point = pointAt(label);
          return (point && point.options && point.options.color) || this.datasetFactory.getColor(i);
        }),
      };
    } else {
      // radar
      const pointColors = labels.map((label) => {
        const point = pointAt(label);
        return (point && point.options && point.options.color) || dataset.color;
      });
      colors = {
        borderColor: dataset.color,
        backgroundColor: colorUtils.alpha(dataset.color, this.fillOpacity()),
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
      };
    }

    return { label: dataset.label || '', data, ...colors, ...dataset.options };
  }

  /** Per-point colors when at least one point overrides its color, otherwise undefined. */
  private pointColors(points: DataPointType[], fallback: string): string[] | undefined {
    if (!points.some((point) => point.options && point.options.color)) {
      return undefined;
    }
    return points.map((point) => (point.options && point.options.color) || fallback);
  }

  private fillOpacity(): number {
    return this.options.fillOpacity !== undefined ? this.options.fillOpacity : 0.2;
  }
}

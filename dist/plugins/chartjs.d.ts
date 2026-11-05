import PluginClass from '../pluginClass';
import { DatasetFactoryType, XValue } from '../types';
export type ChartjsType = 'line' | 'bar' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
export interface ChartjsPluginOptions {
    /** Chart.js chart type. Defaults to `line`. */
    type?: ChartjsType;
    /** Passed through untouched as the Chart.js `options` object (scales, plugins, responsive, ...). */
    options?: {
        [key: string]: any;
    };
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
    options: {
        [key: string]: any;
    };
}
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
    constructor(datasetFactory: DatasetFactoryType, options?: ChartjsPluginOptions);
    setType(type: ChartjsType): this;
    transformer(): ChartjsData;
    renderer(): ChartjsConfig;
    /**
     * Convenience wrapper: `plugin.render(Chart, canvas)` is `new Chart(canvas, plugin.renderer())`.
     * The Chart constructor is passed in so this library doesn't depend on chart.js.
     */
    render<T>(ChartConstructor: new (item: any, config: any) => T, item: any): T;
    /** Unique x values across all datasets, in first-seen order (sorted if they're all numbers). */
    private collectLabels;
    private pointDataset;
    private labelIndexedDataset;
    /** Per-point colors when at least one point overrides its color, otherwise undefined. */
    private pointColors;
    private fillOpacity;
}

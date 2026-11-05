"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginClass_1 = require("../pluginClass");
const colorUtils_1 = require("../colors/colorUtils");
/** Chart types whose data is one value per label rather than {x, y} points. */
const LABEL_INDEXED = ['pie', 'doughnut', 'polarArea', 'radar'];
/** Chart types where every point (slice) gets its own color from the scheme. */
const PER_SLICE_COLORS = ['pie', 'doughnut', 'polarArea'];
/** Chart types using a category x axis, which need a `labels` array. */
const CATEGORY_AXIS = ['line', 'bar'];
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
class Chartjs extends pluginClass_1.default {
    constructor(datasetFactory, options = {}) {
        super(datasetFactory);
        this.options = options;
        this.type = options.type || 'line';
    }
    setType(type) {
        this.type = type;
        return this;
    }
    transformer() {
        const datasets = this.datasetFactory.getDatasets();
        const labelIndexed = LABEL_INDEXED.indexOf(this.type) !== -1;
        const needsLabels = labelIndexed || CATEGORY_AXIS.indexOf(this.type) !== -1;
        const labels = needsLabels ? this.collectLabels(datasets) : undefined;
        const result = {
            datasets: datasets.map((dataset) => labelIndexed ? this.labelIndexedDataset(dataset, labels) : this.pointDataset(dataset)),
        };
        if (labels) {
            result.labels = labels;
        }
        return result;
    }
    renderer() {
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
    render(ChartConstructor, item) {
        return new ChartConstructor(item, this.renderer());
    }
    /** Unique x values across all datasets, in first-seen order (sorted if they're all numbers). */
    collectLabels(datasets) {
        const labels = [];
        datasets.forEach((dataset) => (dataset.data || []).forEach((point) => {
            if (labels.indexOf(point.x) === -1) {
                labels.push(point.x);
            }
        }));
        if (labels.every((label) => typeof label === 'number')) {
            labels.sort((a, b) => a - b);
        }
        return labels;
    }
    pointDataset(dataset) {
        const points = dataset.data || [];
        const color = dataset.color;
        const isLine = this.type === 'line' || this.type === 'radar';
        const pointColors = this.pointColors(points, color);
        const data = points.map((point) => {
            const _a = point.options || {}, { color: _ignored } = _a, extra = __rest(_a, ["color"]);
            const value = Object.assign(Object.assign({}, extra), { x: point.x, y: point.y });
            if (this.type === 'bubble') {
                value.r = point.z !== undefined ? point.z : DEFAULT_BUBBLE_RADIUS;
            }
            return value;
        });
        const colors = isLine
            ? {
                borderColor: color,
                backgroundColor: colorUtils_1.default.alpha(color, this.fillOpacity()),
                pointBackgroundColor: pointColors || color,
                pointBorderColor: pointColors || color,
            }
            : {
                borderColor: pointColors || color,
                backgroundColor: pointColors || color,
            };
        return Object.assign(Object.assign({ label: dataset.label || '', data }, colors), dataset.options);
    }
    labelIndexedDataset(dataset, labels) {
        const byX = {};
        (dataset.data || []).forEach((point) => (byX[String(point.x)] = point));
        const pointAt = (label) => byX[String(label)];
        const data = labels.map((label) => {
            const point = pointAt(label);
            return point && point.y !== undefined ? point.y : null;
        });
        let colors;
        if (PER_SLICE_COLORS.indexOf(this.type) !== -1) {
            colors = {
                backgroundColor: labels.map((label, i) => {
                    const point = pointAt(label);
                    return (point && point.options && point.options.color) || this.datasetFactory.getColor(i);
                }),
            };
        }
        else {
            // radar
            const pointColors = labels.map((label) => {
                const point = pointAt(label);
                return (point && point.options && point.options.color) || dataset.color;
            });
            colors = {
                borderColor: dataset.color,
                backgroundColor: colorUtils_1.default.alpha(dataset.color, this.fillOpacity()),
                pointBackgroundColor: pointColors,
                pointBorderColor: pointColors,
            };
        }
        return Object.assign(Object.assign({ label: dataset.label || '', data }, colors), dataset.options);
    }
    /** Per-point colors when at least one point overrides its color, otherwise undefined. */
    pointColors(points, fallback) {
        if (!points.some((point) => point.options && point.options.color)) {
            return undefined;
        }
        return points.map((point) => (point.options && point.options.color) || fallback);
    }
    fillOpacity() {
        return this.options.fillOpacity !== undefined ? this.options.fillOpacity : 0.2;
    }
}
exports.default = Chartjs;

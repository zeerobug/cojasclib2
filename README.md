# cojasclib2

**Common JavaScript Standard for charting libraries.**

cojasclib2 is a small TypeScript library that gives you one library-independent way to describe chart data (datasets, data points, colors), plus a plugin layer that turns that description into whatever a specific charting library expects (Chart.js first).

The idea: build your data once, with a single API, and render it with any supported charting library without rewriting your data-preparation code.

> **Status:** early development. The core data model (`DatasetFactory`, `Dataset`, `DataPoint`) and automatic color assignment work and are covered by tests. The Chart.js plugin is only a skeleton for now.

## Features

- **Dataset factory**: create, retrieve and delete datasets by id. Adding the same id twice won't create a duplicate.
- **Data points**: `x`, optional `y` and `z`, and free-form per-point `options`.
- **Automatic colors**: each new dataset gets the next color from the active color scheme (Tableau 20 by default), unless you pass one yourself.
- **Built-in color schemes**: Tableau, ColorBrewer and Office palettes are included under `src/colors/`.
- **Plugin architecture**: a base `PluginClass` with `transformer()` / `renderer()` hooks for adapting the common format to a specific charting library.

## Installation

The package isn't published on npm. Install it straight from GitHub:

```bash
npm install github:zeerobug/cojasclib2
# or
yarn add github:zeerobug/cojasclib2
```

To work on it locally:

```bash
git clone https://github.com/zeerobug/cojasclib2.git
cd cojasclib2
npm install
npm run build
```

## Usage

```ts
import { DatasetFactory } from 'cojasclib2';

const factory = new DatasetFactory();

// Color is picked automatically from the current scheme
const sales = factory.addDataset('sales', 'Monthly sales');
sales.addPoint({ x: 1, y: 120, options: {} });
sales.addPoint({ x: 2, y: 135, options: {} });

// Or set an explicit color and options
const costs = factory.addDataset('costs', 'Monthly costs', '#E15759', { dashed: true });
costs.addPoint({ x: 1, y: 80, options: {} });

// Switch to another palette for the datasets you add next
factory.setScheme('Tableau10');

// Remove a dataset
factory.delDataset('costs');

const result = factory.get();
console.log(result.datasets);     // { sales: Dataset { ... } }
console.log(result.datasetCount); // 1
```

## API

### `DatasetFactory`

| Member | Description |
| --- | --- |
| `new DatasetFactory(options?)` | Creates a factory. The default color scheme is `Tableau20`. |
| `addDataset(id, label = '', color = '', options = {})` | Creates a dataset with this `id` or returns the existing one. If you leave out `color`, the next color from the scheme is used. |
| `delDataset(id)` | Removes a dataset. |
| `setScheme(name)` | Changes the active color scheme (for example `Tableau10`, `Tableau20`, `ColorBlind10`). |
| `getColor()` | Returns the next color from the active scheme. |
| `get()` | Returns the factory, including `datasets` and `datasetCount`. |

### `Dataset`

| Member | Description |
| --- | --- |
| `id`, `label`, `color`, `options`, `data` | Dataset properties. `data` is an array of points. |
| `addPoint(point)` | Adds a point `{ x, y?, z?, options }`. |
| `setColor(color)` | Overrides the dataset color. |
| `get()` | Returns the dataset. |

### `DataPoint`

`new DataPoint(x, y, z, options)` is a simple container for one point. Plain objects with the same shape work too.

### Plugins

Rendering plugins extend `PluginClass`, which receives a `DatasetFactory` and exposes:

- `transformer()`: converts the common data model into the target library's format.
- `renderer()`: returns the configuration object for that library.

`src/plugins/chartjs.ts` is where the Chart.js adapter is being built.

## Project structure

```
src/
  index.ts            # Public exports
  datasetFactory.ts   # DatasetFactory
  dataset.ts          # Dataset
  dataPoint.ts        # DataPoint
  pluginClass.ts      # Base class for rendering plugins
  types.ts            # Shared TypeScript types
  colors/             # Color schemes (Tableau, Brewer, Office) and helpers
  plugins/chartjs.ts  # Chart.js plugin (work in progress)
tests/                # Jest tests
dist/                 # Compiled output
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm run dev` | Compiles in watch mode |
| `npm run t` | Runs the Jest test suite |

## Roadmap

- Finish the Chart.js plugin (`transformer` / `renderer`)
- Make every bundled color scheme selectable through `setScheme`, not only the Tableau palettes
- Add plugins for other charting libraries
- Publish to npm

## License

Licensed under the [Apache License 2.0](LICENSE).

Copyright 2023 Thomas Vié

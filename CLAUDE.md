# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

cojasclib2 ("Common JavaScript Standard for charting libraries") is a small TypeScript library: one library-independent data model for charts (datasets, points, colors) plus a plugin layer that converts that model into a specific charting library's config. Chart.js is the only plugin so far.

## Commands

```bash
pnpm install                      # node_modules is not checked in
pnpm run build                    # tsc -> dist/
pnpm run dev                      # tsc --watch
pnpm run t                        # all Jest tests (note: script is "t", not "test")
pnpm exec jest tests/dataset.test.ts   # single test file
pnpm exec jest -t "Should delete"      # single test by name
pnpm exec tslint -p .                  # lint (tslint:recommended + prettier config)
pnpm exec prettier --write src tests   # format: 120 cols, single quotes, trailing commas
```

Jest uses `ts-jest` (see `jest.config.ts`); tests live in `tests/` and import from `src/` directly, not `dist/`.

Environment notes:
- Node comes from nvm, which isn't loaded in non-interactive shells. Prefix commands with `export PATH=~/.nvm/versions/node/v26.13.0/bin:$PATH`; that install also provides `pnpm`.
- Dependencies are managed with pnpm 12 (`pnpm-lock.yaml`, store v11). Use `pnpm add` / `pnpm install`, not npm or yarn, so the lockfile and store stay consistent. Older pnpm versions (including corepack's) refuse to work with this `node_modules`.

## Architecture

- **`DatasetFactory`** (`src/datasetFactory.ts`) is the entry point. It owns a map of `Dataset`s keyed by id (`addDataset` is idempotent per id), a `datasetCount`, and the active color array. Auto colors come from a private `colorIndex` cursor that only increments, so deletions never cause color reuse; `getColor(i)` wraps modulo the scheme length.
- **`Dataset`** / **`DataPoint`** (`src/dataset.ts`, `src/dataPoint.ts`) are plain containers; `Dataset` mutators are chainable. Points are usually plain objects matching `DataPointType`; `addPoint` normalizes a missing `options` to `{}`. Shared shapes live in `src/types.ts`, and plugins depend on `DatasetFactoryType` from there rather than on the class.
- **Colors** (`src/colors/`): palette files export named arrays (vendored; they use `export var` and are the only tslint failures — leave them). `colorUtils` merges Brewer, Office and Tableau into one lookup (names are unique across files — keep it that way when adding palettes); unknown names throw.
- **Plugins**: abstract `PluginClass<TData, TConfig>` (`src/pluginClass.ts`) with `transformer()` (common model -> library data) and `renderer()` (full library config). `src/plugins/chartjs.ts` targets Chart.js v3/v4 without depending on `chart.js`: output types are defined locally, and `render(Chart, item)` takes the constructor as an argument. Chart types fall into two data shapes — `{x, y}` point objects (line/bar/scatter/bubble; line/bar also get a `labels` array) and label-indexed value arrays (pie/doughnut/polarArea/radar). `dataset.options` are spread last so users can override any generated property.
- `src/index.ts` re-exports everything public; add new modules there.

## Notes

- `dist/` is committed and only rebuilt manually — run `pnpm run build` after source changes that should ship (consumers install from GitHub and use `dist/` directly). Stale `package-lock.json` and `yarn.lock` are also committed; `pnpm-lock.yaml` is the one in use.
- The library has no runtime dependencies; keep build/test tooling in `devDependencies`.

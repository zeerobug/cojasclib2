# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

cojasclib2 ("Common JavaScript Standard for charting libraries") is a small TypeScript library: one library-independent data model for charts (datasets, points, colors) plus a plugin layer that converts that model into a specific charting library's config (Chart.js first). Early development; the Chart.js plugin is a skeleton.

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

- **`DatasetFactory`** (`src/datasetFactory.ts`) is the entry point and the only public export (`src/index.ts`). It owns a map of `Dataset`s keyed by id (`addDataset` is idempotent per id), a `datasetCount`, and the active color array. When no color is passed, `getColor()` picks `colors[datasetCount]`, so color assignment is tied to the count, not to a separate cursor.
- **`Dataset`** / **`DataPoint`** (`src/dataset.ts`, `src/dataPoint.ts`) are plain containers. Points are usually passed as plain objects matching `DataPointType`; shared shapes live in `src/types.ts`.
- **Colors** (`src/colors/`): palette files export named arrays (e.g. `Tableau20`, `YlGn3`). `colorUtils.scheme(name)` currently looks names up **only in the Tableau module**, so Brewer/Office palettes are imported but not selectable via `setScheme` yet.
- **Plugins**: `PluginClass` (`src/pluginClass.ts`) takes a `DatasetFactory` and exposes `transformer()` (common model -> library format) and `renderer()` (returns the library config object). Library adapters go in `src/plugins/` and extend it (`src/plugins/chartjs.ts`).

## Known pitfalls in the current code

- `src/index.ts` imports `"./datasetfactory"` (lowercase) while the file is `datasetFactory.ts` — works on macOS's case-insensitive FS, breaks on Linux/CI.
- `tests/chartjs.test.ts` imports the Chart.js plugin but its only test is a copy of a dataset test; the plugin itself is untested.
- `getColor()` returns `undefined` once `datasetCount` exceeds the palette length, and `delDataset` decrements the count even for unknown ids, which causes color reuse.
- `dist/` is committed and only rebuilt manually — run `npm run build` if a change should be reflected there. Stale `package-lock.json` and `yarn.lock` are also committed; `pnpm-lock.yaml` is the one in use.

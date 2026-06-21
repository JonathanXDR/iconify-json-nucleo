# iconify-json-nucleo

> [!NOTE]
> This is an unofficial, community project. It is not affiliated with, authored by, or endorsed by Nucleo. The icons are a paid product and all rights to them belong to [Nucleo](https://nucleoapp.com). This repository ships only tooling and contains no icon data.

## Features

- 🎨 **Iconify-native**: every family ships as [IconifyJSON](https://iconify.design/docs/types/iconify-json.html), the format every Iconify consumer understands.
- 🔑 **License-gated**: nothing licensed lives in this repo or in the published tarballs.
- 📦 **Grouped by family**: one prefix per family, with style and size in the icon name
- 🔗 **Direct dependencies**: the official Nucleo packages are real dependencies, not a scraped copy.
- ♻️ **Reproducible codegen**: renders the official Nucleo components to SVG and normalizes them with [`@iconify/tools`](https://iconify.design/docs/libraries/tools/).

## 🚀 Install

Set your `NUCLEO_LICENSE_KEY`, then install a family with your package manager.

```bash
export NUCLEO_LICENSE_KEY=your-license-key
npm install iconify-json-nucleo-core
```

For pnpm, Yarn, or Bun, use `pnpm add`, `yarn add`, or `bun add` instead. A postinstall renders the official Nucleo packages into `icons.json` and prints `iconify-json-nucleo-core: built 512 icons for "nucleo-core"`. Every package needs Node.js 18 or newer.

> [!IMPORTANT]
> Many package managers block a dependency's postinstall script by default. If yours does, `icons.json` is not generated and importing the package fails. Use the table below to allow this package to build, or generate the set yourself with the codegen command.

| Package manager                    | Runs by default    | Enable the build                                                                                                          |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| npm                                | Yes, until npm v12 | From v12 (expected July 2026), run `npm approve-scripts iconify-json-nucleo-core`                                         |
| pnpm 11                            | No                 | Add `iconify-json-nucleo-core: true` under `allowBuilds` in `pnpm-workspace.yaml`, or run `pnpm approve-builds`           |
| pnpm 10                            | No                 | Add `iconify-json-nucleo-core` to `pnpm.onlyBuiltDependencies` in `package.json`, or run `pnpm approve-builds`            |
| Yarn 4.14 and newer                | No                 | Add `dependenciesMeta.iconify-json-nucleo-core.built: true` to `package.json`                                             |
| Yarn Classic and Berry before 4.14 | Yes                | Nothing needed                                                                                                            |
| Bun                                | No                 | Add `iconify-json-nucleo-core` to `trustedDependencies` in `package.json`, or run `bun pm trust iconify-json-nucleo-core` |

To skip the postinstall, generate the set on demand:

```bash
npx iconify-json-nucleo-codegen build --base node_modules/iconify-json-nucleo-core
```

## 💻 Usage

Every package ships as both ESM and CommonJS with bundled TypeScript types, so no separate `@types` package is needed. Register a set once with any Iconify consumer.

```ts
// ESM
import { icons } from 'iconify-json-nucleo-core';
import { addCollection } from '@iconify/react';

addCollection(icons);
```

```js
// CommonJS
const { addCollection } = require('@iconify/react');
const icons = require('iconify-json-nucleo-core');

addCollection(icons);
```

Then render icons by their `prefix:name`.

```tsx
<Icon icon="nucleo-core:heart-outline-24" />
```

With [`@iconify/tailwind`](https://iconify.design/docs/usage/css/tailwind/) the JSON is read straight from `node_modules`.

```html
<span class="icon-[nucleo-core--heart-outline-24]"></span>
```

Build tools that need the raw set can read it directly from the `iconify-json-nucleo-core/icons.json` subpath export.

## 🔐 License key

The official Nucleo packages read `NUCLEO_LICENSE_KEY` from the environment in their preinstall and validate it against `nucleoapp.com` before any data is installed. This layer adds no license logic of its own. It simply depends on those packages, so a missing or invalid key fails the install upstream.

```bash
# Locally
export NUCLEO_LICENSE_KEY=your-license-key

# CI or Vercel
# Expose NUCLEO_LICENSE_KEY as an environment variable to the install step.
```

## 🎨 Icons

One published package per family, one Iconify prefix per package.

| Package                                                                                              | Prefix                | Styles and sizes              | Color      |
| ---------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------- | ---------- |
| [`iconify-json-nucleo-core`](https://www.npmjs.com/package/iconify-json-nucleo-core)                 | `nucleo-core`         | outline / fill, 24 / 32 / 48  | monochrome |
| [`iconify-json-nucleo-ui`](https://www.npmjs.com/package/iconify-json-nucleo-ui)                     | `nucleo-ui`           | outline / fill / duo, 12 / 18 | monochrome |
| [`iconify-json-nucleo-sharp`](https://www.npmjs.com/package/iconify-json-nucleo-sharp)               | `nucleo-sharp`        | 24                            | monochrome |
| [`iconify-json-nucleo-micro-bold`](https://www.npmjs.com/package/iconify-json-nucleo-micro-bold)     | `nucleo-micro-bold`   | 20                            | monochrome |
| [`iconify-json-nucleo-pixel`](https://www.npmjs.com/package/iconify-json-nucleo-pixel)               | `nucleo-pixel`        | 24                            | monochrome |
| [`iconify-json-nucleo-flags`](https://www.npmjs.com/package/iconify-json-nucleo-flags)               | `nucleo-flags`        | 32                            | multicolor |
| [`iconify-json-nucleo-glass`](https://www.npmjs.com/package/iconify-json-nucleo-glass)               | `nucleo-glass`        | 24                            | multicolor |
| [`iconify-json-nucleo-isometric`](https://www.npmjs.com/package/iconify-json-nucleo-isometric)       | `nucleo-isometric`    | 24                            | multicolor |
| [`iconify-json-nucleo-social-media`](https://www.npmjs.com/package/iconify-json-nucleo-social-media) | `nucleo-social-media` | 32                            | multicolor |
| [`iconify-json-nucleo-credit-cards`](https://www.npmjs.com/package/iconify-json-nucleo-credit-cards) | `nucleo-credit-cards` | 32                            | multicolor |
| [`iconify-json-nucleo-arcade`](https://www.npmjs.com/package/iconify-json-nucleo-arcade)             | `nucleo-arcade`       | 30                            | multicolor |

The families, prefixes, source packages, and color modes are declared once in [`manifest.ts`](./packages/codegen/src/manifest.ts). The styles and sizes above come from the upstream Nucleo packages.

### Naming

Names come from the Nucleo React component names, so `IconHeartOutline24` becomes `heart-outline-24`. A family's source packages merge into one prefix without collisions. The transform lives in [`naming.ts`](./packages/codegen/src/naming.ts).

### Colors

Monochrome families are normalized to `currentColor` so they inherit text color, and multicolor families keep their literal colors. The mode is set per family in the manifest.

## 🛠️ Development

```bash
bun install            # install the codegen and dev tooling
bun run lint           # type-checked ESLint
bun run typecheck      # type-check with tsc
bun run build:codegen  # build the codegen package
bun test               # run the pipeline tests
```

No license is needed to develop. `bun install` resolves only the codegen and dev tooling, and the tests run against fixtures that mimic the official Nucleo packages.

### How it fits together

- [`packages/codegen`](./packages/codegen) renders the official React components, normalizes each SVG with `@iconify/tools`, and emits `icons.json`. It ships a programmatic API and a CLI.
- [`packages/families/*`](./packages/families) is one thin wrapper per family that runs the codegen in a postinstall and re-exports the generated set as ESM and CommonJS.
- [`scripts/sync-families.ts`](./scripts/sync-families.ts) regenerates every family from the manifest, and CI runs `sync:check` to keep the committed files in sync.

Each family's `postinstall.mjs` is plain Node ESM, since it runs on the consumer's machine during install where only Node is guaranteed.

### Adding or changing a family

1. Edit the manifest in [`manifest.ts`](./packages/codegen/src/manifest.ts).
2. Run `bun run sync` to regenerate and format the family packages.
3. Commit with a [Conventional Commit](https://www.conventionalcommits.org/) message.

### Releasing

Cut a release with `bun run release`. It bumps the version, syncs the families, then commits, tags, and pushes. The tag triggers the Release workflow, which creates the GitHub Release from the Conventional Commits since the last tag and publishes the codegen and family packages to npm with provenance.

## ⚖️ License

The tooling and wrapper code in this repository is [MIT licensed](./LICENSE).

That license covers the code only. It grants no rights to Nucleo icons, which are a paid product owned by [Nucleo](https://nucleoapp.com) and governed by the [Nucleo license](https://nucleoapp.com/license). This repository contains no Nucleo icon data and must not be used to redistribute Nucleo assets. Generating and using the icons requires your own valid Nucleo license.

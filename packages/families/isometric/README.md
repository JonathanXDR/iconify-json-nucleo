# iconify-json-nucleo-isometric

> Nucleo **isometric** icons as an [Iconify](https://iconify.design/) icon set.

See the [workspace README](https://github.com/JonathanXDR/iconify-json-nucleo#readme) for the full picture.

## 🚀 Install

Set your `NUCLEO_LICENSE_KEY`, then install with your package manager.

```bash
export NUCLEO_LICENSE_KEY=your-license-key
npm install iconify-json-nucleo-isometric
```

For pnpm, Yarn, or Bun, use `pnpm add`, `yarn add`, or `bun add` instead. A postinstall renders the official Nucleo packages into `icons.json`. Every package needs Node.js 18 or newer.

> [!IMPORTANT]
> Many package managers block a dependency's postinstall script by default. If yours does, `icons.json` is not generated and importing the package fails. Use the table below to allow this package to build, or generate the set yourself with the codegen command.

| Package manager                    | Runs by default    | Enable the build                                                                                                                    |
| ---------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| npm                                | Yes, until npm v12 | From v12 (expected July 2026), run `npm approve-scripts iconify-json-nucleo-isometric`                                              |
| pnpm 11                            | No                 | Add `iconify-json-nucleo-isometric: true` under `allowBuilds` in `pnpm-workspace.yaml`, or run `pnpm approve-builds`                |
| pnpm 10                            | No                 | Add `iconify-json-nucleo-isometric` to `pnpm.onlyBuiltDependencies` in `package.json`, or run `pnpm approve-builds`                 |
| Yarn 4.14 and newer                | No                 | Add `dependenciesMeta.iconify-json-nucleo-isometric.built: true` to `package.json`                                                  |
| Yarn Classic and Berry before 4.14 | Yes                | Nothing needed                                                                                                                      |
| Bun                                | No                 | Add `iconify-json-nucleo-isometric` to `trustedDependencies` in `package.json`, or run `bun pm trust iconify-json-nucleo-isometric` |

To skip the postinstall, generate the set on demand:

```bash
npx iconify-json-nucleo-codegen build --base node_modules/iconify-json-nucleo-isometric
```

## 💻 Usage

Every package ships as both ESM and CommonJS with bundled TypeScript types, so no separate `@types` package is needed. Register a set once with any Iconify consumer.

```ts
// ESM
import { icons } from 'iconify-json-nucleo-isometric';
import { addCollection } from '@iconify/react';

addCollection(icons);
```

```js
// CommonJS
const { addCollection } = require('@iconify/react');
const icons = require('iconify-json-nucleo-isometric');

addCollection(icons);
```

Then render icons by their `prefix:name`.

```tsx
<Icon icon="nucleo-isometric:rocket-24" />
```

With [`@iconify/tailwind`](https://iconify.design/docs/usage/css/tailwind/) the JSON is read straight from `node_modules`.

```html
<span class="icon-[nucleo-isometric--rocket-24]"></span>
```

Build tools that need the raw set can read it directly from the `iconify-json-nucleo-isometric/icons.json` subpath export.

## 🔐 License key

The official Nucleo packages read `NUCLEO_LICENSE_KEY` from the environment in their preinstall and validate it against `nucleoapp.com` before any data is installed. This layer adds no license logic of its own. It simply depends on those packages, so a missing or invalid key fails the install upstream.

```bash
# Locally
export NUCLEO_LICENSE_KEY=your-license-key

# CI or Vercel
# Expose NUCLEO_LICENSE_KEY as an environment variable to the install step.
```

## ⚖️ License

The tooling and wrapper code in this repository is [MIT licensed](https://github.com/JonathanXDR/iconify-json-nucleo/blob/main/LICENSE).

That license covers the code only. It grants no rights to Nucleo icons, which are a paid product owned by [Nucleo](https://nucleoapp.com) and governed by the [Nucleo license](https://nucleoapp.com/license). This repository contains no Nucleo icon data and must not be used to redistribute Nucleo assets. Generating and using the icons requires your own valid Nucleo license.

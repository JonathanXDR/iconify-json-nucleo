# iconify-json-nucleo-ui

> Nucleo **ui** icons as an [Iconify](https://iconify.design/) icon set, prefix `nucleo-ui`.

The licensed SVG data is not shipped. It is generated on your machine from the official Nucleo packages (`nucleo-ui-outline-12`, `nucleo-ui-outline-18`, `nucleo-ui-fill-12`, `nucleo-ui-fill-18`, `nucleo-ui-outline-duo-18`, `nucleo-ui-fill-duo-18`) during install, gated by your `NUCLEO_LICENSE_KEY`.

```bash
export NUCLEO_LICENSE_KEY=your-license-key
npm install iconify-json-nucleo-ui
```

```ts
import { icons } from 'iconify-json-nucleo-ui';
import { addCollection } from '@iconify/react';

addCollection(icons);
```

CommonJS works too:

```cjs
const icons = require('iconify-json-nucleo-ui');
```

See the [workspace README](https://github.com/JonathanXDR/iconify-json-nucleo#readme) for the full picture.

## Disclaimer

Unofficial. This package is not affiliated with or endorsed by Nucleo. The icons are a paid product and all rights belong to [Nucleo](https://nucleoapp.com). The tooling code is MIT licensed. Using the icons requires your own valid Nucleo license.

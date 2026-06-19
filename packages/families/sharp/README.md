# iconify-json-nucleo-sharp

> Nucleo **sharp** icons as an [Iconify](https://iconify.design/) icon set, prefix `nucleo-sharp`.

The licensed SVG data is not shipped. It is generated on your machine from the official Nucleo packages (`nucleo-sharp`) during install, gated by your `NUCLEO_LICENSE_KEY`.

```bash
export NUCLEO_LICENSE_KEY=your-license-key
npm install iconify-json-nucleo-sharp
```

```ts
import { icons } from 'iconify-json-nucleo-sharp';
import { addCollection } from '@iconify/react';

addCollection(icons);
```

CommonJS works too:

```cjs
const icons = require('iconify-json-nucleo-sharp');
```

See the [workspace README](https://github.com/JonathanXDR/iconify-json-nucleo#readme) for the full picture.

## Disclaimer

Unofficial. This package is not affiliated with or endorsed by Nucleo. The icons are a paid product and all rights belong to [Nucleo](https://nucleoapp.com). The tooling code is MIT licensed. Using the icons requires your own valid Nucleo license.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FAMILIES, type Family } from '../packages/codegen/src/manifest';
import { readPackageJson } from './read-package-json';

const ROOT = join(import.meta.dir, '..');
const FAMILIES_DIR = join(ROOT, 'packages', 'families');
const CODEGEN = 'iconify-json-nucleo-codegen';

const codegenVersion = readPackageJson(join(ROOT, 'packages', 'codegen', 'package.json')).version;

function packageJson(family: Family): string {
  const dependencies: Record<string, string> = {
    '@iconify/types': '^2.0.0',
    [CODEGEN]: `^${codegenVersion}`,
  };
  for (const source of family.packages) {
    dependencies[source] = '^1.0.0';
  }

  const manifest = {
    name: family.packageName,
    version: codegenVersion,
    description: `Nucleo ${family.family} icons as an Iconify icon set (prefix "${family.prefix}")`,
    license: 'MIT',
    main: './index.js',
    module: './index.mjs',
    types: './index.d.ts',
    exports: {
      '.': {
        types: './index.d.ts',
        import: './index.mjs',
        require: './index.js',
      },
      './icons.json': './icons.json',
    },
    sideEffects: false,
    files: ['index.js', 'index.mjs', 'index.d.ts', 'postinstall.mjs'],
    scripts: {
      postinstall: 'node postinstall.mjs',
      build: 'node postinstall.mjs',
    },
    dependencies,
    publishConfig: { access: 'public' },
    repository: {
      type: 'git',
      url: 'git+https://github.com/JonathanXDR/iconify-json-nucleo.git',
      directory: `packages/families/${family.family}`,
    },
    homepage: `https://github.com/JonathanXDR/iconify-json-nucleo/tree/main/packages/families/${family.family}#readme`,
    bugs: { url: 'https://github.com/JonathanXDR/iconify-json-nucleo/issues' },
    author: 'Jonathan Russ',
    keywords: ['iconify', 'icons', 'svg', 'nucleo', family.family],
    engines: { node: '>=18' },
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function missingDataError(family: Family): string {
  return `${family.packageName}: icons.json was not generated. The licensed Nucleo icon data is built on install. Run "bunx ${CODEGEN} build" inside this package, and make sure NUCLEO_LICENSE_KEY was set during install.`;
}

function indexCjs(family: Family): string {
  return `'use strict';

let collection;
try {
  collection = require('./icons.json');
} catch {
  throw new Error('${missingDataError(family)}');
}

module.exports = collection;
`;
}

function indexMjs(family: Family): string {
  return `import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let collection;
try {
  collection = require('./icons.json');
} catch {
  throw new Error('${missingDataError(family)}');
}

export const icons = collection;
export default collection;
`;
}

function indexDts(): string {
  return `import type { IconifyJSON } from '@iconify/types';

export declare const icons: IconifyJSON;

declare const collection: IconifyJSON;
export default collection;
`;
}

function postinstallMjs(family: Family): string {
  return `import { fileURLToPath } from 'node:url';
import { buildFamily, findFamily, writeIconSet } from '${CODEGEN}';

const dir = fileURLToPath(new URL('.', import.meta.url));
const family = findFamily('${family.family}');

if (!family) {
  console.error('${family.packageName}: unknown family "${family.family}"');
  process.exit(1);
}

try {
  const { json, iconCount } = await buildFamily(family, { baseDir: dir });
  await writeIconSet(json, dir);
  console.log(\`${family.packageName}: built \${iconCount} icons for "\${family.prefix}"\`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(\`${family.packageName}: \${message}\`);
  console.error('Set NUCLEO_LICENSE_KEY and reinstall. See https://nucleoapp.com');
  process.exit(1);
}
`;
}

function readme(family: Family): string {
  const sources = family.packages.map((source) => `\`${source}\``).join(', ');
  return `# ${family.packageName}

> Nucleo **${family.family}** icons as an [Iconify](https://iconify.design/) icon set, prefix \`${family.prefix}\`.

The licensed SVG data is not shipped. It is generated on your machine from the official Nucleo packages (${sources}) during install, gated by your \`NUCLEO_LICENSE_KEY\`.

\`\`\`bash
export NUCLEO_LICENSE_KEY=your-license-key
npm install ${family.packageName}
\`\`\`

\`\`\`ts
import { icons } from '${family.packageName}';
import { addCollection } from '@iconify/react';

addCollection(icons);
\`\`\`

CommonJS works too:

\`\`\`cjs
const icons = require('${family.packageName}');
\`\`\`

See the [workspace README](https://github.com/JonathanXDR/iconify-json-nucleo#readme) for the full picture.

## Disclaimer

Unofficial. This package is not affiliated with or endorsed by Nucleo. The icons are a paid product and all rights belong to [Nucleo](https://nucleoapp.com). The tooling code is MIT licensed. Using the icons requires your own valid Nucleo license.
`;
}

async function sync(): Promise<void> {
  for (const family of FAMILIES) {
    const dir = join(FAMILIES_DIR, family.family);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'package.json'), packageJson(family));
    await writeFile(join(dir, 'index.js'), indexCjs(family));
    await writeFile(join(dir, 'index.mjs'), indexMjs(family));
    await writeFile(join(dir, 'index.d.ts'), indexDts());
    await writeFile(join(dir, 'postinstall.mjs'), postinstallMjs(family));
    await writeFile(join(dir, 'README.md'), readme(family));
  }

  console.log(`Synced ${FAMILIES.length} family packages into ${FAMILIES_DIR}.`);
}

await sync();

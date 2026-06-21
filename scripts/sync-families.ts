import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FAMILIES, type Family } from '../packages/codegen/src/manifest';
import { readPackageJson } from './read-package-json';

const ROOT = join(import.meta.dir, '..');
const FAMILIES_DIR = join(ROOT, 'packages', 'families');
const CODEGEN = 'iconify-json-nucleo-codegen';

const codegenVersion = readPackageJson(join(ROOT, 'packages', 'codegen', 'package.json')).version;

// Per-family example icon for the README usage snippet, verified against the
// generated sets. social-media is a best guess, its upstream package cannot
// currently be built.
const EXAMPLE_ICON: Record<string, string> = {
  core: 'heart-outline-24',
  ui: 'check-outline-18',
  sharp: 'star',
  'micro-bold': 'heart',
  pixel: 'star',
  flags: 'switzerland',
  glass: 'heart',
  isometric: 'cube',
  'social-media': 'github',
  'credit-cards': 'visa',
  arcade: 'joystick',
};

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
    description: `Nucleo ${family.family} icons as an Iconify icon set`,
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
  const example = EXAMPLE_ICON[family.family] ?? 'heart-24';
  return `# ${family.packageName}

> Nucleo **${family.family}** icons as an [Iconify](https://iconify.design/) icon set.

See the [workspace README](https://github.com/JonathanXDR/iconify-json-nucleo#readme) for the full picture.

## 🚀 Install

Set your \`NUCLEO_LICENSE_KEY\`, then install with your package manager.

\`\`\`bash
export NUCLEO_LICENSE_KEY=your-license-key
npm install ${family.packageName}
\`\`\`

For pnpm, Yarn, or Bun, use \`pnpm add\`, \`yarn add\`, or \`bun add\` instead. A postinstall renders the official Nucleo packages into \`icons.json\`. Every package needs Node.js 18 or newer.

> [!IMPORTANT]
> Many package managers block a dependency's postinstall script by default. If yours does, \`icons.json\` is not generated and importing the package fails. Use the table below to allow this package to build, or generate the set yourself with the codegen command.

| Package manager | Runs by default | Enable the build |
| --- | --- | --- |
| npm | Yes, until npm v12 | From v12 (expected July 2026), run \`npm approve-scripts ${family.packageName}\` |
| pnpm 11 | No | Add \`${family.packageName}: true\` under \`allowBuilds\` in \`pnpm-workspace.yaml\`, or run \`pnpm approve-builds\` |
| pnpm 10 | No | Add \`${family.packageName}\` to \`pnpm.onlyBuiltDependencies\` in \`package.json\`, or run \`pnpm approve-builds\` |
| Yarn 4.14 and newer | No | Add \`dependenciesMeta.${family.packageName}.built: true\` to \`package.json\` |
| Yarn Classic and Berry before 4.14 | Yes | Nothing needed |
| Bun | No | Add \`${family.packageName}\` to \`trustedDependencies\` in \`package.json\`, or run \`bun pm trust ${family.packageName}\` |

To skip the postinstall, generate the set on demand:

\`\`\`bash
npx ${CODEGEN} build --base node_modules/${family.packageName}
\`\`\`

## 💻 Usage

Every package ships as both ESM and CommonJS with bundled TypeScript types, so no separate \`@types\` package is needed. Register a set once with any Iconify consumer.

\`\`\`ts
// ESM
import { icons } from '${family.packageName}';
import { addCollection } from '@iconify/react';

addCollection(icons);
\`\`\`

\`\`\`js
// CommonJS
const { addCollection } = require('@iconify/react');
const icons = require('${family.packageName}');

addCollection(icons);
\`\`\`

Then render icons by their \`prefix:name\`.

\`\`\`tsx
<Icon icon="${family.prefix}:${example}" />
\`\`\`

With [\`@iconify/tailwind\`](https://iconify.design/docs/usage/css/tailwind/) the JSON is read straight from \`node_modules\`.

\`\`\`html
<span class="icon-[${family.prefix}--${example}]"></span>
\`\`\`

Build tools that need the raw set can read it directly from the \`${family.packageName}/icons.json\` subpath export.

## 🔐 License key

The official Nucleo packages read \`NUCLEO_LICENSE_KEY\` from the environment in their preinstall and validate it against \`nucleoapp.com\` before any data is installed. This layer adds no license logic of its own. It simply depends on those packages, so a missing or invalid key fails the install upstream.

\`\`\`bash
# Locally
export NUCLEO_LICENSE_KEY=your-license-key

# CI or Vercel
# Expose NUCLEO_LICENSE_KEY as an environment variable to the install step.
\`\`\`

## ⚖️ License

The tooling and wrapper code in this repository is [MIT licensed](https://github.com/JonathanXDR/iconify-json-nucleo/blob/main/LICENSE).

That license covers the code only. It grants no rights to Nucleo icons, which are a paid product owned by [Nucleo](https://nucleoapp.com) and governed by the [Nucleo license](https://nucleoapp.com/license). This repository contains no Nucleo icon data and must not be used to redistribute Nucleo assets. Generating and using the icons requires your own valid Nucleo license.
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

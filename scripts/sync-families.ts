import { join } from 'node:path';
import { FAMILIES, type Family } from '../packages/codegen/src/manifest';
import { readPackageJson } from './read-package-json';

const ROOT = join(import.meta.dir, '..');
const FAMILIES_DIR = join(ROOT, 'packages', 'families');
const TEMPLATES_DIR = join(import.meta.dir, 'templates', 'family');
const CODEGEN = 'iconify-json-nucleo-codegen';

const codegenVersion = (await readPackageJson(join(ROOT, 'packages', 'codegen', 'package.json')))
  .version;

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

// Files copied from templates/family into every family package, with {{token}}
// placeholders substituted. icons.json is generated on install, so it is not
// listed here, and package.json is generated separately since its dependencies
// are dynamic per family.
const TEMPLATE_FILES = [
  'index.js',
  'index.mjs',
  'index.d.ts',
  'postinstall.mjs',
  'README.md',
] as const;

// Replaces every {{token}} in a template with its value, throwing on a token
// that has no matching variable so a typo fails the sync loudly.
function render(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, token: string) => {
    const value = vars[token];
    if (value === undefined) {
      throw new Error(`Unknown template token "{{${token}}}"`);
    }
    return value;
  });
}

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

async function sync(): Promise<void> {
  const templates = await Promise.all(
    TEMPLATE_FILES.map(async (file) => ({
      file,
      content: await Bun.file(join(TEMPLATES_DIR, file)).text(),
    })),
  );

  // Bun.write creates the parent directory, so each family writes in parallel
  // with no separate mkdir step.
  await Promise.all(
    FAMILIES.map(async (family) => {
      const dir = join(FAMILIES_DIR, family.family);
      const vars: Record<string, string> = {
        packageName: family.packageName,
        family: family.family,
        prefix: family.prefix,
        codegen: CODEGEN,
        exampleIcon: EXAMPLE_ICON[family.family] ?? 'heart',
      };

      await Promise.all([
        Bun.write(join(dir, 'package.json'), packageJson(family)),
        ...templates.map(({ file, content }) => Bun.write(join(dir, file), render(content, vars))),
      ]);
    }),
  );

  console.log(`Synced ${FAMILIES.length} family packages into ${FAMILIES_DIR}.`);
}

await sync();

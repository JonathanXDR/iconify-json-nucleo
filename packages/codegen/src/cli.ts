#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { buildFamily, writeIconSet } from './build';
import { FAMILIES, findFamily } from './manifest';

const LICENSE_HINT =
  'Set NUCLEO_LICENSE_KEY in your environment and reinstall. The official Nucleo packages refuse to install without a valid license. See https://nucleoapp.com';

async function familyFromPackageJson(dir: string): Promise<string | undefined> {
  try {
    const raw = await readFile(join(dir, 'package.json'), 'utf8');
    const name = (JSON.parse(raw) as { name?: unknown }).name;
    const match = typeof name === 'string' ? /iconify-json-nucleo-(.+)$/.exec(name) : null;
    return match?.[1];
  } catch {
    return undefined;
  }
}

function printHelp(): void {
  const slugs = FAMILIES.map((family) => family.family).join(', ');
  process.stdout.write(
    [
      'Usage: iconify-json-nucleo-codegen build [options]',
      '',
      'Options:',
      '  --family <slug>  Family to build. Defaults to the package in --base.',
      '  --base <dir>     Directory whose node_modules and package.json drive resolution. Defaults to cwd.',
      '  --out <dir>      Directory to write icons.json to. Defaults to --base.',
      '  --help           Show this message.',
      '',
      `Families: ${slugs}`,
      '',
    ].join('\n'),
  );
}

async function run(): Promise<void> {
  const { values } = parseArgs({
    options: {
      family: { type: 'string' },
      base: { type: 'string' },
      out: { type: 'string' },
      help: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    printHelp();
    return;
  }

  const baseDir = values.base ?? process.cwd();
  const slug = values.family ?? (await familyFromPackageJson(baseDir));
  if (slug === undefined) {
    throw new Error(
      `Could not determine the family. Pass --family <slug> (one of iconify-json-nucleo-*).`,
    );
  }

  const family = findFamily(slug);
  if (family === undefined) {
    throw new Error(`Unknown family "${slug}".`);
  }

  const result = await buildFamily(family, { baseDir });
  const target = await writeIconSet(result.json, values.out ?? baseDir);
  process.stdout.write(`Built ${result.iconCount} icons for "${result.prefix}" to ${target}\n`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`iconify-json-nucleo-codegen: ${message}\n${LICENSE_HINT}\n`);
  process.exitCode = 1;
});

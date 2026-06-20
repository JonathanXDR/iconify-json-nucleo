import { cp, mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, test } from 'bun:test';
import type { IconifyJSON } from '@iconify/types';
import { buildFamily, writeIconSet } from '../src/build';
import { coreLike, fixtureResolver } from './helpers';

const generatedFamily = fileURLToPath(new URL('../../families/core/', import.meta.url));
const workdir = await mkdtemp(join(tmpdir(), 'iconify-json-nucleo-entry-'));

afterAll(async () => {
  await rm(workdir, { recursive: true, force: true });
});

describe('generated family entrypoints', () => {
  test('expose the icon set through both ESM and CommonJS once icons.json exists', async () => {
    const { json } = await buildFamily(coreLike, { resolve: fixtureResolver });
    await writeIconSet(json, workdir);
    await cp(join(generatedFamily, 'index.mjs'), join(workdir, 'index.mjs'));
    await cp(join(generatedFamily, 'index.js'), join(workdir, 'index.js'));

    const esm = (await import(join(workdir, 'index.mjs'))) as {
      default: IconifyJSON;
      icons: IconifyJSON;
    };
    expect(esm.icons.prefix).toBe('nucleo-core');
    expect(esm.default).toBe(esm.icons);

    const require = createRequire(import.meta.url);
    const cjs = require(join(workdir, 'index.js')) as IconifyJSON;
    expect(cjs.prefix).toBe('nucleo-core');
    expect(Object.keys(cjs.icons)).toEqual(Object.keys(esm.icons.icons));
  });

  test('throw an actionable error when icons.json is missing', async () => {
    await expect(import(join(generatedFamily, 'index.mjs'))).rejects.toThrow(/was not generated/);
  });
});

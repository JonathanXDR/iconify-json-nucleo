import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, test } from 'bun:test';
import type { IconifyJSON } from '@iconify/types';
import { getIconData, iconToHTML, iconToSVG, quicklyValidateIconSet } from '@iconify/utils';
import { buildFamily, writeIconSet } from '../src/build';
import { coreLike, fixtureResolver } from './helpers';

const workdir = await mkdtemp(join(tmpdir(), 'iconify-json-nucleo-'));

afterAll(async () => {
  await rm(workdir, { recursive: true, force: true });
});

describe('end to end', () => {
  test('writes a valid, consumable icons.json', async () => {
    const { json } = await buildFamily(coreLike, { resolve: fixtureResolver });
    const target = await writeIconSet(json, workdir);

    const onDisk = JSON.parse(await readFile(target, 'utf8')) as IconifyJSON;
    expect(quicklyValidateIconSet(onDisk)).not.toBeNull();
    expect(onDisk.prefix).toBe('nucleo-core');

    const icon = getIconData(onDisk, 'heart-outline-24');
    expect(icon).not.toBeNull();
    if (icon === null) return;

    const rendered = iconToSVG(icon, { height: 'auto' });
    const html = iconToHTML(rendered.body, rendered.attributes);
    expect(html).toContain('<svg');
    expect(html).toContain('currentColor');
  });
});

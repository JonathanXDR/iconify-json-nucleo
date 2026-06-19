import { describe, expect, test } from 'bun:test';
import { buildFamily, type PackageResolver } from '../src/build';
import type { Family } from '../src/manifest';

const resolver: PackageResolver = (pkg) => new URL(`./fixtures/${pkg}.tsx`, import.meta.url).href;

const coreLike: Family = {
  family: 'core',
  color: 'monochrome',
  packages: ['outline-24', 'fill-24'],
  prefix: 'nucleo-core',
  packageName: 'iconify-json-nucleo-core',
};

const flagsLike: Family = {
  family: 'flags',
  color: 'multicolor',
  packages: ['flags-32'],
  prefix: 'nucleo-flags',
  packageName: 'iconify-json-nucleo-flags',
};

describe('buildFamily', () => {
  test('merges member packages into one prefix with style and size in the name', async () => {
    const { json, iconCount, prefix } = await buildFamily(coreLike, { resolve: resolver });

    expect(prefix).toBe('nucleo-core');
    expect(iconCount).toBe(6);
    expect(Object.keys(json.icons).sort()).toEqual(
      [
        '3d-printer-outline-24',
        'arrow-up-outline-24',
        'heart-fill-24',
        'heart-outline-24',
        'star-fill-24',
        'star-outline-24',
      ].sort(),
    );
  });

  test('monochrome families normalize to currentColor', async () => {
    const { json } = await buildFamily(coreLike, { resolve: resolver });

    expect(json.icons['heart-outline-24']?.body).toContain('currentColor');
    expect(json.icons['heart-fill-24']?.body).toContain('currentColor');
  });

  test('multicolor families keep their literal colors', async () => {
    const { json } = await buildFamily(flagsLike, { resolve: resolver });
    const body = json.icons['ch-flag']?.body ?? '';

    expect(body).not.toContain('currentColor');
    expect(body.length).toBeGreaterThan(0);
  });

  test('rejects cross-package icon name collisions', () => {
    const colliding: Family = { ...coreLike, packages: ['outline-24', 'outline-24'] };

    expect(buildFamily(colliding, { resolve: resolver })).rejects.toThrow(/collision/);
  });
});

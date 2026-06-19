import { describe, expect, test } from 'bun:test';
import { FAMILIES, findFamily } from '../src/manifest';

describe('manifest', () => {
  test('exposes families with unique prefixes and package names', () => {
    const prefixes = new Set(FAMILIES.map((family) => family.prefix));
    const packageNames = new Set(FAMILIES.map((family) => family.packageName));

    expect(prefixes.size).toBe(FAMILIES.length);
    expect(packageNames.size).toBe(FAMILIES.length);
  });

  test('derives prefix and package name from the family slug', () => {
    const core = findFamily('core');

    expect(core?.prefix).toBe('nucleo-core');
    expect(core?.packageName).toBe('iconify-json-nucleo-core');
  });

  test('declares only official nucleo source packages', () => {
    for (const family of FAMILIES) {
      for (const pkg of family.packages) {
        expect(pkg.startsWith('nucleo-')).toBe(true);
      }
    }
  });
});

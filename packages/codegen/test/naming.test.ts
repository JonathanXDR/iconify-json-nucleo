import { describe, expect, test } from 'bun:test';
import { iconNameFromExport, kebabCase } from '../src/naming';

describe('kebabCase', () => {
  const cases: [string, string][] = [
    ['HeartOutline24', 'heart-outline-24'],
    ['ArrowUpFill48', 'arrow-up-fill-48'],
    ['3dPrinterOutline24', '3d-printer-outline-24'],
    ['AbcLettersOutline24', 'abc-letters-outline-24'],
    ['FillDuo18', 'fill-duo-18'],
  ];

  for (const [input, expected] of cases) {
    test(`${input} -> ${expected}`, () => {
      expect(kebabCase(input)).toBe(expected);
    });
  }
});

describe('iconNameFromExport', () => {
  test('strips the Icon prefix and kebab-cases the rest', () => {
    expect(iconNameFromExport('IconHeartOutline24')).toBe('heart-outline-24');
  });

  test('ignores the bare Icon wrapper export', () => {
    expect(iconNameFromExport('Icon')).toBeUndefined();
  });

  test('ignores exports that are not icon components', () => {
    expect(iconNameFromExport('createIcon')).toBeUndefined();
    expect(iconNameFromExport('default')).toBeUndefined();
  });
});

import { describe, expect, test } from 'bun:test';
import { renderModule } from '../src/render';

const outline = new URL('./fixtures/outline-24.tsx', import.meta.url).href;

describe('renderModule', () => {
  test('renders every icon component and skips the Icon wrapper', async () => {
    const icons = await renderModule(outline);
    const names = icons.map((icon) => icon.name).sort();

    expect(names).toEqual([
      '3d-printer-outline-24',
      'arrow-up-outline-24',
      'heart-outline-24',
      'star-outline-24',
    ]);
  });

  test('emits a complete svg with a viewBox', async () => {
    const icons = await renderModule(outline);
    const heart = icons.find((icon) => icon.name === 'heart-outline-24');

    expect(heart?.svg).toContain('viewBox="0 0 24 24"');
    expect(heart?.svg).toContain('currentColor');
  });
});

import { describe, expect, test } from 'bun:test';
import { convert } from '../src/convert';
import type { RenderedIcon } from '../src/render';
import { coreLike } from './helpers';

const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${body}</svg>`;

const path = '<path d="M4 4h16v16H4z" stroke="currentColor" fill="none" />';

describe('convert', () => {
  test('skips a malformed icon instead of aborting the whole set', () => {
    const good: RenderedIcon = { name: 'good-24', svg: wrap(path) };
    // A dangling clip-path reference, as some upstream Nucleo icons emit, which
    // @iconify/tools cannot process.
    const bad: RenderedIcon = {
      name: 'bad-24',
      svg: wrap(`<g clip-path="url(#missing)">${path}</g>`),
    };

    const json = convert([good, bad], coreLike);

    expect(json.icons['good-24']).toBeDefined();
    expect(json.icons['bad-24']).toBeUndefined();
  });
});

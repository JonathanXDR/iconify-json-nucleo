import { blankIconSet, cleanupSVG, isEmptyColor, parseColors, runSVGO, SVG } from '@iconify/tools';
import type { IconifyJSON } from '@iconify/types';
import { quicklyValidateIconSet } from '@iconify/utils';
import type { Family } from './manifest';
import type { RenderedIcon } from './render';

export function convert(icons: RenderedIcon[], family: Family): IconifyJSON {
  const iconSet = blankIconSet(family.prefix);
  const skipped: string[] = [];

  for (const { name, svg: markup } of icons) {
    try {
      const svg = new SVG(markup);
      cleanupSVG(svg);

      if (family.color === 'monochrome') {
        parseColors(svg, {
          defaultColor: 'currentColor',
          callback: (_attr, _colorString, color) =>
            color !== null && isEmptyColor(color) ? color : 'currentColor',
        });
      }

      runSVGO(svg);
      iconSet.fromSVG(name, svg);
    } catch (error) {
      // Some upstream Nucleo icons emit a dangling reference, such as a
      // clip-path whose clipPath is never defined, which @iconify/tools
      // rejects. Skip the bad icon so a few malformed ones cannot abort the
      // whole family.
      skipped.push(`${name} (${error instanceof Error ? error.message : String(error)})`);
    }
  }

  if (skipped.length > 0) {
    console.warn(
      `${family.prefix}: skipped ${skipped.length} malformed icon(s): ${skipped.join(', ')}`,
    );
  }

  const json = iconSet.export();

  if (Object.keys(json.icons).length === 0) {
    throw new Error(`No valid icons for "${family.prefix}", all ${icons.length} were skipped`);
  }

  if (!quicklyValidateIconSet(json)) {
    throw new Error(`Generated icon set for "${family.prefix}" failed Iconify validation`);
  }

  return json;
}

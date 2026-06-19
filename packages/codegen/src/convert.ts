import { blankIconSet, cleanupSVG, isEmptyColor, parseColors, runSVGO, SVG } from '@iconify/tools';
import type { IconifyJSON } from '@iconify/types';
import { quicklyValidateIconSet } from '@iconify/utils';
import type { Family } from './manifest';
import type { RenderedIcon } from './render';

export async function convert(icons: RenderedIcon[], family: Family): Promise<IconifyJSON> {
  const iconSet = blankIconSet(family.prefix);

  for (const { name, svg: markup } of icons) {
    const svg = new SVG(markup);
    cleanupSVG(svg);

    if (family.color === 'monochrome') {
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (_attr, _colorString, color) =>
          color !== null && isEmptyColor(color) ? color : 'currentColor',
      });
    }

    runSVGO(svg);
    iconSet.fromSVG(name, svg);
  }

  const json = iconSet.export();

  if (!quicklyValidateIconSet(json)) {
    throw new Error(`Generated icon set for "${family.prefix}" failed Iconify validation`);
  }

  return json;
}

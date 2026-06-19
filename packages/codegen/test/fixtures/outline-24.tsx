import { createElement } from 'react';
import { Icon } from './icon-base';

export { Icon };

const stroke = { stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 };

export function IconHeartOutline24() {
  return createElement(
    Icon,
    { size: 24 },
    createElement('path', { d: 'M12 21L5 14a4 4 0 015-6 4 4 0 015 6z', ...stroke }),
  );
}

export function IconStarOutline24() {
  return createElement(
    Icon,
    { size: 24 },
    createElement('path', { d: 'M12 3l3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1z', ...stroke }),
  );
}

export function IconArrowUpOutline24() {
  return createElement(
    Icon,
    { size: 24 },
    createElement('path', { d: 'M12 20V4M6 10l6-6 6 6', ...stroke }),
  );
}

export function Icon3dPrinterOutline24() {
  return createElement(
    Icon,
    { size: 24 },
    createElement('path', { d: 'M4 8h16v8H4zM8 16v4h8v-4', ...stroke }),
  );
}

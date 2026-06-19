import { createElement } from 'react';
import { Icon } from './icon-base';

export { Icon };

const fill = { fill: 'currentColor' };

export function IconHeartFill24() {
  return createElement(
    Icon,
    { size: 24 },
    createElement('path', { d: 'M12 21L5 14a4 4 0 015-6 4 4 0 015 6z', ...fill }),
  );
}

export function IconStarFill24() {
  return createElement(
    Icon,
    { size: 24 },
    createElement('path', { d: 'M12 3l3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1z', ...fill }),
  );
}

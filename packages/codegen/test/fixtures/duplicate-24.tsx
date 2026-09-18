import { createElement } from 'react';
import { Icon } from './icon-base';

export { Icon };

// Both names kebab-case to "star-fill-24", the collision renderModule must reject
export function IconStarFill24() {
  return createElement(Icon, { size: 24 });
}

export function IconStarFILL24() {
  return createElement(Icon, { size: 24 });
}

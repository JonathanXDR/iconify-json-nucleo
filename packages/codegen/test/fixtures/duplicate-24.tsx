import { createElement } from 'react';
import { Icon } from './icon-base';

export { Icon };

// IconStarFill24 and IconStarFILL24 both kebab-case to "star-fill-24", so a
// single module produces a collision that renderModule must reject.
export function IconStarFill24() {
  return createElement(Icon, { size: 24 });
}

export function IconStarFILL24() {
  return createElement(Icon, { size: 24 });
}

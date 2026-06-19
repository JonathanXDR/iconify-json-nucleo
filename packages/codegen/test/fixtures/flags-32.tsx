import { createElement } from 'react';
import { Icon } from './icon-base';

export { Icon };

export function IconChFlag() {
  return createElement(
    Icon,
    { size: 32 },
    createElement('rect', { width: 32, height: 32, fill: '#ff0000' }),
    createElement('path', { d: 'M14 8h4v6h6v4h-6v6h-4v-6H8v-4h6z', fill: '#ffffff' }),
  );
}

export function IconUsFlag() {
  return createElement(
    Icon,
    { size: 32 },
    createElement('rect', { width: 32, height: 32, fill: '#b22234' }),
    createElement('rect', { width: 32, height: 4, y: 4, fill: '#ffffff' }),
  );
}

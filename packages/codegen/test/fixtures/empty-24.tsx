import { Icon } from './icon-base';

// Covers renderModule's two skip branches: Icon has no derivable name, IconLabel is
// named like an icon but is not a component
export { Icon };

export const IconLabel = 'not a component';

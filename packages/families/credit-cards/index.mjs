import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let collection;
try {
  collection = require('./icons.json');
} catch {
  throw new Error(
    'iconify-json-nucleo-credit-cards: icons.json was not generated. The licensed Nucleo icon data is built on install. Run "npx iconify-json-nucleo-codegen build" inside this package, and make sure NUCLEO_LICENSE_KEY was set during install.',
  );
}

export const icons = collection;
export default collection;

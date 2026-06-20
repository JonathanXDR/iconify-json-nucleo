import type { PackageResolver } from '../src/build';
import type { Family } from '../src/manifest';

export const fixtureResolver: PackageResolver = (pkg) =>
  new URL(`./fixtures/${pkg}.tsx`, import.meta.url).href;

export const coreLike: Family = {
  family: 'core',
  color: 'monochrome',
  packages: ['outline-24', 'fill-24'],
  prefix: 'nucleo-core',
  packageName: 'iconify-json-nucleo-core',
};

export const flagsLike: Family = {
  family: 'flags',
  color: 'multicolor',
  packages: ['flags-32'],
  prefix: 'nucleo-flags',
  packageName: 'iconify-json-nucleo-flags',
};

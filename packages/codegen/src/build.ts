import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { IconifyJSON } from '@iconify/types';
import { convert } from './convert';
import type { Family } from './manifest';
import { renderModule, type RenderedIcon } from './render';

export type PackageResolver = (packageName: string) => string | Promise<string>;

export interface BuildOptions {
  resolve?: PackageResolver;
  baseDir?: string;
}

export interface BuildResult {
  readonly prefix: string;
  readonly iconCount: number;
  readonly json: IconifyJSON;
}

export function createPackageResolver(baseDir: string): PackageResolver {
  const require = createRequire(pathToFileURL(join(baseDir, 'package.json')));
  return (packageName) => pathToFileURL(require.resolve(packageName)).href;
}

export async function buildFamily(
  family: Family,
  options: BuildOptions = {},
): Promise<BuildResult> {
  const resolve = options.resolve ?? createPackageResolver(options.baseDir ?? process.cwd());
  const icons: RenderedIcon[] = [];
  const origin = new Map<string, string>();

  for (const packageName of family.packages) {
    const specifier = await resolve(packageName);
    for (const icon of await renderModule(specifier)) {
      const previous = origin.get(icon.name);
      if (previous !== undefined) {
        throw new Error(
          `Icon collision in "${family.prefix}": "${icon.name}" appears in ${packageName} and ${previous}`,
        );
      }
      origin.set(icon.name, packageName);
      icons.push(icon);
    }
  }

  const json = convert(icons, family);
  return { prefix: family.prefix, iconCount: Object.keys(json.icons).length, json };
}

export async function writeIconSet(json: IconifyJSON, outputDir: string): Promise<string> {
  await mkdir(outputDir, { recursive: true });
  const target = join(outputDir, 'icons.json');
  await writeFile(target, `${JSON.stringify(json, null, '\t')}\n`, 'utf8');
  return target;
}

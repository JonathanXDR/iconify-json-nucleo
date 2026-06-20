import { readFileSync } from 'node:fs';
import { z } from 'zod';

// Validates the fields the release scripts rely on while passing every other
// key through untouched, so a parsed manifest can be written back unchanged.
const PackageJsonSchema = z.looseObject({
  name: z.string(),
  version: z.string(),
});

export type PackageJson = z.infer<typeof PackageJsonSchema>;

export function readPackageJson(path: string): PackageJson {
  return PackageJsonSchema.parse(JSON.parse(readFileSync(path, 'utf8')));
}

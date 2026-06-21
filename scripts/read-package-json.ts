import { z } from 'zod';

// Validates the fields the release scripts rely on while passing every other
// key through untouched, so a parsed manifest can be written back unchanged.
const PackageJsonSchema = z.looseObject({
  name: z.string(),
  version: z.string(),
});

export type PackageJson = z.infer<typeof PackageJsonSchema>;

export async function readPackageJson(path: string): Promise<PackageJson> {
  return PackageJsonSchema.parse(await Bun.file(path).json());
}

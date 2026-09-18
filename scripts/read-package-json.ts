import { z } from 'zod';

const PackageJsonSchema = z.looseObject({
  name: z.string(),
  version: z.string(),
});

export type PackageJson = z.infer<typeof PackageJsonSchema>;

export async function readPackageJson(path: string): Promise<PackageJson> {
  return PackageJsonSchema.parse(await Bun.file(path).json());
}

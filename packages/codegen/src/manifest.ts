import { z } from 'zod';

const FamilySchema = z
  .object({
    family: z.string().regex(/^[a-z][a-z0-9-]*$/),
    color: z.enum(['monochrome', 'multicolor']),
    packages: z.array(z.string().regex(/^nucleo-[a-z0-9-]+$/)).min(1),
  })
  .strict();

export type Family = z.infer<typeof FamilySchema> & {
  readonly prefix: string;
  readonly packageName: string;
};

const SOURCES = [
  {
    family: 'core',
    color: 'monochrome',
    packages: [
      'nucleo-core-outline-24',
      'nucleo-core-outline-32',
      'nucleo-core-outline-48',
      'nucleo-core-fill-24',
      'nucleo-core-fill-32',
      'nucleo-core-fill-48',
    ],
  },
  {
    family: 'ui',
    color: 'monochrome',
    packages: [
      'nucleo-ui-outline-12',
      'nucleo-ui-outline-18',
      'nucleo-ui-fill-12',
      'nucleo-ui-fill-18',
      'nucleo-ui-outline-duo-18',
      'nucleo-ui-fill-duo-18',
    ],
  },
  { family: 'sharp', color: 'monochrome', packages: ['nucleo-sharp'] },
  { family: 'micro-bold', color: 'monochrome', packages: ['nucleo-micro-bold'] },
  { family: 'pixel', color: 'monochrome', packages: ['nucleo-pixel'] },
  { family: 'flags', color: 'multicolor', packages: ['nucleo-flags'] },
  { family: 'glass', color: 'multicolor', packages: ['nucleo-glass'] },
  { family: 'isometric', color: 'multicolor', packages: ['nucleo-isometric'] },
  { family: 'social-media', color: 'multicolor', packages: ['nucleo-social-media'] },
  { family: 'credit-cards', color: 'multicolor', packages: ['nucleo-credit-cards'] },
  { family: 'arcade', color: 'multicolor', packages: ['nucleo-arcade'] },
] as const;

function decorate(source: z.infer<typeof FamilySchema>): Family {
  return {
    ...source,
    prefix: `nucleo-${source.family}`,
    packageName: `iconify-json-nucleo-${source.family}`,
  };
}

export const FAMILIES: readonly Family[] = z.array(FamilySchema).parse(SOURCES).map(decorate);

export function findFamily(slug: string): Family | undefined {
  return FAMILIES.find((entry) => entry.family === slug);
}

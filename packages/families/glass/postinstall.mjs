import { fileURLToPath } from 'node:url';
import { buildFamily, findFamily, writeIconSet } from 'iconify-json-nucleo-codegen';

const dir = fileURLToPath(new URL('.', import.meta.url));
const family = findFamily('glass');

if (!family) {
  console.error('iconify-json-nucleo-glass: unknown family "glass"');
  process.exit(1);
}

try {
  const { json, iconCount } = await buildFamily(family, { baseDir: dir });
  await writeIconSet(json, dir);
  console.log(`iconify-json-nucleo-glass: built ${iconCount} icons for "${family.prefix}"`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`iconify-json-nucleo-glass: ${message}`);
  console.error('Set NUCLEO_LICENSE_KEY and reinstall. See https://nucleoapp.com');
  process.exit(1);
}

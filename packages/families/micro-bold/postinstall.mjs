import { fileURLToPath } from 'node:url';
import { buildFamily, findFamily, writeIconSet } from 'iconify-json-nucleo-codegen';

const dir = fileURLToPath(new URL('.', import.meta.url));
const family = findFamily('micro-bold');

if (!family) {
  console.error('iconify-json-nucleo-micro-bold: unknown family "micro-bold"');
  process.exit(1);
}

try {
  const { json, iconCount } = await buildFamily(family, { baseDir: dir });
  await writeIconSet(json, dir);
  console.log(`iconify-json-nucleo-micro-bold: built ${iconCount} icons for "${family.prefix}"`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`iconify-json-nucleo-micro-bold: ${message}`);
  console.error('Set NUCLEO_LICENSE_KEY and reinstall. See https://nucleoapp.com');
  process.exit(1);
}

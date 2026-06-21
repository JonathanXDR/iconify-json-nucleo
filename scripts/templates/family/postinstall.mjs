import { fileURLToPath } from 'node:url';
import { buildFamily, findFamily, writeIconSet } from '{{codegen}}';

const dir = fileURLToPath(new URL('.', import.meta.url));
const family = findFamily('{{family}}');

if (!family) {
  console.error('{{packageName}}: unknown family "{{family}}"');
  process.exit(1);
}

try {
  const { json, iconCount } = await buildFamily(family, { baseDir: dir });
  await writeIconSet(json, dir);
  console.log(`{{packageName}}: built ${iconCount} icons for "${family.prefix}"`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`{{packageName}}: ${message}`);
  console.error('Set NUCLEO_LICENSE_KEY and reinstall. See https://nucleoapp.com');
  process.exit(1);
}

import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');
const familiesDir = join(root, 'packages', 'families');

const targets = [
  join(root, 'packages', 'codegen'),
  ...readdirSync(familiesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(familiesDir, entry.name)),
];

for (const cwd of targets) {
  console.log(`Publishing ${cwd}`);
  execFileSync('npm', ['publish', '--access', 'public'], { cwd, stdio: 'inherit' });
}

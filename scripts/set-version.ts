import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readPackageJson } from './read-package-json';

const root = join(import.meta.dir, '..');
const codegenPkgPath = join(root, 'packages', 'codegen', 'package.json');

const version = process.argv[2];
const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
if (!version || !semver.test(version)) {
  console.error(`set-version: expected a semver version argument, got "${version ?? ''}"`);
  process.exit(1);
}

const pkg = readPackageJson(codegenPkgPath);
pkg.version = version;
writeFileSync(codegenPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

execFileSync('bun', ['run', 'sync'], { cwd: root, stdio: 'inherit' });

console.log(`set-version: ${version} across codegen and all family packages`);

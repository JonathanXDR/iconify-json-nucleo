import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { FAMILIES } from '../packages/codegen/src/manifest';
import { readPackageJson } from './read-package-json';

const root = join(import.meta.dir, '..');

// Codegen publishes first so the families' "^<codegen>" pin resolves for a
// consumer that installs right after a release. The families follow from the
// manifest, so the publish set always matches the declared families exactly.
const targets = [
  join(root, 'packages', 'codegen'),
  ...FAMILIES.map((family) => join(root, 'packages', 'families', family.family)),
];

function alreadyPublished(name: string, version: string): boolean {
  try {
    const out = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() === version;
  } catch {
    return false;
  }
}

const failures: string[] = [];

for (const cwd of targets) {
  const pkg = readPackageJson(join(cwd, 'package.json'));
  const id = `${pkg.name}@${pkg.version}`;
  if (alreadyPublished(pkg.name, pkg.version)) {
    console.log(`Skipping ${id} (already published)`);
    continue;
  }
  try {
    console.log(`Publishing ${id}`);
    execFileSync('npm', ['publish', '--access', 'public', '--provenance'], {
      cwd,
      stdio: 'inherit',
    });
  } catch {
    // A failed publish can mean the version already exists (a flaky `npm view`
    // returned a false negative above) or a genuine error. Re-check so a real
    // conflict is treated as success and only true failures are collected.
    if (alreadyPublished(pkg.name, pkg.version)) {
      console.log(`Skipping ${id} (already published)`);
      continue;
    }
    console.error(`Failed to publish ${id}`);
    failures.push(id);
  }
}

if (failures.length > 0) {
  console.error(`publish: ${failures.length} of ${targets.length} package(s) failed`);
  console.error(`failed: ${failures.join(', ')}`);
  console.error('Re-run `bun run scripts/publish.ts` to retry the remaining packages.');
  process.exit(1);
}

console.log(`publish: all ${targets.length} package(s) are up to date`);

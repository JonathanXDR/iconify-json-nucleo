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

async function alreadyPublished(name: string, version: string): Promise<boolean> {
  const proc = Bun.spawn(['npm', 'view', `${name}@${version}`, 'version'], {
    stdout: 'pipe',
    stderr: 'ignore',
  });
  const output = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  return exitCode === 0 && output.trim() === version;
}

const failures: string[] = [];

for (const cwd of targets) {
  const pkg = await readPackageJson(join(cwd, 'package.json'));
  const id = `${pkg.name}@${pkg.version}`;
  if (await alreadyPublished(pkg.name, pkg.version)) {
    console.log(`Skipping ${id} (already published)`);
    continue;
  }

  console.log(`Publishing ${id}`);
  const proc = Bun.spawn(['npm', 'publish', '--access', 'public', '--provenance'], {
    cwd,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if ((await proc.exited) === 0) {
    continue;
  }

  // A non-zero exit can mean the version already exists (a flaky `npm view`
  // returned a false negative above) or a genuine error. Re-check so a real
  // conflict is treated as success and only true failures are collected.
  if (await alreadyPublished(pkg.name, pkg.version)) {
    console.log(`Skipping ${id} (already published)`);
    continue;
  }
  console.error(`Failed to publish ${id}`);
  failures.push(id);
}

if (failures.length > 0) {
  console.error(`publish: ${failures.length} of ${targets.length} package(s) failed`);
  console.error(`failed: ${failures.join(', ')}`);
  console.error('Re-run `bun run scripts/publish.ts` to retry the remaining packages.');
  process.exitCode = 1;
} else {
  console.log(`publish: all ${targets.length} package(s) are up to date`);
}

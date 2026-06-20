import { describe, expect, test } from 'bun:test';

const cli = new URL('../src/cli.ts', import.meta.url).pathname;

async function runCli(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn(['bun', cli, ...args], { stdout: 'pipe', stderr: 'pipe' });
  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { code, stdout, stderr };
}

describe('cli', () => {
  test('prints usage and the family list for --help', async () => {
    const { code, stdout } = await runCli(['--help']);

    expect(code).toBe(0);
    expect(stdout).toContain('Usage: iconify-json-nucleo-codegen build');
    expect(stdout).toContain('Families:');
    expect(stdout).toContain('core');
  });

  test('exits non-zero with a hint for an unknown family', async () => {
    const { code, stderr } = await runCli(['--family', 'does-not-exist']);

    expect(code).toBe(1);
    expect(stderr).toContain('Unknown family');
  });
});

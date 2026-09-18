import { defineConfig } from 'tsdown';

// fixedExtension is off because platform node would otherwise emit .mjs and .d.mts,
// while the exports map and bin point at the .js and .d.ts names
export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  platform: 'node',
  fixedExtension: false,
  dts: true,
  outDir: 'dist',
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  tsconfig: 'tsconfig.json',
  treeshake: true,
  minify: true,
  shims: true,
  dts: true,
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  noExternal: ['@event-recorder/server'],
  clean: true,
  tsconfig: 'tsconfig.json',
  treeshake: true,
  minify: true,
  shims: true,
  dts: true,
  onSuccess:
    'cpx "node_modules/@event-recorder/server/dist/public/**/*" dist/public',
});

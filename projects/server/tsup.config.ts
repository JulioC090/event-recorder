import { staticPath } from '@event-recorder/static';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  noExternal: ['@event-recorder/static'],
  tsconfig: 'tsconfig.json',
  clean: true,
  treeshake: true,
  minify: true,
  shims: true,
  dts: true,
  onSuccess: `cpx "${staticPath}/**/*" dist/public`,
});

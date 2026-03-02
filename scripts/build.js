#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const sharedOptions = {
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  packages: 'external', // Don't bundle node_modules
  sourcemap: true,
};

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  ...sharedOptions,
  entryPoints: [join(__dirname, '../src/index.ts')],
  outfile: join(__dirname, '../build/index.js'),
  banner: {
    js: '#!/usr/bin/env node\n',
  },
};

/** @type {import('esbuild').BuildOptions} */
const authBuildOptions = {
  ...sharedOptions,
  entryPoints: [join(__dirname, '../src/auth-server.ts')],
  outfile: join(__dirname, '../build/auth-server.js'),
};

if (isWatch) {
  const context = await esbuild.context(buildOptions);
  await context.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(buildOptions);
  await esbuild.build(authBuildOptions);

  // Make the file executable on non-Windows platforms
  if (process.platform !== 'win32') {
    const { chmod } = await import('fs/promises');
    await chmod(buildOptions.outfile, 0o755);
  }
} 
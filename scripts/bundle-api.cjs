const fs = require('fs');
const path = require('path');
const esbuild = require(path.join(__dirname, '../artifacts/api-server/node_modules/esbuild'));

const apiServerPackageJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../artifacts/api-server/package.json'),
    'utf8'
  )
);

const rootPackageJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../package.json'),
    'utf8'
  )
);

const dependencies = [
  ...Object.keys(apiServerPackageJson.dependencies || {}),
  ...Object.keys(apiServerPackageJson.devDependencies || {}),
  ...Object.keys(rootPackageJson.dependencies || {}),
  ...Object.keys(rootPackageJson.devDependencies || {})
];

const external = [...new Set(
  dependencies.filter(dep => !dep.startsWith('@workspace/'))
), 'pg-native'];

console.log('Bundling api/index.ts to api/index.js...');

esbuild.build({
  entryPoints: [path.join(__dirname, '../api/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: path.join(__dirname, '../api/index.js'),
  external: external,
  sourcemap: true,
}).then(() => {
  console.log('API bundled successfully!');
}).catch((err) => {
  console.error('API bundling failed:', err);
  process.exit(1);
});

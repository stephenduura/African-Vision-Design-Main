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

console.log('Bundling vercel-api/index.ts to api/index.js...');

// Ensure api directory exists
const apiDir = path.join(__dirname, '../api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

esbuild.build({
  entryPoints: [path.join(__dirname, '../vercel-api/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: path.join(__dirname, '../api/index.js'),
  external: external,
  sourcemap: true,
}).then(() => {
  // Write the catch-all file
  fs.writeFileSync(
    path.join(apiDir, '[...path].js'),
    'export { default } from "./index.js";\n',
    'utf8'
  );
  console.log('API bundled successfully!');
}).catch((err) => {
  console.error('API bundling failed:', err);
  process.exit(1);
});

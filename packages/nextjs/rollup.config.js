import resolve from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';
import path from 'path';
import fs from 'fs';
import clientComponentPlugin from '../../rollup-plugins/clientComponentPlugin';

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), './package.json')));
const distFolder = path.join(__dirname, './dist/');
const nodeModulesPath = path.join(__dirname, '../../node_modules', pkg.name);

function movePackageJson() {
  return {
    name: 'move-package-json',
    buildEnd() {
      let enhancedPkg = pkg;
      enhancedPkg.main = enhancedPkg.main.replace('dist/', '');
      if (enhancedPkg.module) {
        enhancedPkg.module = enhancedPkg.module.replace('dist/', '');
      }
      enhancedPkg.types = enhancedPkg.types.replace('dist/', '');
      fs.mkdirSync(distFolder, { recursive: true });
      fs.writeFileSync(path.join(distFolder, 'package.json'), JSON.stringify(enhancedPkg, null, 2), {
        encoding: 'utf8',
      });
      fs.rmSync(nodeModulesPath, { recursive: true });
      fs.symlinkSync(distFolder, nodeModulesPath, 'dir');
    },
  };
}

const plugins = [
  resolve({
    browser: false,
    preferBuiltins: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  }),
  movePackageJson(),
  ts({
    tsconfig: `${__dirname}/tsconfig.json`,
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration: true,
        declarationDir: distFolder,
        target: 'ES5',
        module: 'ES6',
      },
    },
  }),
  clientComponentPlugin(),
];

const internalFiles = [];
function throughDirectory(directory) {
  fs.readdirSync(directory).forEach((File) => {
    const absolute = path.join(directory, File);
    if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
    else {
      const fileName = absolute.split('/').pop().split('.')[0];
      return internalFiles.push(fileName);
    }
  });
}

throughDirectory('./src');
const isExternal = (filePath) => {
  return !internalFiles.some((fileName) => filePath.includes(fileName));
};

export default [
  {
    input: {
      index: './src/index.ts',
      'server/index': './src/server/index.ts',
      'client/index': './src/client/index.ts',
      'common/index': './src/common/index.ts',
      'provider/index': './src/provider/index.ts',
    },
    plugins,
    external: isExternal,
    output: {
      dir: distFolder,
      sourcemap: true,
      format: 'esm',
    },
  },
];

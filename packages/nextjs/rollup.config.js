import resolve from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';
import path from 'path';
import clientComponentPlugin from '../../scripts/rollup-plugins/clientComponentPlugin';
import movePackageJsonPlugin from '../../scripts/rollup-plugins/movePackageJsonPlugin';
import getDirectoryFileNames from '../../scripts/getDirectoryFileNames';

const distFolder = path.join(__dirname, './dist/');

const plugins = [
  resolve({
    browser: false,
    preferBuiltins: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  }),
  movePackageJsonPlugin(distFolder),
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

const internalFiles = getDirectoryFileNames('./src');
const isExternal = (filePath) => !internalFiles.some((fileName) => filePath.includes(fileName));

export default [
  {
    input: {
      index: './src/index.ts',
      'server/index': './src/server/index.ts',
      'client/index': './src/client/index.ts',
      'common/index': './src/common/index.ts',
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

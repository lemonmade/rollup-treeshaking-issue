import {default as commonjs} from '@rollup/plugin-commonjs';
import {default as nodeResolve} from '@rollup/plugin-node-resolve';
import {default as babel} from '@rollup/plugin-babel';

const ENTRY_PREFIX = '__magic__/entry';
const MAGIC_MODULE_WORKER = '__magic__/worker';

export default {
  input: [`${ENTRY_PREFIX}/my-module`],
  output: {
    dir: './build',
    format: 'iife',
    inlineDynamicImports: true,
  },
  plugins: [
    {
      name: 'magic-modules',
      async resolveId(source) {
        if (source.startsWith(ENTRY_PREFIX)) {
          return {id: source, moduleSideEffects: 'no-treeshake'};
        }

        if (source === MAGIC_MODULE_WORKER) {
          const resolved = await this.resolve('./sandbox', null, {skipSelf: true});
          return {id: resolved.id, moduleSideEffects: 'no-treeshake'};
        }

        return null;
      },
      async load(id) {
        if (!id.startsWith(ENTRY_PREFIX)) return null;

        return `
          import * as Worker from ${JSON.stringify(MAGIC_MODULE_WORKER)};
          import {endpoint} from '@quilted/workers/worker';
          endpoint.expose(Worker);
        `;
      },
    },,
    nodeResolve({
      exportConditions: ['esnext', 'import', 'require', 'default'],
      extensions: ['.esnext', '.mjs', '.js', '.json'],
      preferBuiltins: true,
    }),
    commonjs(),
    babel({
      babelrc: false,
      configFile: false,
      extensions: ['.esnext'],
      sourceType: 'module',
      babelHelpers: 'bundled',
      targets: 'last 2 chrome versions',
      presets: ['@babel/preset-env'],
    }),
    babel({
      include: /\.esnext$/,
      // Allows node_modules
      exclude: [],
      babelrc: false,
      configFile: false,
      extensions: ['.esnext'],
      sourceType: 'module',
      babelHelpers: 'bundled',
      targets: 'last 2 chrome versions',
      presets: ['@babel/preset-env'],
    }),
  ],
};

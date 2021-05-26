import {default as commonjs} from '@rollup/plugin-commonjs';
import {default as nodeResolve} from '@rollup/plugin-node-resolve';

const MAGIC_ENTRY = '__magic__/entry';

export default {
  input: MAGIC_ENTRY,
  output: {
    dir: './build',
    format: 'iife',
    inlineDynamicImports: true,
  },
  plugins: [
    {
      name: 'magic-modules',
      async resolveId(source) {
        if (source === MAGIC_ENTRY) {
          return {id: source, moduleSideEffects: 'no-treeshake'};
        }

        return null;
      },
      async load(id) {
        if (id !== MAGIC_ENTRY) return null;

        return `
          import {createRemoteRoot} from '@remote-ui/core';
          createRemoteRoot();
        `;
      },
    },
    nodeResolve(),
    commonjs(),
  ],
};

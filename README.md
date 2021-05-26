# Rollup issue with `inlineDynamicImports: true` and `moduleSideEffects: 'no-treeshake'`

To see the error, run `yarn install && yarn build`. Note that removing either the `inlineDynamicImports` or `moduleSideEffects` options in `rollup.config.js` resolves the error.

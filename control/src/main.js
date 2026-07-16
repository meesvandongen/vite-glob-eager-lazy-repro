import { metas } from './metas.js';

// Nothing in this project ever globs posts/*.js lazily, so Rollup/Rolldown
// can (and does) tree-shake away each post's large `default` export
// entirely. Compare this build's output size against ../bug.
console.log('metas (expected to be cheap):', metas);

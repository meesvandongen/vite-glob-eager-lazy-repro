import { metas } from './metas.js';

// This is the only thing this entry point actually needs: cheap metadata.
console.log('metas (expected to be cheap):', metas);

// Simulates "navigating to an article": some OTHER part of the app lazily
// loads the full post module. This import is never reached at runtime here
// (it's dynamic and behind nothing calling it), but its mere *presence*
// elsewhere in the module graph is enough to make Vite/Rollup bundle the
// full posts/*.js modules (including the large `default` export) into the
// chunk that metas.js eagerly pulls in — see build output size comparison
// against ../control.
import('./articles.js').then(({ articles }) => {
  const loadFirst = Object.values(articles)[0];
  loadFirst().then((mod) => console.log(mod.default()));
});

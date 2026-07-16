import { metas } from './metas.js';

console.log('metas (expected to be cheap):', metas);

import('./articles.js').then(({ articles }) => {
  const loadFirst = Object.values(articles)[0];
  loadFirst().then((mod) => console.log(mod.default()));
});

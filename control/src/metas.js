// "Cheap" glob: only pulls in the small `frontmatter` named export of every
// post, eagerly. Note there is no lazy/`articles.js`-style glob anywhere in
// this project — that's the whole point of this control case.
export const metas = import.meta.glob('./posts/*.js', {
  eager: true,
  import: 'frontmatter',
});

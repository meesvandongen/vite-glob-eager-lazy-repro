// "Cheap" glob: only pulls in the small `frontmatter` named export of every
// post, eagerly, e.g. for a nav sidebar that lists all posts by title.
export const metas = import.meta.glob('./posts/*.js', {
  eager: true,
  import: 'frontmatter',
});

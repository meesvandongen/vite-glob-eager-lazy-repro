export const metas = import.meta.glob('./posts/*.js', {
  eager: true,
  import: 'frontmatter',
});

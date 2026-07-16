// Identical to ../bug/src/posts/a.js — kept side-by-side per project so each
// folder is a fully self-contained, independently runnable repro. Already a
// pure declaration with zero top-level side effects, by design.
export const frontmatter = { title: 'Post A' };

export default function render() {
  return '<article>' + 'Post A content. '.repeat(2000) + '</article>';
}

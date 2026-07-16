// Pretend this is a compiled component/article body — deliberately large
// (via repetition) to make the eager-chunk bloat obvious in the build
// output size, mirroring a real compiled-MDX-component scenario.
export const frontmatter = { title: 'Post A' };

export default function render() {
  return '<article>' + 'Post A content. '.repeat(2000) + '</article>';
}

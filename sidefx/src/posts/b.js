export const frontmatter = { title: 'Post B' };

export default function render() {
  return '<article>' + 'Post B content. '.repeat(2000) + '</article>';
}

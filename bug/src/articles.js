// "Full" glob: lazily loads the entire module (including the large `default`
// export) per post — e.g. only when actually navigating to that article.
export const articles = import.meta.glob('./posts/*.js');

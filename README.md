# `import.meta.glob` eager + lazy of the same files repro

Demonstrates: an **eager** `import.meta.glob(..., { eager: true, import: 'frontmatter' })`
that is only supposed to pull in a small named export does **not** stay cheap
if *any other file* in the project also globs the same paths **lazily**
(dynamic `import()`, no `eager`). The whole module — including code only used
by the lazy consumer — gets bundled into whatever chunk the eager glob
statically reaches.

This matches documented Rollup behavior (a single module cannot be split
across chunks — see
[rollup/rollup#3417](https://github.com/rollup/rollup/issues/3417)), but
`import.meta.glob`'s docs don't mention this interaction, and nothing warns
when it happens.

## Three self-contained projects

Each folder is an independent, fully self-contained Vite project (own
`package.json`/`vite.config.js`/`index.html`/`src`) — `cd` into any one of
them individually to run it.

- **`bug/`** — both an eager glob (`metas.js`) and a lazy glob
  (`articles.js`) target the same `src/posts/*.js` files. This is the buggy
  case: the eager chunk balloons.
- **`control/`** — only the eager glob exists; there is no lazy glob of
  `posts/*.js` anywhere in this project's module graph. This is the
  baseline showing correct tree-shaking.
- **`sidefx/`** — identical graph shape to `bug/`, but with every
  side-effect-detection lever cranked to maximum (`package.json`
  `"sideEffects": false` + Rollup/Rolldown's `treeshake.moduleSideEffects:
  false`). Shows the bloat is **not** a side-effect-detection issue.

## Reproduce

```sh
cd bug && npm install && npm run build
cd ../control && npm install && npm run build
cd ../sidefx && npm install && npm run build
```

Then compare the chunk containing `metas`:

```sh
grep -o "Post A content" bug/dist/assets/*.js          # matches
grep -o "Post A content" control/dist/assets/*.js      # no match
grep -o "Post A content" sidefx/dist/assets/*.js       # matches (unchanged by sideEffects flags)

ls -la bug/dist/assets/*.js control/dist/assets/*.js sidefx/dist/assets/*.js
diff bug/dist/assets/index-*.js sidefx/dist/assets/index-*.js  # identical output
```

## Expected

`control`'s chunk for `metas.js` should be tiny (just two small `frontmatter`
objects). Since nothing in that project's graph needs `posts/*.js`'s
`default` export, Rollup/Rolldown can (and does) tree-shake it away
entirely.

## Actual

`bug`'s equivalent chunk balloons to include the full `default` render
function's body (with the repeated "Post A content." string) for **every**
post — even though `main.js` itself never touches `default`, only
`articles.js` does, and only behind a dynamic import that's never even
called in this trimmed-down repro. `sidefx` produces a byte-for-byte
identical bundle to `bug`, proving side-effect annotations don't help.

## Verified on

- vite 8.1.5 (Rolldown-powered, `npm install` pulls latest matching
  `^8.0.14`): `bug/dist/assets/index-*.js` 2.61 kB (contains post content)
  vs. `control/dist/assets/index-*.js` 0.82 kB (does not). `sidefx`'s output
  is byte-for-byte identical to `bug`'s.
- vite 6.4.3 (classic Rollup): same outcome, ~2.58 kB vs. ~0.86 kB.

So this is not a Rolldown regression — it reproduces identically on both the
classic Rollup-based Vite and the newer Rolldown-based Vite — and it is not
a side-effect-detection gap either.

## Root cause

Rollup/Rolldown chunk at module granularity, not per-export. A module
cannot be split across two output chunks. If a static/eager importer needs
*any* export from a module, and a dynamic importer elsewhere needs the rest
of that same module, everything gets included in the eager chunk since it's
needed synchronously there. See the maintainer explanation in
[rollup/rollup#3417](https://github.com/rollup/rollup/issues/3417#issuecomment-596962109):

> you are statically importing a small export from a module and dynamically
> importing the remaining parts of the very same module. As Rollup cannot
> split a module, everything is included in the static import already.

True sub-module splitting is tracked as a separate, still-open, unresolved
feature request: [rollup/rollup#2512](https://github.com/rollup/rollup/issues/2512).

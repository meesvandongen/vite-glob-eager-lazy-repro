import { defineConfig } from 'vite';

// Identical entry point/graph shape as ../bug (both eager + lazy glob
// present), but with every side-effect-detection lever cranked to maximum:
// package.json already declares "sideEffects": false, and this additionally
// forces Rollup/Rolldown's own moduleSideEffects tree-shake option off, in
// case the eager-glob bloat were actually caused by overly conservative
// side-effect assumptions rather than the fundamental "one module can't be
// split across chunks" limitation.
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
      },
    },
  },
});

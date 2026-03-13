import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages expects assets to be served from the repo path.
// When published at https://jimpauly.github.io/paulies-prediction-partners/
// the base must match /paulies-prediction-partners/.
//
// We also output the built site into the repository root `docs/` folder
// so GitHub Pages can publish it directly from `main/docs`.
export default defineConfig({
  base: '/paulies-prediction-partners/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});

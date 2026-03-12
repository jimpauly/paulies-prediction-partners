import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
});

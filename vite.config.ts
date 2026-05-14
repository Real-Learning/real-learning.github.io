// vite.config.ts
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  base: '/',

  plugins: [
    injectHTML(), // to import other html files into index.html
  ],

  build: {
    outDir: 'dist', // for GitHub Pages
    manifest: true,
  },
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://trustora.net',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    format: 'directory',
  },
});

import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'middleware'
  }),

  build: {
    minify: true, // Untuk mengurangi ukuran output
    target: "esnext", // Menentukan target versi JavaScript
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
});
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO — remplacer par le domaine définitif avant la mise en ligne.
// Sert aux URLs canoniques, au sitemap et aux balises Open Graph.
const SITE = 'https://karim-rahmouni.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Le CSS du site tient largement sous le seuil où l'inlining reste
    // gagnant : on économise une requête bloquante sur chaque page.
    inlineStylesheets: 'always',
  },
});

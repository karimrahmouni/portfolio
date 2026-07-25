import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const travail = defineCollection({
  loader: glob({ base: './src/content/travail', pattern: '**/*.md' }),
  schema: z.object({
    titre: z.string(),
    secteur: z.string(),
    /** Cadre de la mission — jamais de nom de client. */
    contexte: z.string(),
    /** Deux phrases maximum, reprises sur la page d'accueil. */
    resume: z.string(),
    stack: z.array(z.string()),
    /** Ordre d'affichage, croissant. */
    ordre: z.number(),
    /** Meta description de la page dédiée. */
    description: z.string(),
  }),
});

export const collections = { travail };

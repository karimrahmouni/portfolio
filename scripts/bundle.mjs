/**
 * Produit le fichier final : un index.html autonome, à la racine du projet.
 *
 *   npm run bundle        (= astro build puis ce script)
 *
 * Le HTML issu du build contient déjà le CSS et le JavaScript en ligne.
 * Il ne reste qu'à embarquer les deux polices en base64 pour que le fichier
 * n'ait plus la moindre dépendance externe : double-clic et il s'ouvre,
 * y compris hors ligne, y compris déplacé seul sur une clé USB.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');

const POLICES = [
  '/fonts/geist-latin-wght-normal.woff2',
  '/fonts/geist-mono-latin-wght-normal.woff2',
];

let html = await readFile(join(racine, 'dist', 'index.html'), 'utf8');

// 1. Les polices deviennent des data-URI.
for (const chemin of POLICES) {
  const binaire = await readFile(join(racine, 'public', chemin));
  const dataUri = `data:font/woff2;base64,${binaire.toString('base64')}`;
  const avant = html.length;
  html = html.split(chemin).join(dataUri);
  if (html.length === avant) {
    throw new Error(`Police jamais référencée dans le HTML : ${chemin}`);
  }
}

// 2. Le préchargement de police n'a plus d'objet et provoquerait un 404.
html = html.replace(/<link\b[^>]*rel="preload"[^>]*>/g, '');

// 3. Idem pour le sitemap, qui n'existe pas à côté d'un fichier isolé.
html = html.replace(/<link\b[^>]*rel="sitemap"[^>]*>/g, '');

const sortie = join(racine, 'index.html');
await writeFile(sortie, html, 'utf8');

const { size } = await stat(sortie);
const reste = html.match(/(?:src|href)="\/(?!\/)[^"]*"/g) ?? [];

console.log(`index.html écrit — ${(size / 1024).toFixed(1)} Ko`);
console.log(
  reste.length
    ? `⚠ références externes restantes : ${[...new Set(reste)].join(', ')}`
    : 'aucune référence à un fichier externe'
);

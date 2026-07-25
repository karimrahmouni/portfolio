/**
 * Génère public/og.png (1200×630) — l'image affichée lors du partage du site
 * sur LinkedIn, Slack, WhatsApp ou X.
 *
 *   node scripts/og.mjs
 *
 * À relancer si le nom, le titre ou l'accent changent.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');

const FOND = '#0c0d0f';
const TEXTE = '#e8e8ea';
const TEXTE_2 = '#9a9ba3';
const TEXTE_3 = '#6a6b73';
const ACCENT = '#c8ff4d';
const TRAIT = '#2a2d33';

// Pile de polices système : Geist n'est pas installée sur la machine de rendu,
// on s'appuie donc sur une grotesque disponible partout.
const SANS = "Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "Consolas, DejaVu Sans Mono, Courier New, monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${FOND}"/>

  <circle cx="80" cy="82" r="7" fill="${ACCENT}"/>
  <text x="104" y="89" font-family="${MONO}" font-size="21" letter-spacing="3.2" fill="${TEXTE_3}">
    OUVERT AUX OPPORTUNITÉS
  </text>

  <text x="80" y="300" font-family="${SANS}" font-size="92" font-weight="600" letter-spacing="-3" fill="${TEXTE}">
    Karim Rahmouni
  </text>

  <text x="80" y="372" font-family="${SANS}" font-size="42" font-weight="400" letter-spacing="-1" fill="${TEXTE_2}">
    Développeur back-end .NET
  </text>

  <rect x="80" y="470" width="1040" height="1" fill="${TRAIT}"/>

  <text x="80" y="529" font-family="${MONO}" font-size="23" letter-spacing="1.6" fill="${TEXTE_3}">
    11 ANS D'EXPÉRIENCE
  </text>
  <text x="446" y="529" font-family="${MONO}" font-size="23" letter-spacing="1.6" fill="${TEXTE_3}">
    ASP.NET CORE / C# / AZURE
  </text>
  <text x="1120" y="529" text-anchor="end" font-family="${MONO}" font-size="23" letter-spacing="1.6" fill="${TEXTE_3}">
    CASABLANCA
  </text>
</svg>`;

await mkdir(join(racine, 'public'), { recursive: true });

await sharp(Buffer.from(svg), { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9, palette: true })
  .toFile(join(racine, 'public', 'og.png'));

console.log('public/og.png généré');

# Portfolio 2026 — Karim Rahmouni

Site portfolio nouvelle génération, 100 % statique (HTML / CSS / JavaScript), **zéro dépendance à installer**.

## Voir le site

Double-cliquez simplement sur `index.html` — il s'ouvre dans votre navigateur.

## Fonctionnalités

- 🌍 **Bilingue FR / EN** — bascule dans la barre de navigation, préférence mémorisée
- 🌗 **Thème sombre / clair** — toggle dans la nav, préférence mémorisée
- ✨ **Design immersif 2026** — canvas de particules réactif à la souris, grain photographique,
  curseur personnalisé, boutons magnétiques, cartes 3D avec reflet lumineux
- 🎬 **Animations au scroll** — titre animé lettre par lettre, révélations, compteurs,
  timeline qui se dessine, code C# qui s'écrit, barre de progression de lecture
- ♿ **Accessible** — respecte `prefers-reduced-motion`, navigation clavier, contrastes AA, ARIA
- 🚀 **Performance** — aucune librairie externe, SEO complet (Open Graph, JSON-LD schema.org)

## Structure

```
portfolio-2026/
├── index.html      → contenu du site (sections repérées par <!-- ===== ... ===== -->)
├── css/main.css    → design system (variables en haut : couleurs, thèmes)
├── js/i18n.js      → tous les textes FR et EN (dictionnaires)
├── js/main.js      → animations et interactions
└── docs/specs/     → document de design du projet
```

## Mettre en ligne (gratuit)

**Option 1 — Netlify (le plus simple) :**
1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glissez-déposez le dossier `portfolio-2026` entier
3. Votre site est en ligne en quelques secondes

**Option 2 — GitHub Pages :**
1. Créez un dépôt GitHub (ex. `portfolio`)
2. Envoyez-y le contenu du dossier `portfolio-2026`
3. Dans Settings → Pages, activez le déploiement depuis la branche `main`

## Personnaliser

- **Textes** : tout est dans `js/i18n.js` (clés FR et EN côte à côte)
- **Couleurs / thèmes** : variables en haut de `css/main.css` (`--accent`, `--bg`, …)
- **Sections** : structure dans `index.html`

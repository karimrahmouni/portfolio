# Portfolio 2026 — Design validé (24/07/2026)

## Objectif
Refonte du portfolio de Karim Rahmouni (développeur back-end .NET, Casablanca) au niveau
des meilleurs sites 2026, en conservant la simplicité de déploiement du site actuel.

## Décisions validées par Karim
- **Stack** : statique premium — HTML/CSS/JS pur, zéro dépendance, zéro build.
- **Langues** : FR (défaut) + EN, bascule dans la nav, préférence persistée (localStorage).
- **Style** : dark immersif premium par défaut + toggle clair/sombre persisté.
- **Contenu** : identique au site actuel (hero, à propos, compétences, expérience, projets, contact), traduit en anglais.

## Architecture
```
portfolio-2026/
├── index.html      → structure sémantique + attributs data-i18n
├── css/main.css    → design system (variables, thèmes, composants, responsive)
├── js/i18n.js      → dictionnaires FR/EN (window.I18N)
├── js/main.js      → i18n, thème, canvas, curseur, animations, nav
└── README.md       → déploiement et personnalisation
```

## Expérience
- Hero : titre XXL animé lettre par lettre, canvas de particules réactif à la souris,
  fenêtre de code C# avec révélation ligne par ligne.
- Scroll : révélations (IntersectionObserver), compteurs animés, scrollspy, barre de progression.
- Micro-interactions : curseur personnalisé (pointer: fine uniquement), boutons magnétiques,
  cartes tilt 3D avec reflet, marquee de technologies.
- Grain photographique subtil, halos lumineux, verre dépoli sur la nav.

## Qualité
- `prefers-reduced-motion` : toutes les animations JS désactivées, transitions réduites.
- Accessibilité : contrastes AA, ARIA, navigation clavier, skip-link.
- SEO : meta FR/EN, Open Graph, JSON-LD schema.org/Person.
- Performance : aucune librairie externe (hors Google Fonts), Lighthouse ~100 visé.

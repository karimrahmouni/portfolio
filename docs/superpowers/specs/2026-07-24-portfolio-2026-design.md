# Portfolio Karim Rahmouni — Refonte 2026

**Date** : 2026-07-24
**Statut** : validé, prêt pour la planification d'implémentation
**Dossier cible** : `D:\Karim\portfolio-2026` (le dossier `portfolio-v2` existant reste intact, en lecture seule)

---

## 1. Contexte

Le site actuel (`D:\Karim\portfolio-v2`) est un one-pager statique : `index.html` (25 Ko), `styles.css` (23 Ko), `script.js` (4,7 Ko), sans dépendance. Thème clair, accents indigo/cyan, six sections, animations de révélation au scroll, compteurs animés et effet de tilt 3D au survol.

Faiblesses identifiées à l'analyse :

- Projets décrits en deux lignes suivies d'une liste de technologies — indifférenciant pour un profil à 11 ans d'expérience
- Aucune donnée structurée (JSON-LD), pas d'image de partage OG, pas de sitemap ni de robots.txt
- Trois familles Google Fonts chargées en render-blocking
- Accessibilité non traitée : pas de lien d'évitement, focus peu visibles, contrastes non vérifiés
- Aucun lien sortant vérifiable (LinkedIn, GitHub), aucun CV téléchargeable
- Effet de tilt attaché à `mousemove` sans `requestAnimationFrame`

## 2. Objectif

**Décrocher un entretien pour un poste en CDI.** Le lecteur cible est un CTO, un lead technique ou un recruteur tech. La priorité n'est pas de démontrer l'étendue des technologies connues, mais la **qualité du raisonnement d'ingénierie**.

## 3. Décisions verrouillées

| Décision | Choix | Justification |
|---|---|---|
| Stack | Astro 5 + Tailwind 4 + TypeScript | Zéro JS par défaut, contenu en Markdown, i18n prêt sans refonte |
| Thème | **Sombre uniquement, sans bascule** | Une seule identité à travailler donc plus de soin par détail ; décision explicite de Karim |
| Direction artistique | **Editorial Engineering** | Typographie souveraine, un seul accent, aucun gradient |
| Animation d'intro | **Rideau typographique** | Cohérente avec la direction éditoriale |
| Projets | 2 études de cas longues + 4 cartes compactes | Le levier de différenciation principal |
| Langue | Français uniquement | Objectif CDI Maroc/France ; structure préparée (voir ci-dessous) |
| Blog | Hors périmètre | Aucun article existant ; un blog vide dessert |
| Formulaire de contact | Hors périmètre | Exigerait un service tiers sur un site statique, attire du spam |

**Ce que « structure préparée » signifie précisément** : aucune bibliothèque d'internationalisation n'est installée et aucune route `/en` n'est créée. La préparation se limite à deux choses — tout le contenu personnel réside dans `src/data/profil.ts` et les études de cas dans des fichiers Markdown, jamais en dur dans les composants. Ajouter l'anglais plus tard consistera donc à dupliquer ces sources et à activer le routage i18n natif d'Astro, sans toucher aux composants.

## 4. Contrainte éditoriale absolue

Karim n'a fourni **aucune métrique, aucun nom de client, aucun résultat chiffré** et a explicitement demandé de faire sans.

**Règle** : n'inventer aucun chiffre, aucun volume, aucun nom de client, aucun témoignage, aucun résultat quantifié. Les études de cas s'appuient exclusivement sur des éléments vérifiables : la stack réellement employée (documentée dans le site actuel), les contraintes objectives du secteur concerné, et les décisions d'architecture que cette stack implique nécessairement.

Formulations interdites : « réduction de X % », « N utilisateurs », « traitement divisé par N », toute affirmation de résultat non fournie par Karim.

Formulations autorisées : « le chiffrement au niveau colonne a été retenu pour les données de santé », « une file de messages découple le traitement des remboursements de la requête utilisateur » — des décisions techniques, pas des résultats.

## 5. Architecture technique

### 5.1 Arborescence

```
portfolio-2026/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── robots.txt
│   ├── og.png                    → image de partage 1200×630
│   └── fonts/                    → Geist Sans + Geist Mono, woff2 subset latin
├── src/
│   ├── data/
│   │   └── profil.ts             → source unique de vérité (identité, liens, stack, parcours)
│   ├── content/
│   │   ├── config.ts             → schéma Zod des études de cas
│   │   └── travail/
│   │       ├── assurance-sante.md
│   │       └── comparateur-bancaire.md
│   ├── components/
│   │   ├── Intro.astro           → rideau typographique
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── Axes.astro
│   │   ├── TravailListe.astro
│   │   ├── ProjetCarte.astro
│   │   ├── Parcours.astro
│   │   ├── Stack.astro
│   │   ├── Methode.astro
│   │   ├── Contact.astro
│   │   └── Pied.astro
│   ├── layouts/
│   │   ├── Base.astro            → head, métadonnées, JSON-LD, skip link
│   │   └── EtudeDeCas.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── travail/[slug].astro
│   │   ├── cv.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css            → tokens Tailwind 4, reset, styles d'impression
└── docs/superpowers/specs/
```

### 5.2 Principes de découpage

Chaque composant a une responsabilité unique et reçoit ses données en props depuis `profil.ts` ou une collection de contenu. Aucun composant ne lit directement le système de fichiers hors des pages. Aucun fichier de composant ne dépasse ~150 lignes ; au-delà, il est scindé.

`profil.ts` est la **seule** source des informations personnelles. Aucune donnée d'identité n'est écrite en dur dans un composant ou une page.

## 6. Système de design

### 6.1 Couleurs

Déclarées comme variables CSS dans `global.css`, exposées à Tailwind 4 via `@theme`.

| Token | Valeur | Usage |
|---|---|---|
| `--ink-950` | `#0C0D0F` | Fond de page |
| `--ink-900` | `#131417` | Surfaces, cartes |
| `--ink-800` | `#1E2025` | Bordures, séparateurs |
| `--ink-700` | `#2A2D33` | Bordures au survol |
| `--text` | `#E8E8EA` | Texte principal |
| `--text-2` | `#9A9BA3` | Texte secondaire |
| `--text-3` | `#6A6B73` | Texte tertiaire, labels |
| `--accent` | `#C8FF4D` | Accent unique |

**Règle d'usage de l'accent** : au maximum trois occurrences visibles par écran. Réservé au point de disponibilité, à l'état actif de navigation, et à un mot clé par section. Jamais de gradient, jamais de grande surface accentuée.

L'accent est une variable unique : basculer tout le site en ambre (`#FFB86B`) ne demande qu'une modification de ligne.

### 6.2 Typographie

- **Geist Sans** (variable) — titres et corps de texte
- **Geist Mono** (variable) — labels, métadonnées, tags techniques

Auto-hébergées en `woff2`, sous-ensemble latin, `font-display: swap`, la graisse utilisée au premier affichage est préchargée via `<link rel="preload">`. Aucun appel à Google Fonts.

Échelle typographique (`clamp()` pour la fluidité) : hero `clamp(2.75rem, 7vw, 5.25rem)` avec `letter-spacing: -0.035em` ; titres de section `clamp(1.75rem, 3.5vw, 2.5rem)` ; corps `1.0625rem` avec `line-height: 1.7`.

### 6.3 Mise en page

Conteneur : `max-width: 1120px`, gouttières de 24 px (20 px sous 640 px). Rythme vertical basé sur une échelle de 8 px. Espacement entre sections : `clamp(6rem, 12vw, 10rem)` — la générosité de l'espace blanc est un élément central de la direction éditoriale.

### 6.4 Mouvement

Courbe unique : `cubic-bezier(0.16, 1, 0.3, 1)`. Durées : 200 ms pour les micro-interactions, 700 ms pour les révélations, 850 ms pour le rideau d'intro.

Les révélations au scroll utilisent `IntersectionObserver` avec `translateY(16px)` → `0` et opacité `0` → `1`, décalage de 60 ms entre éléments d'un même groupe, et `unobserve` après déclenchement.

**L'effet de tilt 3D du site actuel est supprimé** : il contredit la sobriété de la direction éditoriale et coûte du JS sur `mousemove`. Il est remplacé par une transition de bordure et un léger déplacement vertical au survol.

Sous `prefers-reduced-motion: reduce` : aucune translation, aucune animation d'intro, seules les transitions d'opacité subsistent.

## 7. Animation d'intro — spécification

**Séquence** (durée totale ≈ 2,2 s) :

1. `0 → 0,85 s` — les 13 lettres de « KARIM RAHMOUNI » montent depuis un masque, décalage de 60 ms par lettre
2. `0,25 → 1,4 s` — un filet horizontal se trace de gauche à droite sous le nom
3. `1,75 → 2,6 s` — le voile plein écran se translate vers le haut (`translateY(-101%)`)
4. `2,15 s` — le hero apparaît en fondu ascendant

**Règles de comportement** :

- **Ne joue qu'à la première visite de la session** — clé `sessionStorage` `kr-intro-vue`
- **Ne joue jamais** sous `prefers-reduced-motion: reduce`
- **Passable au clic ou à la touche Échap** à tout moment
- **Nécessite JavaScript pour exister** : le voile est injecté par un script inline dans le `<head>`. Sans JS, aucun voile n'est rendu et la page s'affiche directement. Cela garantit qu'aucun visiteur ne peut se retrouver devant un écran bloqué.
- **Aucun impact SEO** : le contenu complet de la page est présent dans le HTML servi, derrière le voile
- **Gestion du focus** : pendant l'intro, `<body>` reçoit `overflow: hidden` ; à la fin, le focus est placé sur le `<h1>` du hero et le défilement est rétabli
- Le voile est retiré du DOM à la fin de l'animation

## 8. Structure de la page d'accueil

1. **Hero** — badge de disponibilité, titre, positionnement en deux phrases, deux appels à l'action (« Voir les études de cas », « Mon CV »)
2. **Ce que je fais** — trois axes : *concevoir des systèmes transactionnels*, *sécuriser des données sensibles*, *encadrer une équipe et tenir la production*
3. **Travail** — les 2 études de cas en grand format, puis les 4 autres projets en cartes compactes
4. **Parcours** — timeline : Brightdev (janv. 2023 → aujourd'hui), Devaxy (2015 → déc. 2022), Devame (juil. 2014 → janv. 2015), puis formation (Licence informatique 2016, ISGI 2014, Baccalauréat scientifique 2012)
5. **Stack** — regroupée **par rôle dans le système**, non par ordre alphabétique :
   - *Ce qui reçoit* — ASP.NET Core, Web API, MVC, JWT, OAuth
   - *Ce qui traite* — C#, MediatR, MassTransit, RabbitMQ, Azure Service Bus, Hangfire
   - *Ce qui stocke* — SQL Server, SQL Azure, Entity Framework, chiffrement de colonnes, Elasticsearch
   - *Ce qui déploie et surveille* — Azure DevOps, Azure Pipelines, Docker, Git, Serilog, NUnit
6. **Ma façon de travailler** — le flux de développement assisté par IA (Claude Code), présenté comme un argument différenciant et non comme une ligne de compétence : ce qui est délégué, ce qui reste validé humainement, et pourquoi
7. **Contact** — email `r.karim@devaxy.com`, téléphone `+212 664 149 624`, LinkedIn, GitHub, localisation Casablanca

## 9. Modèle de contenu des études de cas

Collection Astro `travail`, schéma Zod :

```ts
{
  titre: string
  secteur: string
  periode: string
  resume: string          // 2 phrases, affichées sur la home
  stack: string[]
  ordre: number
}
```

Chaque étude de cas suit quatre temps :

1. **Le contexte métier** — ce que le secteur impose structurellement
2. **Les contraintes** — réglementaires, techniques, d'intégration
3. **Les décisions d'architecture** — le *pourquoi* de chaque choix de la stack
4. **Les arbitrages assumés** — ce qui a été échangé contre quoi

Les deux études de cas retenues :

- `assurance-sante` — Gestion d'assurances maladie (ASP.NET Core, API REST, JWT, MediatR, EF Core, NUnit, Azure Service Bus)
- `comparateur-bancaire` — Comparateur de banques marocaines (ASP.NET MVC 5, NUnit, MassTransit, Reporting, OAuth)

Les quatre projets en cartes compactes : parapharmacie en ligne, boutique de T-shirts personnalisés, comparateur de prix d'essence, plateforme de conseil immobilier.

## 10. Page CV imprimable (`/cv`)

Mise en page dédiée à l'impression sur A4, en une à deux pages. Feuille de style `@media print` : fond blanc, texte noir, navigation et éléments décoratifs masqués, URLs des liens explicitées. À l'écran, la page reste dans le thème sombre du site.

Le visiteur fait `Ctrl+P` → « Enregistrer en PDF ». Le CV est donc toujours synchronisé avec le contenu du site, sans fichier PDF à maintenir.

## 11. Accessibilité

- Lien d'évitement vers le contenu principal en première position tabulable
- Contour de focus visible sur tout élément interactif : `outline: 2px solid var(--accent); outline-offset: 3px`
- Contrastes vérifiés au niveau AA (4,5:1 minimum pour le texte, 3:1 pour les éléments d'interface) — chaque paire couleur de texte / fond est contrôlée avant livraison
- Navigation clavier complète, menu mobile inclus (piège de focus lorsqu'il est ouvert, fermeture à Échap)
- Hiérarchie de titres cohérente, un seul `<h1>` par page
- Attributs `aria-current="page"` sur la navigation, `aria-expanded` sur le bouton de menu
- Éléments décoratifs marqués `aria-hidden="true"`
- Aucune information transmise par la seule couleur

## 12. Performance — budgets

| Métrique | Budget |
|---|---|
| JavaScript total (gzip) | < 8 Ko |
| CSS total (gzip) | < 20 Ko |
| Polices | 2 fichiers woff2, sous-ensemble latin |
| CLS | 0 |
| Lighthouse | cible 100 sur les quatre axes ; seuil d'acceptation 98 (section 15) |

Moyens : Astro n'envoie aucun JS de framework ; les images éventuelles passent par `astro:assets` (AVIF/WebP, dimensions explicites) ; le CSS critique est inliné par Astro ; les polices sont préchargées.

## 13. SEO et partage

- `<title>` et `<meta description>` uniques par page
- JSON-LD `Person` (nom, intitulé de poste, email, adresse, `sameAs` vers LinkedIn et GitHub) sur la page d'accueil
- Balises Open Graph et Twitter Card complètes, avec `og:image` — **absente du site actuel**
- `sitemap.xml` généré via `@astrojs/sitemap`, `robots.txt` statique
- URLs canoniques
- `lang="fr"` sur `<html>`

## 14. Données manquantes

Karim n'a fourni ni URLs de profils, ni photo, ni métriques. Ces éléments sont centralisés dans `src/data/profil.ts` avec des commentaires `TODO` explicites :

```ts
liens: {
  linkedin: '', // TODO — URL du profil LinkedIn
  github:   '', // TODO — URL du profil GitHub
}
```

Comportement en l'absence de valeur : **le lien n'est pas rendu du tout**. Aucun lien mort, aucun `href="#"` ne doit apparaître sur le site livré.

Le design fonctionne sans photo — la direction éditoriale repose sur la typographie. Un emplacement est prévu mais n'est pas requis.

## 15. Critères d'acceptation

1. `npm run build` réussit sans avertissement
2. Lighthouse ≥ 98 sur les quatre axes sur la page d'accueil et sur une étude de cas, en build de production
3. JS et CSS livrés sous les budgets de la section 12, mesurés sur le build
4. Aucun lien mort, aucun `href="#"`, aucun `TODO` visible sur le rendu
5. L'intro joue une fois, se laisse passer au clic et à Échap, ne rejoue pas au rechargement dans la même session, et ne joue pas sous `prefers-reduced-motion`
6. Site entièrement navigable au clavier, avec focus visible en permanence
7. Aucune métrique, aucun nom de client, aucun résultat chiffré non fourni par Karim n'apparaît dans le contenu
8. Rendu correct de 320 px à 2560 px de large
9. `/cv` imprime proprement sur une ou deux pages A4
10. Le dossier `D:\Karim\portfolio-v2` est inchangé

## 16. Hors périmètre

Blog · version anglaise · formulaire de contact · analytics · CMS · mode clair · effet de tilt 3D · animations au défilement de type parallaxe · WebGL et 3D.

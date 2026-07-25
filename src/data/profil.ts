/**
 * Source unique de vérité du site.
 *
 * Toutes les informations personnelles vivent ici — aucun composant, aucune
 * page ne doit contenir de donnée d'identité en dur. Modifier ce fichier
 * suffit à mettre le site entier à jour.
 *
 * Les champs marqués TODO sont vides volontairement : les éléments
 * correspondants ne sont pas rendus tant qu'ils ne sont pas renseignés,
 * afin de ne jamais produire de lien mort.
 */

export const identite = {
  prenom: 'Karim',
  nom: 'Rahmouni',
  nomComplet: 'Karim Rahmouni',
  initiales: 'KR',
  titre: 'Développeur back-end .NET',
  titreLong: 'Responsable de production & Développeur back-end .NET',
  employeurActuel: 'Brightdev',
  ville: 'Casablanca',
  pays: 'Maroc',
  disponible: true,
  mentionDisponibilite: 'Ouvert aux opportunités',
  anneesExperience: 11,
  debutCarriere: 2014,
} as const;

export const contact = {
  email: 'r.karim@devaxy.com',
  telephone: '+212 664 149 624',
  telephoneUri: '+212664149624',
  langues: 'Français · Anglais',
  mobilite: 'Mobile géographiquement · Permis B',
} as const;

/**
 * Liens sortants. Un lien vide n'est pas affiché du tout.
 * TODO — renseigner les deux URLs ci-dessous.
 */
export const liens: { linkedin: string; github: string } = {
  linkedin: '', // TODO — ex. https://www.linkedin.com/in/…
  github: '', // TODO — ex. https://github.com/…
};

/** Liens réellement affichables, dans l'ordre d'affichage. */
export const liensActifs = (
  [
    { cle: 'linkedin', libelle: 'LinkedIn', url: liens.linkedin },
    { cle: 'github', libelle: 'GitHub', url: liens.github },
  ] as const
).filter((l) => l.url.trim().length > 0);

/* ------------------------------------------------------------------ */

export const accroche = {
  /** Titre du hero, découpé pour permettre l'emphase typographique. */
  h1: ['Ingénieur back-end', 'qui livre en', 'production.'],
  /**
   * Deux phrases, pas plus. Le visiteur décide en cinq secondes s'il
   * continue — chaque mot doit porter.
   */
  paragraphe:
    "Onze ans à concevoir des systèmes .NET pour l'assurance, la banque et l'e-commerce. Du schéma de base de données au pipeline de déploiement, avec une exigence constante sur la sécurité des données.",
} as const;

export const axes = [
  {
    numero: '01',
    titre: 'Concevoir des systèmes transactionnels',
    texte:
      "Applications métier où une opération ne peut ni se perdre, ni s'exécuter deux fois. Architectures orientées messages, traitements asynchrones, découplage des tâches longues hors du cycle de requête.",
    motCle: 'transactionnels',
  },
  {
    numero: '02',
    titre: 'Sécuriser des données sensibles',
    texte:
      'Chiffrement des bases et des colonnes SQL Server pour la protection des données personnelles et de santé, dans le respect du RGPD et des exigences ISO 27001. La sécurité se conçoit au modèle de données, pas en couche finale.',
    motCle: 'sensibles',
  },
  {
    numero: '03',
    titre: 'Encadrer une équipe et tenir la production',
    texte:
      "Supervision d'une équipe de développement sans quitter le code. Intégration et déploiement continus, journalisation structurée, tests automatisés : ce qui part en production doit pouvoir être diagnostiqué.",
    motCle: 'production',
  },
] as const;

/* ------------------------------------------------------------------ */

export const parcours = [
  {
    debut: 'Janv. 2023',
    fin: "Aujourd'hui",
    actuel: true,
    poste: 'Responsable de production & Développeur back-end .NET',
    entreprise: 'Brightdev',
    lieu: 'Casablanca',
    points: [
      "Supervision et encadrement de l'équipe de développement",
      'Développement back-end : ASP.NET MVC, .NET Core, Web API, C#, TypeScript',
      "Réalisation de projets clients dans le domaine de l'assurance",
    ],
  },
  {
    debut: '2015',
    fin: 'Déc. 2022',
    actuel: false,
    poste: 'Développeur logiciel',
    entreprise: 'Devaxy',
    lieu: 'Casablanca',
    points: [
      "Conception et développement d'applications métier sur mesure",
      'Intervention sur tout le cycle : analyse, modélisation UML et bases de données, développement, tests, déploiement',
      'Projets pour les secteurs assurance, banque, e-commerce et immobilier',
    ],
  },
  {
    debut: 'Juil. 2014',
    fin: 'Janv. 2015',
    actuel: false,
    poste: 'Stagiaire développeur',
    entreprise: 'Devame',
    lieu: 'Casablanca',
    points: ['Premiers pas professionnels dans le développement web'],
  },
] as const;

export const formation = [
  {
    annee: '2016',
    intitule: 'Licence en informatique',
    etablissement: 'Faculté des Sciences Aïn Chock, Casablanca',
  },
  {
    annee: '2014',
    intitule: 'Diplôme ISGI',
    etablissement: 'ISGI Casablanca',
  },
  {
    annee: '2012',
    intitule: 'Baccalauréat scientifique',
    etablissement: 'Casablanca',
  },
] as const;

/* ------------------------------------------------------------------ */

/**
 * Stack regroupée par rôle dans le système, et non par ordre alphabétique.
 * Un lecteur technique lit une architecture, pas un inventaire.
 */
export const stack = [
  {
    role: 'Ce qui reçoit',
    precision: "Points d'entrée et contrôle d'accès",
    outils: ['ASP.NET Core', 'Web API', 'ASP.NET MVC', 'JWT', 'OAuth'],
  },
  {
    role: 'Ce qui traite',
    precision: 'Logique métier, découplage et tâches de fond',
    outils: [
      'C#',
      'MediatR',
      'MassTransit',
      'RabbitMQ',
      'Azure Service Bus',
      'Hangfire',
    ],
  },
  {
    role: 'Ce qui stocke',
    precision: 'Persistance, recherche et protection des données',
    outils: [
      'SQL Server',
      'SQL Azure',
      'Entity Framework',
      'Chiffrement de colonnes',
      'Elasticsearch',
    ],
  },
  {
    role: 'Ce qui déploie et surveille',
    precision: 'Mise en production et diagnostic',
    outils: [
      'Azure DevOps',
      'Azure Pipelines',
      'Docker',
      'Git',
      'Serilog',
      'NUnit',
    ],
  },
] as const;

/** Compétences complémentaires, affichées de façon discrète. */
export const complements = {
  langages: ['C#', 'TypeScript', 'JavaScript', 'SQL'],
  frontEnd: ['Kendo UI', 'Telerik UI', 'Knockout.js', 'jQuery'],
  conception: ['UML', 'Modélisation de données', 'Adobe XD'],
  conformite: ['RGPD', 'ISO 27001'],
} as const;

/* ------------------------------------------------------------------ */

/**
 * Projets présentés en cartes compactes.
 * Les deux études de cas longues vivent dans src/content/travail/.
 */
export const projets = [
  {
    titre: 'Parapharmacie en ligne',
    secteur: 'Santé · E-commerce',
    texte:
      "Plateforme e-commerce de produits parapharmaceutiques : catalogue, gestion des stocks, commandes et paiement en ligne. Les traitements longs — indexation du catalogue, notifications, préparation des commandes — sont sortis du cycle de requête et confiés à des files de messages.",
    stack: ['ASP.NET MVC 5', 'Entity Framework', 'Hangfire', 'RabbitMQ', 'OAuth', 'Telerik UI'],
  },
  {
    titre: 'Boutique de T-shirts personnalisés',
    secteur: 'E-commerce',
    texte:
      "Boutique en ligne dotée d'un configurateur visuel : chaque article est unique, ce qui interdit la gestion de stock classique et impose de tracer la personnalisation de bout en bout, du panier au bon de production.",
    stack: ['ASP.NET MVC 5', 'MassTransit', 'Azure Service Bus', 'OAuth', 'Reporting'],
  },
  {
    titre: 'Comparateur de prix de carburant',
    secteur: 'Données · API',
    texte:
      "Comparaison des prix du carburant au Maroc par région et par station. La donnée vient de sources externes hétérogènes : la collecte est planifiée en tâches de fond, isolée du service de consultation, et journalisée pour rester auditable.",
    stack: ['ASP.NET MVC 5', 'API temps réel', 'Hangfire', 'RabbitMQ', 'Serilog'],
  },
  {
    titre: 'Plateforme de conseil immobilier',
    secteur: 'Immobilier',
    texte:
      "CRM métier pour un cabinet de conseil : biens, clients et rendez-vous dans un même modèle relationnel, avec relances automatisées et interface de gestion dense pensée pour un usage quotidien intensif.",
    stack: ['ASP.NET MVC 5', 'Entity Framework', 'Hangfire', 'Telerik UI'],
  },
] as const;

/* ------------------------------------------------------------------ */

export const methode = {
  titre: "L'IA accélère, l'expérience arbitre",
  paragraphes: [
    "J'intègre les outils d'IA à mon flux de travail quotidien — Claude Code en particulier — pour la génération de code, la revue, l'écriture de tests, le refactoring et la documentation.",
    "Ce qui compte n'est pas de produire plus vite, mais de savoir ce qui mérite d'être relu. Une suggestion d'IA est une proposition, jamais une décision : les choix d'architecture, les limites de transaction, le modèle de données et tout ce qui touche aux données sensibles restent des décisions humaines, argumentées et testées.",
  ],
  points: [
    { titre: 'Délégué', texte: 'Code répétitif, échafaudage de tests, documentation, exploration de pistes' },
    { titre: 'Assisté', texte: 'Revue de code, détection de cas limites, refactoring à large portée' },
    { titre: 'Jamais délégué', texte: "Architecture, modèle de données, sécurité, arbitrages de production" },
  ],
} as const;

/* ------------------------------------------------------------------ */

export const navigation = [
  { libelle: 'Travail', href: '#travail' },
  { libelle: 'Parcours', href: '#parcours' },
  { libelle: 'Méthode', href: '#methode' },
  { libelle: 'CV', href: '#cv' },
] as const;

export const meta = {
  titreDefaut: `${identite.prenom} ${identite.nom} — Développeur back-end .NET`,
  descriptionDefaut:
    "Développeur back-end .NET à Casablanca, 11 ans d'expérience. ASP.NET Core, C#, architectures orientées messages et sécurisation de données sensibles pour l'assurance, la banque et l'e-commerce.",
} as const;

---
titre: 'Comparateur d’offres bancaires'
secteur: 'Banque · Fintech'
contexte: 'Projet client — sous-traitance, Maroc'
resume: "Comparaison d'offres bancaires — comptes, crédits, épargne — où la difficulté n'est pas d'afficher des produits mais de les rendre comparables sans les trahir."
stack:
  - 'ASP.NET MVC 5'
  - 'MassTransit'
  - 'NUnit'
  - 'OAuth'
  - 'SQL Server'
  - 'Reporting'
ordre: 2
description: "Étude de cas : conception d'un comparateur d'offres bancaires — normalisation de produits hétérogènes, moteur de comparaison testé unitairement, ingestion découplée par messagerie."
---

## Le contexte

Un comparateur bancaire paraît simple : une liste de produits, quelques filtres, un tableau. Ce n'est pas là que se situe le travail.

Un compte courant, un crédit à la consommation et un produit d'épargne ne partagent presque aucun attribut. Deux crédits proposés par deux banques différentes ne se comparent pas davantage : l'un annonce un taux hors assurance, l'autre l'inclut ; l'un facture des frais de dossier fixes, l'autre un pourcentage ; les durées, les conditions d'octroi et les pénalités de remboursement anticipé diffèrent.

Le problème central est un **problème de modélisation** : réduire des produits hétérogènes à un jeu d'attributs comparables sans produire une comparaison mensongère. Et un comparateur qui ment perd la seule chose qui le rend utile.

## Les contraintes

- **L'exactitude prime sur la fraîcheur.** Un taux erroné affiché engage la crédibilité du service. Mieux vaut une offre datée et signalée comme telle qu'une offre fausse.
- **Des sources hétérogènes et instables.** Les conditions publiées changent sans préavis, dans des formats qui ne sont pas conçus pour être consommés par une machine.
- **La comparabilité est une décision éditoriale.** Choisir les critères de comparaison, c'est déjà orienter le résultat. Ce choix devait être explicite, documenté et testable — pas enfoui dans une requête.
- **Un existant à respecter.** Le projet s'inscrivait dans une base ASP.NET MVC 5 déjà en service.

## Les décisions d'architecture

### Un modèle en deux couches : le produit et sa projection comparable

Plutôt que de forcer tous les produits dans une table unique aux colonnes majoritairement vides, chaque famille conserve sa représentation propre, et une **projection normalisée** est calculée pour la comparaison : coût total sur la durée, frais rapportés à une base commune, conditions d'éligibilité ramenées à un ensemble fini de critères.

La projection est dérivée, jamais saisie. Elle se recalcule quand les règles évoluent, et la donnée d'origine reste intacte — donc auditable. Quand un utilisateur conteste un classement, on peut remonter du résultat affiché jusqu'à la donnée source.

### Le moteur de comparaison est la partie testée en premier

Les règles de normalisation et de classement sont isolées dans un composant sans dépendance à la base ni au web, et couvertes par des tests **NUnit** : produits aux frais structurés différemment, durées non alignées, offres partiellement renseignées, cas d'égalité.

Ce choix vient d'un constat simple : sur ce type de service, les défauts ne se manifestent presque jamais par une erreur. Ils se manifestent par un classement plausible mais faux, que personne ne remarque. Seul un test qui encode le résultat attendu peut attraper cela.

### Séparer l'ingestion de la consultation

La mise à jour des offres est traitée en flux de messages via **MassTransit**, à l'écart du site. L'objectif n'est pas la performance mais l'**isolation des défaillances** : une source qui change de format, un import qui échoue à mi-parcours ou une reprise manuelle ne doivent jamais dégrader la consultation.

Une conséquence assumée en découle : les données affichées ne sont pas celles de l'instant, mais celles du dernier import validé. Ce décalage est rendu visible plutôt que masqué.

### Déléguer l'authentification

Les comptes utilisateurs passent par **OAuth**. Sur un service qui n'a aucune raison de détenir des mots de passe, la meilleure protection reste de ne pas les stocker. La gestion des identifiants, la réinitialisation et les exigences de robustesse relèvent alors du fournisseur d'identité.

### Le reporting comme sortie de première classe

Les restitutions — synthèses comparatives, exports — sont construites sur la projection normalisée, et non sur des requêtes ad hoc. Un chiffre affiché à l'écran et le même chiffre dans un export proviennent ainsi du même calcul.

## Les arbitrages assumés

**La normalisation efface de la nuance.** Ramener des offres à des critères communs perd nécessairement des particularités. Le parti pris a été d'assumer cette perte et de la compenser en affichant systématiquement les conditions détaillées à côté du résultat comparé, plutôt que de multiplier les critères jusqu'à rendre le comparateur illisible.

**La fraîcheur a été échangée contre la fiabilité.** Une collecte plus fréquente aurait rapproché les données du temps réel, au prix d'un risque accru d'ingérer une source mal formée. Le choix a été de valider avant de publier.

**Rester sur MVC 5.** Une réécriture vers .NET Core aurait été plus confortable techniquement, mais aurait consommé le budget du projet sans bénéfice fonctionnel pour l'utilisateur. L'effort a été porté sur l'isolation du moteur de comparaison — la partie qui, elle, devait durer et pouvoir migrer plus tard sans être réécrite.

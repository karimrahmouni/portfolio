---
titre: "Digitalisation de la gestion d'assurance santé"
secteur: 'Assurance'
contexte: 'Projet client — courtier en assurance santé, Maroc'
resume: "Contrats et remboursements d'un courtier en assurance santé, refondus autour d'une API .NET Core et d'un traitement asynchrone. Des données de santé, donc une conception guidée par la confidentialité avant tout."
stack:
  - 'ASP.NET Core'
  - 'API REST'
  - 'JWT'
  - 'MediatR'
  - 'EF Core'
  - 'Azure Service Bus'
  - 'NUnit'
  - 'SQL Server'
ordre: 1
description: "Étude de cas : architecture d'un système de gestion de contrats et de remboursements en assurance santé — CQRS avec MediatR, découplage par file de messages, chiffrement des données de santé."
---

## Le contexte

Un courtier en assurance santé vit de deux flux : la **souscription**, qui crée et fait évoluer des contrats, et le **remboursement**, qui transforme un justificatif de soin en versement. Les deux obéissent à des logiques opposées.

La souscription est lente, rare par assuré, et fortement conditionnelle : garanties, exclusions, plafonds, périodes de carence, ayants droit. C'est un empilement de règles qui change chaque année.

Le remboursement est fréquent, répétitif, et dépend de tiers que l'on ne contrôle pas — assureurs, gestionnaires, plateformes de tiers payant. Il ne peut ni se perdre, ni se dupliquer : un remboursement versé deux fois est un incident financier, un remboursement perdu est un incident client.

Concevoir un seul système pour ces deux régimes est l'essentiel du problème.

## Les contraintes

- **Des données de catégorie particulière.** Un justificatif de soin révèle une pathologie. Le RGPD range ces données parmi celles dont la divulgation cause un préjudice irréversible, et le référentiel ISO 27001 impose d'en démontrer la protection, pas seulement de l'affirmer.
- **Des dépendances externes non maîtrisées.** Les échanges avec les tiers subissent leurs propres indisponibilités, leurs formats et leurs fenêtres de traitement.
- **Une traçabilité opposable.** Chaque décision de remboursement doit pouvoir être reconstituée a posteriori : quelle règle, quelle version, quelles données.
- **Un métier qui bouge.** Les barèmes et garanties évoluent au rythme des avenants. Le code doit absorber ces changements sans réécriture.

## Les décisions d'architecture

### Un cas d'usage, un handler

Le domaine est un empilement de règles, et la manière la plus sûre de le rendre ingérable est de les regrouper dans des services transverses qui grossissent jusqu'à ce que plus personne n'ose y toucher.

**MediatR** structure le système autour d'un handler par cas d'usage : `SoumettreDemandeRemboursement`, `ValiderGaranties`, `CalculerPriseEnCharge`. Chaque règle métier a une adresse unique dans le code. Quand un avenant modifie un plafond, on sait exactement où intervenir, et le test qui couvre ce cas est au même endroit.

Le pipeline de MediatR porte ce qui est transverse — validation des entrées, journalisation corrélée, limites de transaction — sans que chaque handler ait à s'en préoccuper.

### Découpler le remboursement de la requête utilisateur

Traiter un remboursement de bout en bout pendant que l'utilisateur attend revient à **indexer la disponibilité du service sur celle des tiers**. Un partenaire lent rend l'application lente ; un partenaire en panne rend l'application en panne.

**Azure Service Bus** coupe ce lien. La demande est acceptée, persistée, puis publiée. Le traitement se déroule ensuite à son rythme : reprise automatique en cas d'échec, mise à l'écart des messages définitivement bloqués, absence de perte si un consommateur redémarre.

Cette bascule impose une exigence dont tout dépend : **l'idempotence**. Un message peut être livré plus d'une fois, donc chaque étape est conçue pour qu'un rejeu produise exactement le même état. Sans cette propriété, la file transforme un incident réseau en double versement.

### Chiffrer au niveau de la colonne, pas de l'application

La protection est portée par la base : les colonnes contenant des données de santé sont **chiffrées au niveau colonne dans SQL Server**, en complément du chiffrement du support.

Le raisonnement est un raisonnement de menace, pas de conformité. Une sauvegarde peut être copiée, un accès en lecture peut être accordé pour un diagnostic, un compte de service peut être compromis. Dans ces trois scénarios, un chiffrement porté par le code applicatif ne protège rien, parce que l'attaquant n'est jamais passé par le code. Placer la frontière au niveau de la donnée fait que lire la table ne suffit pas à lire les données.

### Une API avant une interface

Le système est exposé en **API REST authentifiée par JWT**. Les échanges avec les tiers, les traitements de fond et l'interface consomment le même contrat, et les règles de gestion ne peuvent pas se dupliquer silencieusement dans une couche de présentation.

### Tester ce qui coûte cher

Les tests **NUnit** ciblent en priorité le calcul de prise en charge et l'application des garanties. C'est l'endroit où une erreur ne provoque pas de plantage visible mais un versement faux — le type de défaut qu'un utilisateur ne signale que lorsqu'il est en sa défaveur.

## Les arbitrages assumés

**CQRS léger, sans event sourcing.** La séparation lecture/écriture apporte la clarté ; l'event sourcing y aurait ajouté une reconstitution parfaite de l'historique, au prix d'une complexité d'exploitation et de montée en compétence que le contexte ne justifiait pas. La traçabilité est assurée par une journalisation structurée et un historique métier explicite.

**Le chiffrement au niveau colonne coûte de la recherche.** Une colonne chiffrée ne se prête plus aux recherches partielles ni aux tris côté serveur. Les accès à ces données ont donc été restreints à des chemins connus, et les critères de recherche portés par des données non sensibles. C'est une contrainte acceptée : sur des données de santé, la commodité de requêtage ne pèse pas lourd face au risque.

**L'asynchrone déplace la difficulté vers l'observabilité.** Une chaîne découplée est plus robuste mais moins lisible : plus de pile d'appels unique pour comprendre un incident. La contrepartie est une journalisation corrélée de bout en bout — un identifiant unique suit la demande à travers toutes les étapes.

**Le JWT sans état complique la révocation.** Un jeton valide le reste jusqu'à son expiration. La durée de vie a donc été réduite, avec renouvellement, plutôt que de réintroduire une vérification en base à chaque appel qui aurait annulé le bénéfice du choix.

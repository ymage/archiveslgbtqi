# Documentation technique

Documentation du site du Centre Archives LGBTQI+ Paris. Le [README](../README.md) à la racine couvre l'installation, la configuration et le déploiement ; ce dossier couvre la conception.

| Document | Contenu |
|----------|---------|
| [architecture.md](./architecture.md) | Vue d'ensemble, flux de données, routes, modèle de contenu Sanity, mode brouillon, formulaires |
| [stack.md](./stack.md) | Pile technique et versions, dépendances retenues volontairement en arrière, dépendances inutilisées |
| [guidelines.md](./guidelines.md) | Conventions de code, tests, commits, changelog, sécurité |
| [known-issues.md](./known-issues.md) | Dette technique et incohérences constatées (code mort, configuration) |
| [adr/](./adr/) | Décisions d'architecture (ADR) |

## Maintenance

- Toute décision structurante (framework, hébergement, client de données, fournisseur d'e-mail…) donne lieu à un ADR : copier [adr/0000-template.md](./adr/0000-template.md), numéroter à la suite, ajouter la ligne à l'index ci-dessous.
- Un ADR accepté n'est jamais réécrit : on en crée un nouveau qui le remplace (`Remplacé par ADR-XXXX`).
- Mettre à jour `stack.md` à chaque montée de version majeure.

## Index des ADR

| N° | Titre | Statut |
|----|-------|--------|
| [0001](./adr/0001-nextjs-app-router-sanity.md) | Next.js (App Router) et Sanity comme socle | Accepté |
| [0002](./adr/0002-deux-clients-sanity.md) | Deux clients Sanity (navigateur / serveur) | Accepté |
| [0003](./adr/0003-mode-brouillon-et-jeton-de-lecture.md) | Mode brouillon, Presentation et jeton de lecture | Accepté |
| [0004](./adr/0004-docker-multi-stage-secrets-runtime.md) | Image Docker multi-stage, secrets au runtime | Accepté |
| [0005](./adr/0005-courriels-resend-brevo.md) | Resend (contact) et Brevo (newsletter) | Accepté |
| [0006](./adr/0006-tailwind-4-config-js.md) | Tailwind CSS 4 avec configuration JS conservée | Accepté |
| [0007](./adr/0007-strategie-de-tests.md) | Vitest (unitaire) et Playwright (e2e) | Accepté |
| [0008](./adr/0008-versions-figees-outillage.md) | Versions volontairement non-latest (ESLint, TypeScript, resolvers) | Accepté |
| [0009](./adr/0009-package-esm-et-changelog.md) | Package ESM, Conventional Commits et git-cliff | Accepté |

> Les ADR 0001 à 0009 ont été rédigés a posteriori (octobre 2026) à partir du code et de l'historique git ; les justifications reflètent ce que ces sources attestent.

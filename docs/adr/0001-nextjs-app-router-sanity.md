# ADR-0001 : Next.js (App Router) et Sanity comme socle

- **Statut** : Accepté (rétroactif)
- **Date** : 2026-10-25

## Contexte

Le site présente des pages éditoriales, un agenda, un blog et une liste des fonds, administrés par des non-développeurs. Il faut un CMS avec édition visuelle et un front rendu côté serveur.

## Décision

- Front : **Next.js** avec l'**App Router** (React Server Components), dossiers `app/(next)` (site) et `app/(sanity)` (Studio monté sur `/studio`).
- CMS : **Sanity**, Studio embarqué dans l'application via `next-sanity` (`NextStudio`).
- Contenu lu en **GROQ** (`sanity/lib/queries.ts`), types générés par `sanity typegen` (`sanity.types.ts`, `schema.json`, versionnés).
- Toutes les lectures du site passent par `sanityFetch` (`sanity/lib/fetch.ts`), avec `revalidate: 0` : pas de cache de données Next, les pages sont rendues à la demande (`ƒ` dans la sortie de `next build`).

## Conséquences

- Le contenu publié est visible immédiatement, au prix d'un appel Sanity par requête (atténué par `useCdn: true` en perspective `published`).
- `npm run build` exige `NEXT_PUBLIC_SANITY_PROJECT_ID` et `NEXT_PUBLIC_SANITY_DATASET` (assertion dans `sanity/lib/api.ts`) et un accès réseau à Sanity pour la collecte des données.
- Les types générés doivent être régénérés (`npm run typegen`, exécuté par `predev` et `prebuild`) à chaque modification de schéma ou de requête.

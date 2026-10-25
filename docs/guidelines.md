# Conventions de développement

## Principes

- Rester dans le périmètre de la demande ; ne pas toucher `CHANGELOG.md` (généré).
- Code en TypeScript `strict` ; textes d'interface et contenus en français.
- Préférer les Server Components ; `"use client"` seulement pour l'état, les effets, GSAP et le DOM.

## Organisation du code

- Composants du site : `app/(next)/components/<domaine>/`, un `index.ts` par dossier quand il y a des réexportations.
- Schémas Sanity : un fichier par type dans `sanity/schemas/{singletons,documents,contents,block}/`, enregistré dans `sanity.config.ts`.
- Requêtes GROQ : toutes dans `sanity/lib/queries.ts` (`groq` ou `/* groq */`), fragments partagés par bloc (`*Fields`).
- Alias d'import `@/` = racine du dépôt (`tsconfig.json`, `vitest.config.mts`).
- Tout accès au contenu passe par `sanityFetch` ; ne pas appeler `client.fetch` directement dans un composant (le retry et la perspective brouillon seraient contournés). Exceptions : `sitemap.ts` (published uniquement) et le Studio (`client.ts`).
- Ne jamais importer `sanity/lib/server-client.ts` ni `token.ts` depuis du code navigateur.

## Types

- Après tout changement de schéma ou de requête : `npm run typegen` et commiter `sanity.types.ts` et `schema.json`.
- Typer les résultats avec les `*QueryResult` générés plutôt que d'écrire des types à la main ni `any` (plusieurs `as any` existent dans `[slug]/page.tsx` : ne pas en ajouter).

## Style

- Tailwind : utilitaires dans le JSX ; les motifs répétés vont dans `@layer components` de `app/globals.css`. Identifiants de thème en ASCII uniquement.
- Prettier + `prettier-plugin-tailwindcss` (`.prettierrc`) ; `npm run lint` doit passer sans erreur.
- Pas de configuration `.js` en CommonJS (package ESM, [ADR-0009](./adr/0009-package-esm-et-changelog.md)) ; un `export default` anonyme est refusé par ESLint : nommer la constante.
- Désactivation de règle ESLint : au plus près, commentée avec la raison.

## Next.js 16 / React 19

- `params`, `searchParams`, `cookies()`, `headers()` et `draftMode()` sont asynchrones : les `await`.
- Les Server Actions valident toujours leurs entrées avec Zod, côté serveur, même si le formulaire valide déjà côté client.

## Sécurité

- Aucun secret en `build-arg`, ni dans l'image, ni préfixé `NEXT_PUBLIC_`.
- Le jeton Sanity reste confiné à `token.ts` (`server-only`, taint).
- Ne pas renvoyer au client les erreurs de fournisseurs (Resend, Brevo) : journaliser côté serveur, répondre par un message générique.
- Champs de formulaires : longueurs plafonnées, pas de saut de ligne dans les champs destinés à un en-tête/sujet, champ leurre anti-bot.
- En-têtes de sécurité dans `next.config.js` ; toute nouvelle route hérite de `/:path*`.

## Tests

- `npm test` (Vitest) pour la logique pure, les schémas Zod, les handlers de route (axios mocké) et les composants ; fichiers dans `tests/unit/*.test.ts(x)`.
- `npm run test:e2e` (Playwright) : nécessite `NEXT_PUBLIC_SANITY_PROJECT_ID` et `NEXT_PUBLIC_SANITY_DATASET`.
- Tout correctif de bug ajoute un test qui échoue sans lui, quand c'est faisable.
- Avant de proposer une modification : `npx tsc --noEmit && npm run lint && npm test`.

## Git et versions

- Branches courtes dédiées (`chore/…`, `fix/…`, `docs/…`) fusionnées dans `main`.
- Commits : [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `build`), portée entre parenthèses (`fix(contact): …`).
- Les types exclus du changelog (`chore(cleanup)`, `chore(typo)`, `chore(version)`…) sont listés dans `cliff.toml`.
- Les versions sont créées par le script de release (non versionné) ; ne pas éditer `CHANGELOG.md` à la main.

## Documentation

- Décision structurante → nouvel ADR ([docs/README.md](./README.md#maintenance)).
- Nouvelle variable d'environnement → `README.md` (configuration) **et** `docs/architecture.md` (tableau des variables).
- Montée de version majeure → `docs/stack.md`.

# ADR-0007 : Vitest (unitaire) et Playwright (e2e)

- **Statut** : Accepté
- **Date** : 2026-10-25 (commit `9a31f25`)

## Contexte

Le projet n'avait aucun test.

## Décision

- **Vitest** + jsdom + Testing Library pour les tests unitaires, composants et handlers de route (`tests/unit/`, `npm test`). Alias `@` déclaré dans `vitest.config.mts`.
- **Playwright** (Chromium) pour un test de fumée e2e (`tests/e2e/`, `npm run test:e2e`) lançant `npm run build` puis `next start -p 3100`.
- `@vitejs/plugin-react` n'est pas utilisé (conflit de pairs babel) ; JSX géré par l'option `oxc.jsx` de Vite.

## Conséquences

- Les tests e2e exigent les variables Sanity et un accès réseau.
- Couverture volontairement ciblée : pas de test des requêtes GROQ, de la Server Action `sendEmail` ni du Studio. Pas d'exécution en CI.

# Points d'attention connus

Constats de la revue de documentation (2026-10-25). Le code mort et les dépendances inutilisées relevés lors de cette revue ont été supprimés dans la branche `chore/cleanup-dead-code` ; restent les points ci-dessous.

## Incohérences de configuration

- **Orthographe du schéma** : `contentModulde` (champ Sanity) — ne pas « corriger » sans migration des données.
- **`NEXT_PUBLIC_SITE_URL`** doit être une URL complète (`https://…`) ; aucune validation n'est faite.
- **`sitemap.ts`** : les routes statiques sont listées à la main (`/`, `/agenda`, `/blog`, `/contact`) ; une nouvelle route statique doit y être ajoutée.

## Qualité et outillage

- `build.yml` construit l'image sans lancer de tests ; `test.yml` (sur pull request) exécute lint, `tsc`, les tests et `npm audit --omit=dev --audit-level=critical`.
- `npm audit --omit=dev` : 19 avis (14 moderate, 5 high) au 2026-10-26, tous dans l'outillage Sanity Studio/CLI (`sanity`, `sanity-plugin-media`, `@sanity/vision`, `next-sanity`) ou le build Tailwind (`@tailwindcss/typography`). Aucun n'est atteignable par un visiteur et les « corrections » proposées par npm sont des rétrogradations majeures. À revoir à chaque mise à jour de `sanity`.
- La CSP est en mode `Report-Only` (`next.config.js`, hors `/studio`) : relever les violations dans la console, puis la passer en `Content-Security-Policy`.
- `experimental.taint` (Next) est une option expérimentale.
- Les tests ne couvrent ni les requêtes GROQ, ni le Studio.

# Points d'attention connus

Constats de la revue de documentation (2026-10-25). Le code mort et les dépendances inutilisées relevés lors de cette revue ont été supprimés dans la branche `chore/cleanup-dead-code` ; restent les points ci-dessous.

## Incohérences de configuration

- **Destinataire** du formulaire de contact codé en dur dans `app/(next)/_actions.ts`, avec un expéditeur `rencensement@…` (faute de frappe probable).
- **Orthographe du schéma** : `contentModulde` (champ Sanity) — ne pas « corriger » sans migration des données.
- **`NEXT_PUBLIC_SITE_URL`** doit être une URL complète (`https://…`) ; aucune validation n'est faite.
- **`sitemap.ts`** : les routes statiques sont listées à la main (`/`, `/agenda`, `/blog`, `/contact`) ; une nouvelle route statique doit y être ajoutée.

## Qualité et outillage

- La CI (`build.yml`) construit l'image mais n'exécute ni `npm run lint`, ni `npx tsc --noEmit`, ni `npm test`.
- `npm audit` : vulnérabilités dans des dépendances transitives (dont plusieurs « high ») au 2026-10-25.
- `experimental.taint` (Next) est une option expérimentale.
- `tsconfig.tsbuildinfo` est versionné.
- Les tests ne couvrent ni les requêtes GROQ, ni la Server Action `sendEmail`, ni le Studio.

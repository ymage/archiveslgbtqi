# ADR-0006 : Tailwind CSS 4 avec configuration JS conservée

- **Statut** : Accepté
- **Date** : 2026-10-25 (commit `5254457`)

## Contexte

La montée à Tailwind 4 change le moteur (PostCSS `@tailwindcss/postcss`, import CSS `@import "tailwindcss"`). Le thème du projet (polices, couleurs, animations, espacements) vit dans `tailwind.config.ts`.

## Décision

- `app/globals.css` : `@import "tailwindcss"; @config "../tailwind.config.ts";` — la configuration JS est conservée plutôt que migrée vers `@theme`, pour limiter le risque de régression visuelle.
- `postcss.config.js` n'utilise que `@tailwindcss/postcss` (autoprefixer retiré).
- Exception : la fonction d'accélération `tamisee` est déclarée en CSS (`@theme { --ease-tamisee: … }`) car Tailwind 4 rejette les identifiants non ASCII (`tamisitée` renommé).
- Utilitaires v3 renommés : `bg-opacity-N` → `bg-black/N`, `flex-grow` → `grow`, `backdrop-blur` → `backdrop-blur-sm`, bordure par défaut explicitée (`border-gray-200`).

## Conséquences

- Pas de vérification visuelle automatisée : la migration a été validée par compilation, pas par comparaison d'écrans.
- Les classes `@layer components` (`headerItem`, `heroTitle`…) restent définies dans `globals.css` via `@apply`.

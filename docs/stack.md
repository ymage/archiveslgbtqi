# Pile technique

Versions résolues au 2026-10-25 (`package.json` / `package-lock.json`). Node.js **24** (`mise.toml`, `node:24-alpine`).

## Exécution

| Domaine | Technologie | Version | Rôle |
|---------|-------------|---------|------|
| Framework | Next.js (App Router, Turbopack) | 16.4 | rendu serveur, routes, Server Actions |
| UI | React / React DOM | 19.3 | |
| CMS | Sanity + Studio | 6.20 | contenu, édition |
| Intégration CMS | next-sanity | 13.4 | clients, Studio, édition visuelle |
| Preview | @sanity/preview-url-secret | 4.1 | validation de l'URL de prévisualisation |
| Images CMS | @sanity/image-url | 2.1 | URL d'images |
| Style | Tailwind CSS + @tailwindcss/postcss | 4.3 | |
| Style | @tailwindcss/typography | 0.5 | |
| Animations | gsap, @gsap/react | 3.15 / 2.1 | |
| Formulaires | react-hook-form, @hookform/resolvers | 7.91 / 5.9 | |
| Validation | zod | 4.6 | formulaires, e-mail newsletter |
| Courriel | resend, react-email | 6.34 / 6.11 | contact (gabarit React) |
| HTTP | axios | 1.20 | appels Brevo |
| Réseau | cacheable-lookup | 7.0 | cache DNS du client serveur |
| Notifications | sonner | 2.0 | toasts |
| Utilitaires | clsx | 2.1 | composition de classes |
| Dates | date-fns | 4.4 | |
| Mesure | @vercel/speed-insights | 2.0 | |

Plugins du Studio : `@sanity/vision` (développement uniquement), `@sanity/code-input`, `@sanity/locale-fr-fr`, `sanity-plugin-media`, `sanity-plugin-asset-source-unsplash`.

## Outillage

| Outil | Version | Rôle |
|-------|---------|------|
| TypeScript | 6.0 | `strict`, `noEmit` |
| ESLint + eslint-config-next | 9.39 / 16.4 | flat config `eslint.config.mjs` (`npm run lint`) |
| Prettier + prettier-plugin-tailwindcss | 3.9 / 0.8 | formatage, tri des classes |
| Vitest, jsdom, Testing Library | 5.0 | tests unitaires |
| Playwright | 1.64 | tests e2e |
| Sanity typegen | (Sanity 6) | `sanity.types.ts`, `schema.json` |
| git-cliff | — | `CHANGELOG.md` |
| Docker, GitHub Actions, GHCR | — | build et publication |

Scripts : voir [README](../README.md#scripts-disponibles).

## Versions volontairement en retrait

Voir [ADR-0008](./adr/0008-versions-figees-outillage.md) : `eslint` 9 (10 existe), `typescript` 6 (7 existe), `@hookform/resolvers` 5 (6 existe).

## Dépendances à conserver sans import direct

| Paquet | Raison |
|--------|--------|
| `styled-components` | pair requis par le Studio Sanity |
| `sharp` | utilisé automatiquement par Next pour l'optimisation d'images |
| `@portabletext/react` | réexporté par `next-sanity`, importé depuis celui-ci (déclaré mais pas importé directement) |

Avant d'ajouter une dépendance, vérifier qu'elle n'est pas déjà couverte par une dépendance installée ; avant d'en supprimer une, rechercher ses imports dans `app/`, `sanity/` et les fichiers de configuration.

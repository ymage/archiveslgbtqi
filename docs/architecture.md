# Architecture

## Vue d'ensemble

Une seule application Next.js (App Router) héberge le site public et le Sanity Studio. Les données éditoriales sont dans Sanity ; l'application n'a pas de base de données propre.

```
Navigateur ──► Next.js (conteneur Node 24)
                 ├─ app/(next)   site public (Server Components)
                 ├─ app/(sanity) Studio sur /studio (statique, côté client)
                 ├─ app/api      /api/draft, /api/newsletter
                 └─ Server Action sendEmail
                        │               │                │
                        ▼               ▼                ▼
                  API Sanity       Resend (contact)  Brevo (newsletter)
                (CDN / live API)
```

## Arborescence

| Chemin | Rôle |
|--------|------|
| `app/(next)/` | Site public : `layout.tsx`, pages, `components/`, `emails/`, `lib/`, `utils/`, `fonts/` |
| `app/(sanity)/` | Layout du Studio, route `studio/[[...tool]]` (`force-static`), composants du Studio (`Logo`, `EnhancedNavbar`) |
| `app/api/` | `draft` (activation du mode brouillon), `newsletter` (inscription Brevo) |
| `sanity/lib/` | `api.ts` (env), clients, `fetch.ts`, `queries.ts` (GROQ), `token.ts`, `utils.ts` (image, href) |
| `sanity/schemas/` | Schémas : `singletons/`, `documents/`, `contents/`, `block/`, `utils/` |
| `sanity/plugins/` | Structure du Studio, singletons, champs à limite de caractères, AI Assist (désactivé) |
| `sanity.config.ts`, `sanity.cli.ts` | Configuration du Studio / de la CLI |
| `sanity.types.ts`, `schema.json` | Générés par `npm run typegen` — ne pas éditer à la main |
| `tests/` | `unit/` (Vitest), `e2e/` (Playwright) |
| `docker/` | `Dockerfile`, `docker-entrypoint.sh` |

## Routes

| Route | Source | Données |
|-------|--------|---------|
| `/` | `app/(next)/page.tsx` | `homepageQuery` |
| `/[slug]` | `[slug]/page.tsx` | `pagesContentQuery` + `lastEventQuery` ; 404 si la page n'existe pas |
| `/agenda` | `agenda/page.tsx` | `pastEventQuery`, `lastEventQuery` |
| `/blog` | `blog/page.tsx` | `blogsQuery` (5 dernières années) + `homepageQuery` |
| `/liste-des-fonds` | `liste-des-fonds/page.tsx` | `listeDeFondsQuery` |
| `/contact` | `contact/page.tsx` | — (formulaire) |
| `/studio/*` | `app/(sanity)/studio` | Studio |
| `/api/draft` | `app/api/draft/route.tsx` | active le mode brouillon |
| `/api/newsletter` | `app/api/newsletter/route.ts` | `POST` → Brevo |
| `/robots.txt`, `/sitemap.xml` | `robots.ts`, `sitemap.ts` | sitemap = pages Sanity (`pagesSlugQuery`) |

Le layout racine (`layout.tsx`) charge les polices locales (CityBurn, JetBrains Mono, Tanker), `Header`, `Footer`, `IntroAnimation`, `CookieBanner`, `ToastProviders` (sonner), `SpeedInsights` (Vercel), et, en mode brouillon, `BannerAlert` + `VisualEditing`.

## Flux de données

1. Un Server Component appelle `sanityFetch({ query, params })`.
2. `sanityFetch` détermine la perspective : `previewDrafts` si `draftMode()` est actif (jeton, API live, stega), sinon `published` (CDN). Voir [ADR-0003](./adr/0003-mode-brouillon-et-jeton-de-lecture.md).
3. L'appel passe par `fetchWithRetry` (3 tentatives, backoff exponentiel sur `EAI_AGAIN`, `ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`, `ECONNREFUSED`, `EPIPE`) et le client serveur ([ADR-0002](./adr/0002-deux-clients-sanity.md)).
4. Les réponses ne sont pas mises en cache par Next (`next: { revalidate: 0 }`).
5. Les types de résultat (`*QueryResult`) viennent de `sanity.types.ts`.

## Modèle de contenu (Sanity)

Types enregistrés dans `sanity.config.ts` :

- **Singletons** : `settings` (paramètres, navigation, pied de page), `homepage`. Le plugin `singletonPlugin` masque leur création et leurs actions de duplication/suppression.
- **Documents** : `pages` (pages libres, `slug`), `events` (agenda, `eventDate`), `blogs` (par `year`).
- **Contenus** : `content`, `listeDesFondsContent`.
- **Blocs** (modules d'une page) : `richtext`, `richTextAndTitle`, `single-image`, `multi-images`, `link`, `document-file`, `contact-form`, `lastEvent`, `creationArchives`, `custom-html`.

Une page (`pages`) contient des sections (`contentModulde` — orthographe du schéma, à conserver) composées de blocs ; `[slug]/page.tsx` associe chaque `_type` de bloc à un composant de `components/modules/` :

| `_type` | Composant |
|---------|-----------|
| `richtext` | `RichTextModule` |
| `richTextAndTitle` | `RichTextAndTitleModule` |
| `single-image` | `SingleImageModule` |
| `multi-images` | `MultiImagesModule` |
| `creationArchives` | `CreationArchivesModule` |
| `custom-html` | `CustomHtml` |
| `link` | `LinksModule` |
| `lastEvent` | `EventsModule` |
| `contact-form` | `FormSubmission` |
| `document-file` | `FileModule` |

Ajouter un bloc : créer le schéma dans `sanity/schemas/block/`, l'enregistrer dans `sanity.config.ts` **et** le masquer dans `sanity/plugins/structure.ts`, ajouter son fragment GROQ dans `queries.ts`, créer le module React, l'ajouter à la table de correspondance de `[slug]/page.tsx`, puis `npm run typegen`.

Le texte riche est rendu par `MyCustomPortableText` (Portable Text).

## Formulaires et courriels

- **Contact / proposition d'archive** : `components/ui/FormSubmission.tsx` (react-hook-form + `zodResolver`) → Server Action `sendEmail` (`_actions.ts`) → validation `ContactFormSchema` → Resend. Champ leurre `website` (anti-bot).
- **Newsletter** : `components/ui/NewsLetters.tsx` / `footer/FooterNewsletter.tsx` → `POST /api/newsletter` → Brevo. Voir [ADR-0005](./adr/0005-courriels-resend-brevo.md).

## Animations et interface

GSAP (`gsap`, `@gsap/react`) pour l'animation d'introduction, les transitions de navigation, les héros et le texte découpé ; Tailwind CSS 4 pour le style ([ADR-0006](./adr/0006-tailwind-4-config-js.md)) ; composants navigation mobile/desktop dans `components/header/`. Le site est en français (`<html lang="fr">`).

## Déploiement

Image Docker unique, publiée sur GHCR par GitHub Actions ; secrets au runtime. Voir [ADR-0004](./adr/0004-docker-multi-stage-secrets-runtime.md) et le [README](../README.md#build-docker).

## Variables d'environnement

| Variable | Moment | Obligatoire | Usage |
|----------|--------|-------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | build | oui | projet Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | build | oui | dataset |
| `NEXT_PUBLIC_SANITY_API_VERSION` | build | non (`2024-02-28`) | version d'API |
| `SANITY_API_READ_TOKEN` | runtime | pour la prévisualisation | brouillons, `/api/draft` |
| `RESEND_API_KEY` | runtime | pour le formulaire de contact | Resend |
| `BREVO_API_KEY`, `BREVO_LIST_ID` | runtime | pour la newsletter | Brevo |
| `BREVO_WELCOME_EMAIL_TEMPLATE_ID` | runtime | non | e-mail de bienvenue |
| `NEXT_PUBLIC_SITE_URL` | build/runtime | non | `robots.ts`, `sitemap.ts` (URL complète, défaut `http://localhost:3000`) |
| `HOST`, `PORT` | runtime | non | entrypoint Docker (`0.0.0.0`, `3000`) |
| `VERCEL_ENV` | runtime | non | active stega en préproduction Vercel |

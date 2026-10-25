# ADR-0003 : Mode brouillon, Presentation et jeton de lecture

- **Statut** : Accepté
- **Date** : 2026-05-25 (commits `aee1522`, `8b3b32d`)

## Contexte

Les éditeurs prévisualisent les brouillons depuis le Studio (Presentation tool). Cela exige un jeton de lecture Sanity, qui ne doit jamais atteindre le navigateur ni l'image Docker.

## Décision

- Le Studio active le mode brouillon via `/api/draft` (`validatePreviewUrl` + `draftMode().enable()`), route `force-dynamic`.
- Le layout monte `<VisualEditing />` (`next-sanity/visual-editing`) et `BannerAlert` uniquement quand `draftMode()` est actif.
- `sanityFetch` choisit la perspective `previewDrafts` (jeton, `useCdn: false`, stega actif) si le mode brouillon est actif, sinon `published`.
- `SANITY_API_READ_TOKEN` : lu paresseusement par `getToken()` (`sanity/lib/token.ts`, `server-only`), protégé par `experimental_taintUniqueValue` (`experimental.taint` dans `next.config.js`), fourni **au runtime uniquement** (jamais en `build-arg`).

## Conséquences

- L'application démarre sans jeton ; seule la prévisualisation échoue (`Missing SANITY_API_READ_TOKEN`).
- Depuis Next 15+, `draftMode()` est asynchrone : `sanityFetch` résout la perspective en début d'appel.

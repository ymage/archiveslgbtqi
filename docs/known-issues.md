# Points d'attention connus

Constats faits lors de la revue de documentation (2026-10-25). Aucun n'est corrigé ici ; chacun est une proposition de nettoyage.

## Code non référencé

| Élément | Constat |
|---------|---------|
| `sanity/lib/demo.ts` | importé nulle part |
| `app/(next)/lib/constants.ts` (`BASE_URL`) | importé nulle part ; de plus incohérent avec `NEXT_PUBLIC_SITE_URL` (cf. ci-dessous) |
| `app/(next)/utils/useScrollDirection.tsx` | importé nulle part |
| `addEntry` (`app/(next)/_actions.ts`) et `FormDataSchema` (`lib/schema.ts`) | `addEntry` n'est appelée nulle part ; `FormDataSchema` ne sert qu'à elle et aux tests |
| `sanity/schemas/documents/post.ts`, `author.ts` | non enregistrés dans `sanity.config.ts` ; référencés seulement par `sanity/plugins/assist.ts` |
| `sanity/plugins/assist.ts` | `assistWithPresets()` est commenté dans `sanity.config.ts` |
| `app/(sanity)/components/EnhancedNavbar.jsx` | seul usage : import dans `sanity.config.ts`, option `navbar` commentée |
| `resolveHref` (`sanity/lib/utils.ts`) | route `/posts/…` inexistante dans l'application |
| Blocs à retirer de la structure du Studio | `structure.ts` filtre `customExternalLink`, `creative-module`, `creativeCtas`… qui n'existent plus dans les schémas |
| Dépendances | voir [stack.md](./stack.md#dépendances-déclarées-mais-sans-import-direct) |

## Incohérences de configuration

- **`NEXT_PUBLIC_SITE_URL`** : `robots.ts` et `sitemap.ts` l'utilisent comme URL complète (`https://…`) ; `lib/constants.ts` y ajoute `https://`. Non documentée dans le README avant cette revue.
- **`sitemap.ts`** : déclare en dur la route `/about`, qui n'existe pas dans l'application, et omet `/agenda`, `/blog`, `/contact` et `/liste-des-fonds`.
- **`clsx`** importé mais non déclaré dans `package.json`.
- **Destinataire** du formulaire de contact codé en dur dans `_actions.ts`, avec un expéditeur `rencensement@…` (faute de frappe probable).
- **Orthographe du schéma** : `contentModulde` (champ Sanity) — ne pas « corriger » sans migration des données.

## Qualité et outillage

- La CI (`build.yml`) construit l'image mais n'exécute ni `npm run lint`, ni `npx tsc --noEmit`, ni `npm test`.
- `npm audit` : 19 vulnérabilités (5 hautes) dans des dépendances transitives au 2026-10-25.
- `experimental.taint` (Next) est une option expérimentale.
- `tsconfig.tsbuildinfo` est versionné.
- `app/(next)/page.tsx` importe `HeroCarousel`, `SecondSection`, `IntroTextAndNewsLetter` et `UpcomingEvents` sans les utiliser (JSX commenté) ; seul `Homepage` est rendu.

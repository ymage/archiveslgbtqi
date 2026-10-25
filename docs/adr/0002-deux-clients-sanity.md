# ADR-0002 : Deux clients Sanity (navigateur / serveur)

- **Statut** : Accepté
- **Date** : 2026-05-25 (commit `2fd1bec`)

## Contexte

Un client optimisé serveur (cache DNS via `cacheable-lookup` sur les agents `http`/`https` globaux) dépend de modules Node.js et ne peut pas être chargé dans le Studio, qui s'exécute dans le navigateur. Le cache DNS corrige des erreurs réseau transitoires (`EAI_AGAIN`…) côté serveur.

## Décision

- `sanity/lib/client.ts` : client `next-sanity` sans dépendance Node, utilisé par le Studio (`fetchYears` dans `sanity/schemas/utils/fetchYears.ts`).
- `sanity/lib/server-client.ts` : client avec `cacheable-lookup`, utilisé par `sanityFetch`, `sitemap.ts` et la route `/api/draft`.
- `sanityFetch` ajoute un retry à backoff exponentiel (3 tentatives, base 500 ms) sur les erreurs réseau transitoires.
- `server-client.ts` ne doit jamais être importé depuis du code exécuté dans le navigateur.

## Conséquences

- Duplication de la configuration `createClient` (stega, filtre sur `title`) entre les deux fichiers : toute évolution doit être appliquée aux deux.

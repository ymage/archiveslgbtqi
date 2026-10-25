# ADR-0008 : Versions volontairement non-latest

- **Statut** : Accepté
- **Date** : 2026-10-25 (commit `5254457`)

## Contexte

Lors de la mise à jour globale des dépendances, trois paquets n'ont pas pu être portés à leur dernière version majeure.

## Décision

| Paquet | Version retenue | Dernière | Raison |
|--------|-----------------|----------|--------|
| `eslint` | 9.x | 10.x | les plugins d'`eslint-config-next@16` déclarent un pair `eslint` ≤ 9 |
| `typescript` | 6.x | 7.x | `typescript-eslint` ne supporte pas TS 7 |
| `@hookform/resolvers` | 5.9.x | 6.0.0 | conflit de résolution npm (pair optionnel `effect@^4`) |

## Conséquences

- À réévaluer à chaque montée de `eslint-config-next`, `typescript-eslint` et `@hookform/resolvers` (`npm outdated`).
- `npm run typegen` utilise `sanity schema extract --force` (Sanity 6 refuse d'écraser `schema.json`).

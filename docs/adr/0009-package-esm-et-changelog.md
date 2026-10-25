# ADR-0009 : Package ESM, Conventional Commits et git-cliff

- **Statut** : Accepté
- **Date** : 2026-10-21 (`eeb4423`), 2026-10-25 (`348112b`)

## Contexte

Node signalait `MODULE_TYPELESS_PACKAGE_JSON` pour `tailwind.config.ts`. Par ailleurs, l'historique des versions est généré automatiquement.

## Décision

- `package.json` déclare `"type": "module"` ; `next.config.js` et `postcss.config.js` utilisent `export default` (pas de renommage en `.cjs`, le Dockerfile référence `next.config.js`).
- Messages de commit au format **Conventional Commits** ; `CHANGELOG.md` est généré par **git-cliff** (`cliff.toml`, URL du dépôt via `CHANGELOG_REPO_URL`, aucune requête distante). Les types `chore(cleanup)`, `chore(version)`… et les bots sont exclus du changelog et du calcul de version. En 0.x, un changement incompatible incrémente la version mineure.
- `CHANGELOG.md` n'est jamais modifié à la main.

## Conséquences

- Tout nouveau fichier de configuration `.js` doit être en ESM.
- Le script de release `tagme.sh` n'est pas versionné ; `.tagme-authors.json` en est la table de correspondance des auteurs.

# ADR-0004 : Image Docker multi-stage, secrets au runtime

- **Statut** : Accepté
- **Date** : 2026-05-24 → 2026-05-25 (commits `884d97e`, `92f22a7`, `ca6e4bd`, `b5c3969`, `fe3cc97`)

## Contexte

Le déploiement se fait par conteneur. Le build ne doit pas dépendre de l'environnement local et ne doit embarquer aucun secret.

## Décision

- `docker/Dockerfile` en 3 étapes (`deps` → `builder` → runtime) sur `node:24-alpine`, aligné avec `mise.toml` (Node 24).
- Build-args limités à `NEXT_PUBLIC_SANITY_DATASET` et `NEXT_PUBLIC_SANITY_PROJECT_ID` (intégrés au bundle). Tous les secrets (`SANITY_API_READ_TOKEN`, `RESEND_API_KEY`, `BREVO_*`) sont fournis au runtime.
- `npm prune --omit=dev` puis copie de `.next`, `node_modules` et `next.config.js` dans l'image finale.
- Utilisateur non-root `app` (UID/GID 10001), `HOST`/`PORT` lus par `docker/docker-entrypoint.sh` (`npx next start`).
- CI GitHub Actions (`.github/workflows/build.yml`) : build multi-arch sur `main` et sur les tags `v*` ; push GHCR, attestation de provenance et purge des anciennes images **uniquement pour les tags**.
- En-têtes de sécurité (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) définis dans `next.config.js`.

## Conséquences

- `next.config.js` doit conserver ce nom (copié explicitement par le Dockerfile).
- Le build d'image sur `main` valide la compilation sans publier.
- La CI ne lance ni lint, ni tests (voir [known-issues.md](../known-issues.md)).

# Archives LGBTQI+ Paris

![Centre Archives LGBTQI+ Paris](https://cdn.sanity.io/images/znvbuf2x/production/52a0a6c70950f9d98f6d5262b2d0d5a7ef54a1bd-751x529.png)

Site web du Centre Archives LGBTQI+ Paris, développé avec [Next.js](https://nextjs.org/) et [Sanity CMS](https://www.sanity.io/).

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **CMS** : Sanity v3
- **Styling** : Tailwind CSS
- **Animations** : GSAP, Lenis (smooth scroll)
- **Emails** : Resend, Nodemailer, Brevo (newsletter)
- **Déploiement** : Docker, GitHub Container Registry

## Prérequis

- Node.js 20.x
- npm
- Un projet Sanity avec les variables d'environnement configurées

## Installation

```bash
npm clean-install
```

## Configuration

Créer un fichier `.env` à la racine avec les variables suivantes :

### Variables de build (requis pour `npm run build` et le build Docker)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-28
SANITY_API_READ_TOKEN=votre-token
```

### Variables d'exécution (requis au démarrage du conteneur)

```env
RESEND_API_KEY=votre-cle-resend
BREVO_API_KEY=votre-cle-brevo
BREVO_LIST_ID=votre-list-id
BREVO_WELCOME_EMAIL_TEMPLATE_ID=votre-template-id
```

> **Note** : les variables `NEXT_PUBLIC_SANITY_*` et `SANITY_API_READ_TOKEN` sont également requises au runtime car elles sont intégrées dans le build Next.js. Seules les variables d'email (`RESEND_API_KEY`, `BREVO_*`) peuvent être configurées uniquement au runtime sans rebuild.

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Génère le build de production (inclut `typegen`) |
| `npm run start` | Démarre le serveur en production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run typegen` | Extrait le schéma Sanity et génère les types |

## Build Docker

Le build est entièrement autonome dans Docker (multi-stage) : Node.js compile l'application dans l'image, aucune étape de build locale n'est requise.

```bash
docker build -f docker/Dockerfile -t archives-lgbtqi .
```

Avec les variables de build :

```bash
docker build -f docker/Dockerfile \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
  --build-arg NEXT_PUBLIC_SANITY_DATASET=production \
  --build-arg SANITY_API_READ_TOKEN=xxx \
  -t archives-lgbtqi .
```

Lancer le conteneur :

```bash
docker run -p 3000:3000 \
  -e RESEND_API_KEY=xxx \
  -e BREVO_API_KEY=xxx \
  -e BREVO_LIST_ID=xxx \
  -e BREVO_WELCOME_EMAIL_TEMPLATE_ID=xxx \
  archives-lgbtqi
```

L'image utilise un utilisateur non-root (`app`) et expose le port `3000`. Les variables `HOST` et `PORT` sont prises en charge par le point d'entrée (`docker/docker-entrypoint.sh`).

## CI/CD

Le déploiement est automatisé via GitHub Actions (`.github/workflows/build.yml`) :

- Build multi-arch de l'image Docker avec les arguments de build pour les variables Sanity
- Push sur GitHub Container Registry
- Génération d'attestations de build
- Nettoyage automatique des anciennes images
- Cache Docker via GitHub Actions Cache

## Outils de développement

Le projet inclut une configuration [`mise.toml`](./mise.toml) pour les utilisateurs de [mise](https://mise.jdx.dev/) afin de fixer la version de Node.js à 20.

## Changelog

Voir [CHANGELOG.md](./CHANGELOG.md) pour l'historique des modifications.

## Licence

Propriété du Centre Archives LGBTQI+ Paris.

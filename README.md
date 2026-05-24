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

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-28
SANITY_API_READ_TOKEN=votre-token

# Site
NEXT_PUBLIC_SITE_URL=https://votre-domaine.fr

# Emails / Newsletter
RESEND_API_KEY=votre-cle-resend
BREVO_API_KEY=votre-cle-brevo
BREVO_LIST_ID=votre-list-id
BREVO_WELCOME_EMAIL_TEMPLATE_ID=votre-template-id
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Génère le build de production |
| `npm run start` | Démarre le serveur en production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run typegen` | Extrait le schéma Sanity et génère les types |

## Build Docker

```bash
npm run build
docker build -f docker/Dockerfile -t archives-lgbtqi .
```

## CI/CD

Le déploiement est automatisé via GitHub Actions (`.github/workflows/build.yml`) :
- Build et push de l'image Docker sur GitHub Container Registry
- Génération d'attestations de build
- Nettoyage automatique des anciennes images

## Changelog

Voir [CHANGELOG.md](./CHANGELOG.md) pour l'historique des modifications.

## Licence

Propriété du Centre Archives LGBTQI+ Paris.

# ADR-0005 : Resend (contact) et Brevo (newsletter)

- **Statut** : Accepté
- **Date** : 2026-10-20 (commits `3bc3664`, `f3c4b97`), 2026-10-25 (`ce24d08`)

## Contexte

Le site envoie deux types de courriels : le formulaire « proposition d'archive » vers l'équipe, et l'inscription à la newsletter. Une ancienne implémentation (Nodemailer, routes d'e-mail) a été supprimée comme inutilisée.

## Décision

- **Contact** : Server Action `sendEmail` (`app/(next)/_actions.ts`), validation Zod (`ContactFormSchema` : longueurs plafonnées, titre sans saut de ligne, champ leurre `website`), envoi par **Resend** avec un gabarit React (`app/(next)/emails/contact-form-email.tsx`) vers `CONTACT_RECIPIENT`. Les erreurs d'envoi sont journalisées côté serveur et jamais renvoyées au client.
- **Newsletter** : route `POST /api/newsletter` appelant l'API **Brevo** en **double opt-in** (`/v3/contacts/doubleOptinConfirmation`) : l'adresse n'est ajoutée à la liste qu'après le clic de confirmation. La réponse est identique que l'adresse soit déjà abonnée ou non.
- **Anti-abus** (les deux formulaires) : limite de débit en mémoire par IP et globale (`app/(next)/lib/rate-limit.ts`). Un compteur en mémoire suppose un seul conteneur ; passer à un stockage partagé si le service est répliqué.
- La route newsletter s'exécute sur le runtime **Node.js** (le runtime Edge, déprécié, a été retiré).

## Conséquences

- Deux fournisseurs et deux jeux de secrets à maintenir.
- Le destinataire du formulaire de contact est lu dans `CONTACT_RECIPIENT` ; sans elle, l'envoi échoue.

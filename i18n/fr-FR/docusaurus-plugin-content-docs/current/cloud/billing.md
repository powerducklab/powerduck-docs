---
sidebar_position: 7
title: Facturation
description: "Découvrez les différences entre la licence de bureau perpétuelle, l’offre Cloud gratuite et les abonnements payants, ainsi que leurs quotas, droits et moyens de paiement."
---

# Facturation

Powerduck a deux modèles d'achat distincts qui ne se mélangent pas.

| | Client de bureau | Powerduck Cloud |
|---|---|---|
| Achat | Unique | Offre gratuite ou abonnement payant |
| Reçu | Clé de licence perpétuelle | Adhésion hébergée |
| Expiration | Aucune | Accès gratuit ou période de facturation payée |
| Affiché après achat | Clé une seule fois | Pas de clé |

## Licence de bureau

Le client de bureau est vendu en licence perpétuelle achat unique.

- À l'achat, la clé est générée et affichée **une seule fois**.
- La clé est stockée en hash SHA-256, donc la base ne peut pas reconstruire l'original, et seuls les quatre derniers caractères sont gardés.
- États : `ISSUED`, `ACTIVE`, `SUSPENDED`, `REVOKED`. Perpétuel ne signifie pas impossible à révoquer.
- La clé est liée à une organisation et l'activation est limitée en débit.

Cela reste entièrement distinct de l'abonnement Cloud : acheter un abonnement Cloud ne produit pas de clé de licence.

## Abonnement Cloud

Cloud propose une **offre Free** avec hébergement de documentation et de MCP, ainsi que des abonnements payants. Pro ajoute des quotas plus élevés, les sources Git et les domaines personnalisés ; Team permet d’inclure plusieurs membres. Aucune clé de licence n’est nécessaire.

- **Pro** — 19 $/mois.
- **Team** — 49 $/mois.
- **Free** — 0 $, avec limites.

L'abonnement a des périodes et se renouvelle en fin de période courante.

### Plans et autorisations

Les capacités se décident par **autorisations**, pas en comparant des codes de plan.

| Autorisation | Free | Pro | Team |
|---|---|---|---|
| Hébergement de documents | Oui | Oui | Oui |
| MCP | Oui | Oui | Oui |
| Source Git | Non | Oui | Oui |
| Domaine personnalisé | Non | Oui | Oui |
| Documents maximum | 3 | 100 | 1,000 |
| Versions max/document | 20 | 200 | 1,000 |
| Opérations exposées max | 10 | 1 000 | 10 000 |
| Taille de téléversement max | 1 MiB | 10 MiB | 50 MiB |
| Membres maximum | 1 | 1 | 10 |

## Fournisseur de paiement

Le chemin de paiement se choisit selon la région.

- Chine continentale, Hong Kong, Asie du Sud-Est — **Antom**.
- Europe/Amériques, Japon, Corée — **Paddle**.
- En cas d'échec de détection, repli sur **Antom**.

Les deux fournisseurs n'apparaissent pas en même temps au paiement ; Paddle reste un secours pour basculer vite en urgence.

### Flux de paiement

1. Choisir un plan et démarrer le paiement.
2. Redirection vers le fournisseur.
3. Retour après paiement : la page de retour vérifie l'état de la commande.
4. Un webhook confirme le paiement et active l'abonnement.

Les commandes se traitent de façon **idempotente**, donc le même paiement ne s'applique pas deux fois.

## Cycle de vie de l'abonnement

- **Montée de version** — prend effet immédiatement ; différence au prorata selon la valeur restante de la période.
- **Descente de version** — prend effet en fin de période courante (signalée à l'avance).
- **Annulation** — expire en fin de période courante ; l'annulation passe par des confirmations répétées avec alternatives.
- **Expiration** — retour aux limites Free après la fin de période.

L'annulation ne coupe pas immédiatement l'accès ; vous gardez le service jusqu'à la fin de la période.

## Commandes et adhésion

La page de facturation sépare les deux.

- **Adhésion/abonnement** — plan courant, état, fin de période, renouvellement.
- **Commandes** — achats passés et historique de paiement.

## Vérification d'autorisation

Comme toute ressource hôte, paiements et abonnements appartiennent à une **organisation** et se consultent avec une portée organisation, donc un utilisateur avec un autre identifiant d'organisation ne peut pas lire les commandes d'une autre équipe.

Voir aussi : [Introduction Cloud](./introduction.md), [Domaines personnalisés](./custom-domains.md).

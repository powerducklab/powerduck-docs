---
sidebar_position: 2
title: Installation
description: "Installez le client de bureau Powerduck sur macOS, Windows et Linux. L'application est local-first et démarre sans compte."
---

# Installation

Le client de bureau Powerduck est une application local-first. Il s'installe comme n'importe quel autre programme de bureau, ouvre de vrais fichiers sur le disque et démarre sans compte.

## Téléchargement

Récupérez le programme d'installation pour votre plateforme sur le [site web Powerduck](https://www.powerduck.com/#download). Les builds suivants sont produits avec `electron-builder`.

| Plateforme | Programme d'installation | Architectures |
|---|---|---|
| macOS | `.dmg` (et `.zip` pour les mises à jour automatiques) | Apple Silicon (`arm64`) et Intel (`x64`) |
| Windows | Programme d'installation NSIS (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Ouvrez le `.dmg` et glissez Powerduck dans **Applications**.
2. Au premier lancement, macOS peut demander de confirmer l'ouverture d'une application téléchargée hors de l'App Store. Vérifiez qu'elle provient de la page officielle avant de l'ouvrir ; ne désactivez pas les contrôles de sécurité du système.
3. Deux builds sont publiés : `arm64` pour Apple Silicon (série M) et `x64` pour les Mac Intel. Téléchargez celui qui correspond à votre machine.

## Windows

1. Lancez le programme d'installation NSIS (`.exe`) et suivez la configuration.
2. Si SmartScreen signale un éditeur inconnu, vérifiez d'abord que le programme d'installation provient de la page officielle. Ne continuez qu'après avoir vérifié sa source ; ne contournez pas l'avertissement pour un téléchargement non fiable.

## Linux

1. Téléchargez l'`.AppImage`.
2. Rendez-la exécutable et lancez-la.

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

L'AppImage fonctionne sans installation système. Certaines distributions nécessitent FUSE pour le montage.

## Ce qui s'exécute sur votre machine

Le client de bureau est une application Electron en deux parties.

- Le **processus principal** (Node.js), qui gère l'accès aux fichiers, les requêtes HTTP externes, le serveur de simulation local, les connexions aux bases de données et le terminal intégré.
- Le **renderer** (l'espace de travail React), qui affiche la spécification, le chat IA et les outils.

Le client de bureau envoie les requêtes au modèle par le processus principal, ce qui évite les restrictions CORS entre le navigateur et le fournisseur. Les instructions, le contexte pertinent et les identifiants sont néanmoins envoyés au point d'accès du modèle configuré ; un modèle hébergé ne fonctionne pas hors ligne. Cette séparation ne garantit pas non plus qu'aucun secret n'apparaisse dans les journaux ou les outils de développement. Voir [IA et modèles](../client/ai-models.md).

## Configuration requise

- macOS 11 ou version ultérieure, Windows 10 ou version ultérieure, ou une distribution Linux de bureau courante compatible avec Electron 37.
- De l'espace disque pour l'application. Les spécifications ouvertes restent à leur emplacement d'origine.
- Le réseau n'est nécessaire que pour envoyer des requêtes, synchroniser des sources Git ou appeler un modèle IA hébergé ; le reste fonctionne hors ligne.

## Licence

Le client de bureau peut être évalué librement. Il est vendu sous licence **perpétuelle** après un achat unique, sans abonnement. La clé de licence est générée à l'achat et affichée une seule fois. L'hébergement cloud est un service par abonnement distinct. Voir [Facturation Cloud](../cloud/billing.md) pour la distinction.

Ensuite, passez au [Démarrage rapide](./quickstart.md).

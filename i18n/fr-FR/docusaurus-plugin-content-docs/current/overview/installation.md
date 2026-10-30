---
sidebar_position: 2
title: Installation
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Installation

Powerduck, y compris le client de bureau, exige une connexion Google OAuth ou GitHub. Les fichiers restent sur le disque. L’analyse IA transmet le contexte sélectionné aux fournisseurs gérés par Powerduck ; les URL de modèles et clés API personnalisées ne sont plus prises en charge.

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

Powerduck, y compris le client de bureau, exige une connexion Google OAuth ou GitHub. Les fichiers restent sur le disque. L’analyse IA transmet le contexte sélectionné aux fournisseurs gérés par Powerduck ; les URL de modèles et clés API personnalisées ne sont plus prises en charge.

## Configuration requise

- macOS 11 ou version ultérieure, Windows 10 ou version ultérieure, ou une distribution Linux de bureau courante compatible avec Electron 37.
- De l'espace disque pour l'application. Les spécifications ouvertes restent à leur emplacement d'origine.
- Powerduck, y compris le client de bureau, exige une connexion Google OAuth ou GitHub. Les fichiers restent sur le disque. L’analyse IA transmet le contexte sélectionné aux fournisseurs gérés par Powerduck ; les URL de modèles et clés API personnalisées ne sont plus prises en charge.

## Powerduck · Free / Pro / Max

Free : 300 000 credits par jour, réinitialisés à 00:00 UTC. Pro : 39 $/mois, 18 000 000 credits tous les 7 jours. Max : 99 $/mois, 60 000 000 credits tous les 7 jours. Le cycle part du début initial de l’abonnement, indépendamment de la facturation mensuelle. Aucun report. Le bureau et AI Chat partagent le forfait personnel ; les licences perpétuelles et clés d’activation ne sont plus vendues.

Ensuite, passez au [Démarrage rapide](./quickstart.md).

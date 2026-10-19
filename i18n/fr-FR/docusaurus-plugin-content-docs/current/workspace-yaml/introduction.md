---
sidebar_position: 1
title: "Introduction"
description: "Initialisez en toute fiabilité les fichiers workspace.yaml et YAML OpenAPI 3.2. Compatible avec le navigateur : des fonctions pures génèrent des chaînes de contenu YAML, sans accès au système de fichiers. Dans Node.js / Electron, elle ajoute à la couche principale l’écriture atomique, le verrouillage des fichiers et la normalisation des chemins."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Initialisez en toute fiabilité les fichiers workspace.yaml et YAML OpenAPI 3.2.

Une architecture à deux couches :
- **Couche principale**: Compatible avec le navigateur : des fonctions pures génèrent des chaînes de contenu YAML, sans accès au système de fichiers.
- **Couche fichiers**: Dans Node.js / Electron, elle ajoute à la couche principale l’écriture atomique, le verrouillage des fichiers et la normalisation des chemins.

- **Nom du paquet:** `@powerduck/workspace-yaml`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Licence:** MIT

Cette bibliothèque **initialise uniquement les fichiers**, pour la création d’un nouveau fichier ou la création manuelle. Elle **ne réimplémente pas** la lecture, l’application de correctifs ou la modification des fichiers YAML. Pour ces opérations, utilisez [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Étapes suivantes

- [Installation](/docs/fr-FR/workspace-yaml/installation/)
- [Démarrage rapide](/docs/fr-FR/workspace-yaml/quickstart/)
- [Référence de l’API](/docs/fr-FR/workspace-yaml/api-reference/)
- [Exemples](/docs/fr-FR/workspace-yaml/examples/)

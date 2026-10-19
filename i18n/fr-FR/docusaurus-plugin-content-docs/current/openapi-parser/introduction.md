---
sidebar_position: 1
title: "Introduction"
description: "Convertissez n’importe quel document Swagger 2.0, OpenAPI 3.0, 3.1 ou 3.2 en OpenAPI 3.2 en un seul appel."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Convertissez n’importe quel document Swagger 2.0, OpenAPI 3.0, 3.1 ou 3.2 en OpenAPI 3.2 en un seul appel.

Une couche légère s’appuie sur ces deux bibliothèques : [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Elle ne réimplémente ni l’analyse, ni la validation, ni la conversion ; elle les relie et donne à chaque échec une structure uniforme et prévisible, avec un code d’erreur exploitable par machine.

- **Nom du paquet:** `@powerduck/openapi-parser`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Licence:** MIT
- **Node.js:** >= 22.12.0

## Fonctionnalités

- **Une fonction pour toutes les versions** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x et 3.2.x sont convertis en document 3.2 validé.
- **Entrée sous forme de chaîne JSON ou YAML** — Passez un objet déjà analysé ou une chaîne JSON/YAML brute.
- **Codes d’erreur exploitables par machine** — Chaque échec produit une erreur `OpenApiUpgradeError` contenant une valeur de l’énumération `UpgradeErrorCode`.
- **Aucune modification de l’entrée** — L’entrée est copiée en profondeur via `structuredClone` avant toute étape de conversion.
- **Protection contre les références circulaires** — Détecte les cycles dans l’entrée avant qu’ils ne provoquent un débordement de pile.
- **Validation de la sortie** — Le document 3.2 converti est validé par rapport au schéma par défaut.
- **ESM et CJS** — Utilisez `import` dans Node moderne et les outils de bundling, et `require()` dans le processus principal d’Electron.

## Étapes suivantes

- [Installation](/docs/fr-FR/openapi-parser/installation/) — installation et prérequis
- [Démarrage rapide](/docs/fr-FR/openapi-parser/quickstart/) — convertir votre premier document
- [Référence de l’API](/docs/fr-FR/openapi-parser/api-reference/) — tous les exports, codes d’erreur et options
- [Exemples](/docs/fr-FR/openapi-parser/examples/) — gestion des erreurs, options et utilisation avec CommonJS

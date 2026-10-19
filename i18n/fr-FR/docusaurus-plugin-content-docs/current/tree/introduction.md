---
sidebar_position: 1
title: "Introduction"
description: "Composant d’arborescence extensible pour la navigation API, l’exploration de schémas et la documentation. Il repose sur un noyau générique avec des adaptateurs pour OpenAPI, JSON Schema et les sources de données personnalisées."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Composant d’arborescence extensible pour la navigation API, l’exploration de schémas et la documentation. Il repose sur un noyau générique avec des adaptateurs pour OpenAPI, JSON Schema et les sources de données personnalisées.

- **Nom du paquet:** `@powerduck/tree`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Licence:** MIT

## Fonctionnalités

- **Noyau générique** — `TreeNode<TMetadata>` fonctionne avec toute source de données
- **Adaptateur OpenAPI** — Navigation par étiquettes avec les étiquettes imbriquées d’OAS 3.2, `x-tagGroups`, `x-order`, `x-displayName` et `x-internal`
- **Adaptateur JSON Schema** — Développement en profondeur des propriétés imbriquées, tableaux et combinateurs avec les métadonnées `jsonPath`
- **Adaptateur de documentation** — Arborescence inspirée de Stripe avec badges du nombre d’opérations
- **Composant React** — Recherche, développement et repli, navigation au clavier, badges de méthodes et props de rendu personnalisé
- **Glisser-déposer** — Réorganisation sous le même parent et déplacement vers des dossiers d’autres niveaux
- **Menu contextuel** — Actions par nœud via un clic droit ou le bouton d’options supplémentaires
- **Localisation impérative** — `locateNode(predicate)` trouve un nœud, développe ses ancêtres, le sélectionne et le fait défiler dans la zone visible
- **Intégration JSON Patch** — Le callback `onPatch` émet des opérations RFC 6902
- **Thèmes par variables CSS** — Compatible avec `tokens.css` de Powerduck et les modes clair et sombre

## Étapes suivantes

- [Installation](/docs/fr-FR/tree/installation/)
- [Démarrage rapide](/docs/fr-FR/tree/quickstart/)
- [Référence de l’API](/docs/fr-FR/tree/api-reference/)
- [Exemples](/docs/fr-FR/tree/examples/)

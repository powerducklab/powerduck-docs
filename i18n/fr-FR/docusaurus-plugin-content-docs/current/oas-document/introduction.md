---
sidebar_position: 1
title: "Introduction"
description: "Composant de documentation OpenAPI pour React, prêt pour la production. Fournissez un document OAS pour obtenir une interface de documentation API inspirée de Stripe, avec navigation d’en-tête, thèmes clair et sombre, arborescence, suivi du défilement, exploration des schémas et exemples de code en plusieurs langages."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

Composant de documentation OpenAPI pour React, prêt pour la production. Fournissez un document OAS pour obtenir une interface de documentation API inspirée de Stripe, avec navigation d’en-tête, thèmes clair et sombre, arborescence, suivi du défilement, exploration des schémas et exemples de code en plusieurs langages.

- **Nom du paquet:** `@powerduck/oas-document`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **Licence:** MIT

Bibliothèques utilisées: `@powerduck/openapi-parser` (validation et conversion automatique), `@powerduck/tree` (navigation), `@powerduck/md-editor` (rendu Markdown), `@powerduck/openapi-codegen` (génération du code des requêtes).

## Fonctionnalités

- **Documentation API prête à intégrer** — Accepte un objet analysé, une chaîne JSON ou une chaîne YAML
- **Présentation inspirée de Stripe** — En-tête configurable, arborescence latérale et vue des opérations sur deux colonnes
- **Thèmes clair et sombre** — Bascule dans l’en-tête, choix enregistré dans localStorage
- **Conversion automatique vers OAS 3.2** — Validation et conversion via `@powerduck/openapi-parser`
- **Navigation synchronisée avec le défilement** — Écouteur de défilement passif avec recherche binaire
- **rendu Markdown** — Descriptions affichées via `@powerduck/md-editor`
- **Exemples de code en plusieurs langages** — Générés via `@powerduck/openapi-codegen`
- **Exploration des schémas** — Tableaux de propriétés imbriquées pouvant être développés et repliés
- **Mise en page adaptative** — Sur mobile, la barre latérale devient un panneau superposé

## Étapes suivantes

- [Installation](/docs/fr-FR/oas-document/installation/)
- [Démarrage rapide](/docs/fr-FR/oas-document/quickstart/)
- [Référence de l’API](/docs/fr-FR/oas-document/api-reference/)
- [Exemples](/docs/fr-FR/oas-document/examples/)

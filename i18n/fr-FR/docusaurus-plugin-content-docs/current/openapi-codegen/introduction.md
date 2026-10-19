---
sidebar_position: 1
title: "Présentation"
description: "Générez des exemples HTTP exécutables depuis OpenAPI avec @powerduck/openapi-codegen : 21 langages, 41 clients, compatible navigateur, sans dépendance d’exécution."
---

# Présentation

`@powerduck/openapi-codegen` est une bibliothèque TypeScript qui transforme une opération OpenAPI en **exemple de requête HTTP exécutable**, dans le langage et avec le client HTTP de votre choix. Elle est conçue pour les sites de documentation API, portails développeurs, explorateurs d’API, outils CLI et la génération de code lors du build.

Elle prend en charge **21 langages** et **41 combinaisons langage/client**, fonctionne **dans le navigateur** et n’a **aucune dépendance d’exécution**.

## Pourquoi openapi-codegen ?

- **Aucune dépendance d’exécution** — fonctionne dans le navigateur, Node.js, Electron et les environnements edge, sans module intégré de Node.
- **Deux formats de modules** — builds ESM natif et CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — traite un objet document déjà analysé. JSON et YAML sont pris en charge si vous les analysez avant d’appeler `generate()`.
- **41 générateurs intégrés** pour 21 langages, enregistrés automatiquement à l’import.
- **Sérialisation complète des paramètres** — chemin, query, header et cookie selon les règles OpenAPI `style` / `explode` / `allowReserved`.
- **Schémas de sécurité** — clé API dans un header, une query ou un cookie, HTTP bearer et HTTP basic.
- **Types de corps** — JSON, texte brut, formulaire URL-encodé et `multipart/form-data`.
- **Résolution des `$ref`** — références JSON Pointer internes au document, avec cache, chaînage et détection des cycles.
- **Exemples automatiques** — déduit les valeurs depuis JSON Schema (`example`, `enum`, `default`, types, formats, contraintes).
- **Système de plugins** — enregistrez des générateurs personnalisés via `register()` ou `use()`.

## Fonctionnement

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` résout les `$ref`, fusionne les paramètres du chemin et de l’opération, choisit le type de média du corps, génère des valeurs d’exemple, résout les schémas de sécurité et produit un `RequestIR` normalisé.
2. Le `Generator` sélectionné reçoit le `RequestIR` et renvoie une chaîne de code source exécutable.

En général, il suffit d’appeler `generate({...})`, qui réalise les deux étapes.

## Un exemple pour comprendre

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Pour aller plus loin

- [Installation](/docs/fr-FR/openapi-codegen/installation/) — npm / yarn / pnpm et utilisation dans le navigateur.
- [Démarrage rapide](/docs/fr-FR/openapi-codegen/quickstart/) — Générez votre premier extrait et listez les générateurs.
- [Configuration](/docs/fr-FR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Référence de l’API](/docs/fr-FR/openapi-codegen/api-reference/) — Tous les exports et la liste complète des langages et clients.
- [Exemples](/docs/fr-FR/openapi-codegen/examples/) — fetch, Python requests, cURL, générateurs personnalisés, plugins et `RequestIR` direct.

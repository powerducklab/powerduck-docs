---
sidebar_position: 3
title: "Démarrage rapide"
description: "Générez votre premier exemple de requête exécutable avec @powerduck/openapi-codegen et consultez les générateurs disponibles."
---

# Démarrage rapide

Ce guide explique comment générer un exemple de requête exécutable et découvrir les générateurs disponibles.

## 1. Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Générer à partir d’un document

Fournissez un document OpenAPI **déjà analysé**, ainsi que `path`, `method`, `language` et `client`. `generate()` renvoie le code source sous forme de chaîne.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Équivalent en CommonJS :

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Lister les générateurs disponibles

`list()` renvoie le descripteur de chaque générateur enregistré :

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Chaque descripteur a la forme `{ language: string; client: string }`. Les identifiants sont sensibles à la casse ; reprenez exactement ceux de la liste des générateurs dans la référence de l’API. [Référence de l’API](/docs/fr-FR/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Vous pouvez aussi sélectionner un générateur par programmation :

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Fournir les identifiants d’accès

Utilisez `securityValues` pour renseigner les schémas de sécurité nommés. Les clés doivent correspondre aux noms des schémas du document :

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Remplacer l’URL du serveur

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Gestion des erreurs

`generate()` lève une exception si une entrée manque ou si le générateur n’est pas pris en charge. Interceptez les exceptions lorsque vous traitez des documents non fiables :

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Pour aller plus loin

- [Configuration](/docs/fr-FR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Exemples](/docs/fr-FR/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, générateur personnalisé, plugin et utilisation directe de `RequestIR`.
- [Référence de l’API](/docs/fr-FR/openapi-codegen/api-reference/) — Toutes les exportations.

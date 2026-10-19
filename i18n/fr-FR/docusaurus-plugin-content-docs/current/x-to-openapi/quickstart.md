---
sidebar_position: 3
title: "Démarrage rapide"
description: "Premiers pas avec @powerduck/x-to-openapi : convertir des commandes curl et des collections Postman, puis enregistrer des adaptateurs avec XToOpenApi."
---

# Démarrage rapide

Ce guide couvre les trois usages les plus courants : les fonctions `curlToOpenApi` et `postmanToOpenApi`, ainsi que la classe `XToOpenApi` pour une intégration personnalisée.

Prérequis : installez d’abord le paquet. [Installation](/docs/fr-FR/x-to-openapi/installation/)

:::note
Toutes les fonctions de conversion sont **asynchrones** et renvoient un [`ConvertResult`](/docs/fr-FR/x-to-openapi/api-reference/#convertresult). Utilisez toujours `await`.
:::

## 1. Convertir une commande curl

Passez une commande curl unique à [`curlToOpenApi`](/docs/fr-FR/x-to-openapi/api-reference/#curltoopenapi). Le champ `document` du résultat contient l’objet OpenAPI 3.2 généré.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Voici un extrait du document généré :

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

Vérifiez si la conversion a réussi et examinez les diagnostics :

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Convertir une collection Postman

Passez un objet collection déjà analysé ou une chaîne JSON à [`postmanToOpenApi`](/docs/fr-FR/x-to-openapi/api-reference/). Les scripts de test sont conservés dans `x-postman-scripts`.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

Une chaîne JSON convient également :

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Utiliser la classe `XToOpenApi` avec des options personnalisées

Utilisez la classe pour contrôler explicitement les adaptateurs enregistrés et les [`ConvertOptions`](/docs/fr-FR/x-to-openapi/api-reference/#convertoptions).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### Enregistrer plusieurs adaptateurs et utiliser `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Diagnostics et mode strict

Par défaut, la conversion collecte les problèmes sous forme d’entrées [`Diagnostic`](/docs/fr-FR/x-to-openapi/api-reference/) et renvoie tout de même un résultat. Définissez `strict: true` pour lever une [`ConversionError`](/docs/fr-FR/x-to-openapi/api-reference/#conversionerror) dès le premier diagnostic de niveau erreur.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## Pour aller plus loin

- [Exemples](/docs/fr-FR/x-to-openapi/examples/) — Lots de commandes curl, inférence des paramètres de chemin, authentification Postman et adaptateur personnalisé.
- [Référence de l’API](/docs/fr-FR/x-to-openapi/api-reference/) — Tous les exports, options et codes de diagnostic.

---
sidebar_position: 5
title: "Exemples"
description: "Exemples pratiques et exécutables utilisant l’API publique"
---

# Exemples

Exemples pratiques et exécutables utilisant l’API publique. Les fonctions de conversion sont asynchrones : utilisez `await`. Elles analysent les données localement sans envoyer les requêtes HTTP enregistrées.

---

## 1. Commande curl simple

Convertissez une commande curl et examinez le document généré.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

Les diagnostics sont toujours renvoyés, même en cas de succès :

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Plusieurs commandes curl (lot)

Passez un tableau de commandes ou une chaîne en contenant plusieurs. Les requêtes partageant la même méthode et le même chemin sont fusionnées ; les schémas sont combinés structurellement.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### Sortie « Tout copier au format cURL » du navigateur

Collez le bloc entier : [`splitCurlCommands`](./api-reference.md#splitcurlcommands) gère les guillemets, les continuations de ligne, les invites et `curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Collection Postman

Convertissez un objet collection. Les dossiers imbriqués, l’héritage de l’authentification et les scripts de test sont pris en compte.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

Une chaîne JSON fonctionne aussi :

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Inférence des paramètres de chemin

Quand `inferPathParameters` est activé, ce qui est le cas par défaut, les requêtes sont regroupées par méthode, origine et structure de chemin. Un segment n’est transformé en paramètre que si son groupe contient au moins `pathParameterMinSamples` requêtes, que ses valeurs varient et que **toutes** ressemblent à un identifiant : nombre, UUID, ULID ou chaîne hexadécimale d’au moins 8 caractères.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

Les noms de paramètres proviennent du segment statique précédent le plus proche, mis au singulier et en camelCase :

| Motif de chemin | Noms des paramètres |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

Les noms en double dans un chemin reçoivent un suffixe numérique (`userId`, `userId2`).

Désactivez l’inférence pour conserver les segments littéraux :

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Adaptateur personnalisé

Implémentez [`SourceAdapter`](./api-reference.md) pour ajouter une source, par exemple HAR, HTTPie ou Insomnia, puis enregistrez-la dans `XToOpenApi`.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. Gestion des erreurs et mode strict

Les problèmes sont collectés dans `result.diagnostics`. Avec `strict: true`, les diagnostics de gravité erreur lèvent une [`ConversionError`](./api-reference.md#conversionerror), mais les avertissements seuls ne le font pas. Des options invalides ou des identifiants d’adaptateur inconnus peuvent aussi provoquer une exception.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

La limite actuelle lève une `ConversionError` si une chaîne, ou la somme des éléments chaîne d’un tableau, dépasse 10 × 1024 × 1024 unités de code JavaScript, indépendamment de `strict`. Ce n’est pas une limite en octets UTF-8, et les objets déjà analysés ne sont pas mesurés. Appliquez votre propre limite en octets avant d’accepter une entrée non fiable.

---

## Étapes suivantes

- [Référence API](./api-reference.md) : valeurs par défaut des options et codes de diagnostic.
- [Démarrage rapide](./quickstart.md) : votre première conversion de bout en bout.

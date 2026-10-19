---
sidebar_position: 4
title: "Configuration"
description: "Options de génération de @powerduck/openapi-codegen : GenerateOptions, RequestIR, interfaces Generator et Plugin."
---

# Configuration

Il n’y a pas de fichier de configuration distinct. La génération est pilotée par l’objet `GenerateOptions` passé à [`generate()`](/docs/fr-FR/openapi-codegen/api-reference/).

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Option | Type | Obligatoire | Description |
|---|---|---|---|
| `language` | `string` | oui | Identifiant de la langue cible, sans distinction de casse, par ex. `"javascript"` |
| `client` | `string` | oui | Identifiant du client HTTP cible, par ex. `"fetch"` |
| `request` | `RequestIR` | une variante* | Requête déjà normalisée ; évite `normalize` |
| `document` | `unknown` | une variante* | Objet document OpenAPI déjà analysé |
| `path` | `string` | avec `document` | Modèle de chemin OpenAPI exact, par ex. `"/pets/{id}"` |
| `method` | `string` | avec `document` | Méthode HTTP, par ex. `"get"` / `"post"` |
| `serverUrl` | `string` | non | Remplace l’URL du serveur définie dans le document |
| `securityValues` | `Record<string, string>` | non | Identifiants indexés par nom de schéma de sécurité |
| `softRefMode` | `boolean` | non | Ne lève pas d’erreur pour les `$ref` cassées ou circulaires ; renvoie des valeurs partielles |

\* Fournissez soit `request` seul, soit `document` + `path` + `method`. Si `request` est fourni, `document`, `path`, `method`, `serverUrl`, `securityValues` et `softRefMode` sont ignorés.

### Erreurs de validation des entrées

`generate()` lève une erreur si une entrée obligatoire manque :

- `TypeError: generate() requires an options object` — Aucun objet d’options.
- `Error: Unsupported generator: <language>/<client>` — Combinaison inconnue.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` lève lui-même une `Error` pour les méthodes non prises en charge, l’absence de `paths`, les chemins inconnus ou les opérations manquantes ; il lève une `TypeError` si le document n’est pas un objet.

## RequestIR

Représentation normalisée d’une requête, indépendante du générateur de code. Vous pouvez la construire directement et la passer dans `options.request` pour éviter `normalize`.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Les espaces réservés aux fichiers multipart utilisent cette structure de marquage :

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

Un générateur est un objet conforme à cette interface. Les générateurs intégrés sont construits avec `createGenerator(language, client, emit)`, mais vous pouvez enregistrer les vôtres :

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` reçoit un `RequestIR` et renvoie le code source généré sous forme de chaîne.

## Plugin

Un plugin enregistre un ou plusieurs générateurs via `use()` :

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Exemple :

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

Ce type est prévu pour de futures sorties pouvant contenir plusieurs fichiers. Actuellement, `generate()` renvoie toujours un `string` :

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Structure de sortie de normalize

Un appel direct à `normalize()` (voir la [référence API](/docs/fr-FR/openapi-codegen/api-reference/#normalizeoptions)) renvoie un objet légèrement plus riche que `RequestIR` :

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Ordre de résolution de l’URL du serveur

`baseUrl` prend la première valeur non vide parmi :

1. `options.serverUrl`
2. les `servers` de l’opération
3. les `servers` de l’élément de chemin
4. les `servers` à la racine
5. la valeur de repli `"https://example.com"`

Les variables `{variable}` du serveur sont remplies à partir de `server.variables`, avec leur valeur `default`, puis `example` à défaut, encodée pour une URI.

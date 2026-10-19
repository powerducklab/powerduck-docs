---
sidebar_position: 4
title: "Configuration"
description: "La configuration comporte trois niveaux : les options de fabrique du client ou du débogueur, l’objet SendOptions transmis à prepare() et send(), et les options propres aux protocoles."
---

# Configuration

La configuration comporte trois niveaux : les options de fabrique du client ou du débogueur, l’objet `SendOptions` transmis à `prepare()` et `send()`, et les options propres aux protocoles.

## Options de fabrique

### `CreateClientOptions`

À transmettre à `createClient(options?)`. Tous les champs sont facultatifs.

| Champ | Type | Description |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Contrôle la fusion des réponses dans la spécification |
| `response` | `ToResponseOptions` | Contrôle la normalisation des objets de réponse |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

À transmettre à `createDebugger(config?)`. Tous les champs sont facultatifs.

| Champ | Type | Description |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Liste d’adaptateurs personnalisée, remplaçant tous les adaptateurs par défaut |
| `extraAdapters` | `ProtocolAdapter[]` | Adaptateurs ajoutés au registre par défaut |
| `writeBack` | `WriteBackOptions` | Options de réécriture |
| `response` | `ToResponseOptions` | Options de normalisation des réponses |
| `writeBackTruncated` | `boolean` | Réécrit le schéma déduit des flux tronqués ; par défaut `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Réécriture et exemples capturés

`WriteBackOptions` accepte `strategy` (`"merge"` ou `"replace"`, par défaut `"merge"`), `keepExistingDescription` (par défaut `true`), `allowedStatusCodes` (vide signifie tous), `protectComponentRefs` (par défaut `true`), `overwriteExamples` (par défaut `true`) et `requirePassingTests`. Le pipeline d’envoi vérifie les résultats des tests ; un appel direct à `writeBackResponse` ne le fait pas.

`ToResponseOptions` accepte `includeExamples` (par défaut `true`), `maxExampleChars` (par défaut `4000`) et `maxEventPreviewChars` (par défaut `200`). Désactivez la capture d’exemples ou vérifiez-les avant publication : les réponses réelles peuvent contenir des identifiants ou des données personnelles.

Le pipeline d’envoi renvoie normalement une copie modifiée dans `patchedSpec` ; il ne modifie pas le document d’entrée et n’enregistre aucun fichier. Définissez `writeBack: false` pour un appel afin d’ignorer cette étape. L’objet `writeBack` de la fabrique règle la fusion ; le booléen de chaque appel l’active ou la désactive.

## `SendOptions`

Objet d’entrée principal de `prepare()` et `send()`. Il reçoit la spécification, la cible, les valeurs et toute la configuration au niveau de la requête.

| Champ | Type | Obligatoire | Description |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Oui | Document OpenAPI 3.2 complet |
| `target` | `OperationTarget` | Oui | Identifiant de l’opération, voir ci-dessous |
| `values` | `RequestValues` | Non | Valeurs concrètes pour path/query/header/cookie/body |
| `serverUrl` | `string` | Non | Remplace `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | Non | Variables du modèle d’URL du serveur |
| `variables` | `Record<string, string>` | Non | Variables d’environnement référencées par `{{name}}` |
| `globals` | `Record<string, string>` | Non | Variables globales de style Postman |
| `localVariables` | `Record<string, string>` | Non | Variables locales |
| `collectionVariables` | `Record<string, string>` | Non | Variables de collection |
| `auth` | `AuthConfig` | Non | Configuration de l’authentification |
| `scripts` | `ScriptConfig` | Non | Scripts prérequête et de test |
| `runner` | `RuntimeRunOptions` | Non | Transmission complète des options postman-runtime, avec la priorité la plus élevée |
| `websocket` | `WebSocketOptions` | Non | Options WebSocket |
| `graphql` | `GraphQLOptions` | Non | Options GraphQL |
| `mcp` | `McpOptions` | Non | Options MCP |
| `grpc` | `any` | Non | Options gRPC |
| `timeout` | `number` | Non | Délai par requête en ms, raccourci pour `runner.timeout.request` |

`SendOptions` accepte également ces contrôles d’exécution et de streaming :

| Champ | Type | Description |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Transport fetch isolé fourni par l’hôte lorsqu’il est pris en charge ; HTTP/SSE utilisent toujours postman-runtime. |
| `writeBack` | `boolean` | Définir sur `false` laisse `patchedSpec` indéfini tout en produisant `responseFragment`. |
| `signal` | `AbortSignal` | Annule l’exécution ou l’échantillonnage ; un résultat partiel peut encore être renvoyé. |
| `maxEvents` | `number` | Nombre maximal d’événements de flux conservés. |
| `maxStreamMs` | `number` | Durée maximale d’échantillonnage du flux en millisecondes. |
| `maxResponseSize` | `number` | Limite de taille de réponse en octets. |
| `maxBufferChars` | `number` | Limite du tampon SSE avant une frontière d’événement ; par défaut `4194304` caractères. |
| `maxEventChars` | `number` | Limite des données conservées par événement SSE ; par défaut `1048576` caractères. |
| `inheritEventId` | `boolean` | Hérite du dernier ID d’événement SSE s’il est absent ; par défaut `true`. Utilisez `false` pour une inférence de schéma plus stricte. |
| `onEvent` | `(event: StreamEvent) => void` | Reçoit les événements du flux. |
| `onConsole` | `(log: ConsoleLog) => void` | Reçoit la sortie console des scripts. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Reçoit les résultats des assertions. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Examine les premiers en-têtes HTTP/SSE et la classification `streaming`. |
| `onOpen` | `(info) => void` | Reçoit les détails de connexion WebSocket : URL, protocole et en-têtes. |

Les adaptateurs peuvent interpréter les limites différemment. Gardez les callbacks d’interface légers ; la couche d’exécution intercepte leurs exceptions. Pour les réglages du requester HTTP, utilisez `runner.requester` ; si `maxResponseSize` est fourni, il doit être strictement positif, pas nul.

### `OperationTarget`

Identifie une opération. Préférez soit `operationId`, soit `method` + `path`. Si les deux sont fournis, `operationId` est prioritaire.

| Champ | Type | Description |
| --- | --- | --- |
| `operationId` | `string` | Autre clé de recherche, prioritaire sur le chemin et la méthode |
| `method` | `string` | Méthode HTTP insensible à la casse. Nécessite `path`. |
| `path` | `string` | Chemin à paramètres, par exemple `/users/{id}`. Nécessite `method`. |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

Valeurs concrètes injectées dans la requête générée.

| Champ | Type | Description |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Valeurs des paramètres de chemin |
| `query` | `Record<string, unknown>` | Valeurs des paramètres de requête |
| `header` | `Record<string, unknown>` | Valeurs des en-têtes |
| `cookie` | `Record<string, unknown>` | Valeurs des cookies |
| `querystring` | `string` | Chaîne de requête brute, déjà encodée, pour l’emplacement `querystring` d’OpenAPI 3.2 |
| `body` | `unknown` | Corps de la requête |
| `contentType` | `string` | Impose un type de média si l’opération en déclare plusieurs |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Champ | Type | Description |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Type d’authentification |
| `token` | `string` | Jeton Bearer pour `type: "bearer"` |
| `username` | `string` | Nom d’utilisateur Basic pour `type: "basic"` |
| `password` | `string` | Mot de passe Basic pour `type: "basic"` |
| `key` | `string` | Nom de clé API pour `type: "apikey"` |
| `value` | `string` | Valeur de clé API pour `type: "apikey"` |
| `in` | `"header" \| "query"` | Emplacement de clé API pour `type: "apikey"` |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

Les types avancés sont `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` et `edgegrid`. Transmettez leurs champs d’aide Postman HTTP/SSE/GraphQL via `parameters: Record<string, string | boolean | number>`. L’option `oauth2: OAuth2FlowConfig` active l’acquisition et le renouvellement des jetons OAuth 2.0 ; ne supposez pas que chaque mécanisme fonctionne avec tous les protocoles.

### `ScriptConfig`

| Champ | Type | Description |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Scripts prérequête de collection |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Scripts de test de collection |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Scripts prérequête individuels |
| `test` | `ScriptSource \| ScriptSource[]` | Scripts de test individuels |
| `fromSpecExtensions` | `boolean` | Lit `x-postman-scripts` dans la spécification ; par défaut `true` |
| `captureLastResponse` | `boolean` | Ajoute l’assistant intégré qui expose la dernière réponse aux requêtes suivantes |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Définissez `scripts.fromSpecExtensions: false` si vous ne souhaitez pas exécuter les scripts intégrés à une spécification importée. La valeur actuelle par défaut est `true` ; ne comptez pas sur un futur changement.

## Options propres aux protocoles

### HTTP / SSE

HTTP est l’adaptateur par défaut. Le type déclaré `text/event-stream` indique une intention SSE ; l’exécution classe aussi la réponse réelle à l’arrivée des en-têtes. `probeStreamingResponse()` est une sonde distincte, appelée explicitement, et non un prérequis automatique à chaque appel.

Les requêtes HTTP simples n’exigent aucune configuration supplémentaire. Utilisez `SendOptions.runner` pour les réglages avancés de postman-runtime.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

La session manuelle MCP par défaut utilise Streamable HTTP et `endpoint`. Pour stdio, fournissez `kind: "mcp"`, `transport: "stdio"` et une `command` locale avec des `args` facultatifs ; l’ouverture de la session lance le processus configuré.

### gRPC

gRPC nécessite une adresse, une source de descripteurs (fichiers `.proto` ou réflexion du serveur), ainsi qu’un service et une méthode entièrement qualifiés :

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Les fabriques de sessions manuelles renvoient une session non ouverte. Appelez `open()` avant l’envoi et `close()` lors du nettoyage. L’exemple gRPC nécessite un serveur local et un fichier proto correspondants ; les options de session manuelle ne sont pas le même objet que `SendOptions.grpc`.

## Exemple complet

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Pour aller plus loin

- Consultez la [Référence API](./api-reference.md) pour tous les types exportés
- Parcourez les [Exemples](./examples.md) propres à chaque protocole

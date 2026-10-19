---
sidebar_position: 5
title: "Référence API"
description: "Référence des principales API d’intégration de @powerduck/openapi-request"
---

# Référence API

Référence des principales API d’intégration de `@powerduck/openapi-request`. Les tableaux résument les contrats ; les déclarations TypeScript du paquet définissent l’ensemble des surcharges et paramètres facultatifs. Le point d’entrée principal et les sous-chemins par protocole n’exportent pas exactement les mêmes éléments.

## API principales

### `createClient(options?): ProtoClient`

Crée le client destiné aux interfaces utilisateur. L’argument `options` est facultatif.

**Paramètres :**

| Nom | Type | Description |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Configuration facultative |
| `options.writeBack` | `WriteBackOptions` | Contrôle la fusion des réponses dans la spécification |
| `options.response` | `ToResponseOptions` | Contrôle la normalisation des objets de réponse |

**Renvoie :** un `ProtoClient` avec les méthodes suivantes :

| Méthode | Signature | Description |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Planifie une requête et renvoie le protocole, le mode d’affichage et le type de flux |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Exécute une requête |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Exécute un lot avec un résultat par cible ; un échec ne supprime pas les autres résultats |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Crée une session websocket/mcp/grpc non ouverte ; appelez `open()` pour la connecter |
| `discover` | `(discoverOptions) => Promise<any>` | Découvre les fonctionnalités MCP et gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Fusionne la réponse observée dans le document |
| `dispose` | `() => void` | Ne fait actuellement rien ; les appelants doivent fermer leurs sessions |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Effectue une requête fetch et classe sa réponse ; consommez ou annulez le corps de la réponse renvoyée |

**Exemple :**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Crée le débogueur scriptable pour l’automatisation, les scripts et la CI.

**Paramètres :**

| Nom | Type | Description |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Configuration facultative |
| `config.adapters` | `ProtocolAdapter[]` | Liste d’adaptateurs personnalisés, remplaçant ceux par défaut |
| `config.extraAdapters` | `ProtocolAdapter[]` | Adaptateurs supplémentaires ajoutés à ceux par défaut |
| `config.writeBack` | `WriteBackOptions` | Options de réécriture |
| `config.response` | `ToResponseOptions` | Options de normalisation des réponses |
| `config.writeBackTruncated` | `boolean` | Réécrit le schéma déduit de flux tronqués (par défaut : true) |

**Renvoie :** un `ProtoKit` avec `prepare`, `send`, `sendMany`, `toCollection`, entre autres.

**Exemple :**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Crée une session duplex de longue durée pour WebSocket, MCP ou gRPC. La fonction de création n’effectue aucune entrée/sortie ; la connexion se fait avec `open()`.

**Paramètres :**

| Nom | Type | Description |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Protocole à utiliser |
| `options.url` | `string` | URL de connexion WebSocket |
| `options.endpoint` | `string` | Point de terminaison MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Transport MCP ; Streamable HTTP par défaut |
| `options.command`, `options.args` | `string`, `string[]` | Exécutable local et arguments pour MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Adresse gRPC, nom complet du service et méthode |

Pour gRPC, fournissez aussi une source de descripteurs via `protoPaths` ou `reflection`. Les options par protocole figurent dans [Configuration](./configuration.md).

**Renvoie :** une session avec `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` et `state`. `onEvent()` renvoie un abonnement disposant de `unsubscribe()`.

**Exemple :**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

Registre d’instances de `ProtocolAdapter`. Un nouveau registre est vide ; `createDebugger()` y inscrit les adaptateurs HTTP, WebSocket, gRPC, MCP et GraphQL intégrés, sauf si une liste personnalisée les remplace. Utilisez `register()`, `unregister()`, `get()`, `list()`, `rank()` et `resolve()` pour gérer la sélection.

### `ProtoKitError`

Erreur typée levée par le débogueur et les traitements principaux. Utilisez `instanceof ProtoKitError` pour distinguer les erreurs de la bibliothèque des défaillances inattendues.

## Types principaux

### `SendOptions`

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

### `PreparedRequest`

Renvoyé par `createClient().prepare()`. Le débogueur produit un résultat de planification différent : `createDebugger().prepare()` renvoie un `PlanResult` contenant `located`, `adapter` et `plan`.

| Champ | Type | Description |
| --- | --- | --- |
| `protocol` | `string` | Protocole résolu (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Transport résolu |
| `target` | `OperationTarget` | Cible d’origine |
| `operation` | `any` | Objet d’opération OpenAPI résolu |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Classification du flux (voir ci-dessous) |
| `stream.expected` | `boolean` | Indique si un flux est attendu |
| `openapi.extensions` | `Record<string, unknown>` | Extensions OpenAPI résolues |
| `warnings` | `string[]` | Avertissements rencontrés lors de la planification |

### `StreamKind`

Classification précise des flux : `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Fonctions utilitaires OpenAPI

| Export | Signature | Description |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Résout une opération à partir d’un `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Déduit un JSON Schema d’une seule valeur observée |
| `inferSchemaFromMany` | `(values) => Schema` | Déduit un schéma couvrant plusieurs valeurs observées |
| `mergeSchema` | `(a, b) => Schema` | Fusionne deux schémas déduits (union ou combinaison) |
| `sampleFromSchema` | `(schema) => unknown` | Produit une valeur d’exemple réaliste pour un schéma |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Construit un objet de réponse OpenAPI à partir d’un résultat observé |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Fusionne une réponse observée dans le document |

Types exportés : `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Les noms ci-dessous sont disponibles depuis le point d’entrée principal. Le sous-chemin `@powerduck/openapi-request/http` exporte `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` et `runWithPostman` ; importez les fonctions de détection et `BUILTIN_CAPTURE_TEST` depuis le point d’entrée principal.

| Export | Description |
| --- | --- |
| `HttpAdapter` | Adaptateur de protocole par défaut pour HTTP/HTTPS |
| `SseParser` | Analyseur de flux transformant un flux d’octets SSE en événements structurés |
| `isStreamingOperation` | Classe une opération comme flux à partir des types de contenu déclarés |
| `isSseContentType` | Vérifie si un type de contenu indique SSE |
| `isStreamingContentType` | Vérifie si un type de contenu indique un flux |
| `acceptHeaderFor` | Génère l’en-tête Accept approprié pour une opération |
| `probeStreamingResponse` | Effectue une requête fetch et classe sa réponse ; consommez ou annulez le corps de la réponse renvoyée |
| `BUILTIN_CAPTURE_TEST` | Script de test Postman intégré pour capturer la dernière réponse |

## WebSocket

À importer depuis `@powerduck/openapi-request/ws`.

| Export | Description |
| --- | --- |
| `WebSocketAdapter` | Adaptateur de protocole pour les cibles WebSocket |
| `createWsManualSession` | Crée une session WebSocket manuelle duplex, également nommée `runWebSocketSession` ou `wsManualSession` |

## GraphQL

À importer depuis `@powerduck/openapi-request/graphql`.

| Export | Description |
| --- | --- |
| `GraphQLAdapter` | Adaptateur de protocole pour les cibles GraphQL |
| `resolveGraphQLConfig` | Résout la configuration GraphQL à partir d’une opération |
| `runGraphQL` | Exécute une opération GraphQL |
| `introspectSchema` | Inspecte le schéma d’un point de terminaison GraphQL par introspection |
| `INTROSPECTION_QUERY` | Requête d’introspection GraphQL standard |
| `generateOperation` | Génère un document de requête à partir d’un schéma GraphQL introspecté et d’un champ |
| `generateAllOperations` | Génère des documents de requête pour les champs d’un schéma GraphQL introspecté |
| `writeGraphQLOperations` | Réécrit les opérations GraphQL générées dans la spécification |
| `discoverAndWriteGraphQLSchema` | Découvre un schéma GraphQL et l’inscrit dans la spécification |

## MCP (Model Context Protocol)

La plupart des éléments ci-dessous sont disponibles depuis `@powerduck/openapi-request/mcp`. Importez `initializeMcpSession` depuis le point d’entrée principal ; le sous-chemin l’appelle `initializeSession`. Il expose aussi `runMcp`, `createMcpSessionCore` et `createMcpStdioConnection`.

| Export | Description |
| --- | --- |
| `McpAdapter` | Adaptateur de protocole pour les cibles MCP |
| `createMcpManualSession` | Crée une session MCP manuelle, également nommée `mcpManualSession` |
| `createMcpStdioSession` | Crée une session MCP sur stdio |
| `runMcpManualSession` | Obsolète : utilisez `createMcpManualSession` |
| `resolveMcpConfig` | Résout la configuration MCP à partir d’une opération |
| `initializeMcpSession` | Initialise une session MCP (alias de `initializeSession`) |
| `discoverMcpCapabilities` | Découvre les fonctionnalités du serveur MCP |
| `MCP_PROTOCOL_VERSION` | Version du protocole MCP prise en charge |
| `generateMcpCall` | Génère un appel d’outil MCP |
| `generateAllMcpCalls` | Génère tous les appels d’outils MCP |
| `writeMcpOperations` | Réécrit les opérations MCP dans la spécification |
| `discoverAndWriteMcpCapabilities` | Découvre les fonctionnalités MCP et les inscrit dans la spécification |
| `createHttpMcpTransport` | Crée un transport HTTP pour MCP |
| `createStdioMcpTransport` | Crée un transport stdio pour MCP |

## gRPC

Importez les fonctions de bas niveau de découverte, d’appel et de gestion des descripteurs depuis `@powerduck/openapi-request/grpc`. Importez `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` et `discoverGrpc` depuis le point d’entrée principal ; le sous-chemin utilise le nom `discover`. Il propose aussi `discoverFromCatalog`, `describeMethod` et `describeFromCatalog` pour réutiliser un catalogue sans répéter la réflexion pour chaque méthode.

| Export | Description |
| --- | --- |
| `GrpcProtocolAdapter` | Adaptateur de protocole gRPC destiné à OpenAPI |
| `GrpcAdapter` | Adaptateur gRPC de bas niveau |
| `grpcDiscover` / `discoverGrpc` | Découvre les services et méthodes gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Crée une session gRPC manuelle |
| `grpcCall` | Exécute un appel gRPC |
| `resolveMethod` | Résout un descripteur de méthode gRPC |
| `buildMessageTemplate` | Crée un modèle de message à partir d’un descripteur |
| `buildCatalog` | Crée un catalogue des services et méthodes |
| `LOADER_OPTIONS` | Options par défaut du chargeur proto |
| `scanProtoFiles` | Recherche des fichiers proto dans les répertoires |
| `deriveIncludeDirsDetailed` | Déduit les répertoires d’inclusion des chemins de fichiers proto |
| `fetchDescriptorSet` | Récupère un jeu de descripteurs par réflexion gRPC |
| `fetchFullDescriptorSet` | Récupère un jeu complet de descripteurs avec toutes ses dépendances |
| `listServices` | Liste les services d’un jeu de descripteurs |
| `listServicesDetailed` | Liste les services avec le détail des méthodes |
| `serializeDescriptorSet` | Sérialise un jeu de descripteurs en octets |
| `decodeFileDescriptorProto` | Décode un proto de descripteur de fichier |
| `decodeFileDescriptorSet` | Décode un jeu de descripteurs de fichiers |
| `buildCredentials` | Construit les informations d’authentification gRPC (synchrone) |
| `buildCredentialsAsync` | Construit les informations d’authentification gRPC (asynchrone) |
| `buildCredentialsChecked` | Construit et valide les informations d’authentification (synchrone) |
| `buildCredentialsCheckedAsync` | Construit et valide les informations d’authentification (asynchrone) |
| `loadGrpc` | Charge dynamiquement le paquet `@grpc/grpc-js` |
| `isGrpcAvailable` | Vérifie la disponibilité des dépendances gRPC |
| `requireCapability` | Exige une fonctionnalité gRPC et lève une erreur si elle est indisponible |

Le point d’entrée principal exporte les alias de type `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` et `GrpcDiscoveredService`. Le sous-chemin gRPC les nomme `DiscoveryResult`, `DiscoveredMethod` et `DiscoveredService`.

Types d’erreurs : `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Autres utilitaires

Le point d’entrée principal exporte aussi les fonctions OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` et `authFromOAuth2Token`, l’utilitaire de copie `toCloneable`, la classe de base `UnifiedSession`, ainsi que les fonctions de réécriture gRPC `writeGrpcOperations` et `discoverAndWriteGrpcOperations`.

## Exports des sous-chemins

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```

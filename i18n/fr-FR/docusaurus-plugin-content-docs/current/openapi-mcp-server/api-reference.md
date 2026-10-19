---
sidebar_position: 5
title: "Référence de l’API"
description: "Référence complète de @powerduck/openapi-mcp-server : chargement des spécifications, génération d’outils, prompts et ressources, création et exécution des requêtes, serveur MCP, transports, administration, authentification, registre de services et CLI."
---

# Référence de l’API

Tous les exports publics de `@powerduck/openapi-mcp-server`, regroupés par domaine.

## Chargement des spécifications

| Export | Signature | Description |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Lit un fichier JSON ou YAML, le valide, résout les références et vérifie l’unicité des identifiants d’opération. YAML est détecté par l’extension `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Analyse un document à partir d’une chaîne. Une entrée vide ou invalide déclenche une exception. |

## Génération d’outils

| Export | Signature | Description |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Génère des définitions MCP `Tool` pour chaque opération. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Renvoie `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Associe les noms des outils générés à leur `ToolBinding` ; alias de `getBindingIndex`. |

Types exportés : `ToolBinding`, `GeneratedToolWithBinding` (alias de `GeneratedTool` dans le paquet).

## Prompts et ressources

| Export | Signature | Description |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Liste tous les prompts générés. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Résout un prompt par son nom ; renvoie `null` si inconnu. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Liste les ressources du catalogue. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Lit une ressource à partir de son URI. |

## Création et exécution des requêtes

| Export | Signature | Description |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Sérialise les arguments en `{ url, query, headers, body, dropped }`. Arguments positionnels. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Exécute un outil généré sur l’API amont. Les réponses non-2xx sont renvoyées comme données ; les erreurs de transport lèvent une exception. |

Champs de `ToolCallResult` : `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Utilitaires de spécification

| Export | Description |
| --- | --- |
| `iterateOperations(spec, issues?)` | Générateur parcourant toutes les opérations résolues, y compris `additionalOperations` d’OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Fusionne les paramètres du chemin et de l’opération selon la clé `(name, in)`. |
| `normalizeParameter(candidate)` | Normalise un paramètre brut ; renvoie `null` s’il est inutilisable. |
| `synthesizeOperationId(method, pathTemplate)` | Identifiant de remplacement déterministe lorsqu’une opération omet `operationId`. |
| `ensureUniqueName(candidate, taken)` | Ajoute un suffixe numérique pour garantir l’unicité du nom. |
| `extractPathTemplateVariables(pathTemplate)` | Extrait les variables `{name}`, dédupliquées en conservant la première occurrence. |
| `effectiveStyle(parameter)` | Applique la valeur par défaut de `style` définie par la spécification. |
| `effectiveExplode(parameter)` | Applique la valeur par défaut de `explode` définie par la spécification. |
| `findOperationById(spec, operationId)` | Recherche en O(1) après la première construction ; renvoie `null` si inconnu. |
| `findDuplicateOperationIds(spec)` | Signale les identifiants en double déclarés par l’auteur. |
| `assertUniqueOperationIds(spec)` | Lève une exception en cas d’identifiants d’opération en double. |
| `isPlainObject(value)` | Affine le type vers un objet simple. |
| `truncateGeneratedName(name, limit=64)` | Raccourcit un nom en préservant son unicité. |

Types exportés : `OperationEntry`, `DuplicateOperationId`.

## Serveur MCP et transports

| Export | Description |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Construit un `Server` du SDK avec les gestionnaires d’outils, prompts et ressources. Arguments positionnels. |
| `startStdioServer(spec, context?, options?)` | Fournit un document via stdio ; renvoie `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Monte les routes Streamable HTTP (`/mcp`) et, en option, l’ancien SSE (`/sse`). Accepte `AttachMcpRoutesOptions` et renvoie `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Wrapper obsolète à arguments positionnels. Renvoie `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Crée un hôte de sessions Streamable HTTP autonome pour des intégrations de transport personnalisées. |

Types : `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` est exporté à la racine du paquet. Ses options règlent `maxSessions`, `allowedOrigins`, `sessionIdleMs` et la protection contre le DNS rebinding. Le handle expose `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` et `dispose`. À l’arrêt, appelez `dispose()` pour arrêter le nettoyage périodique et fermer les sessions.

## Serveur d’administration et authentification (sous-chemin `./server`) {#admin-server-and-auth-server-subpath}

Importez `startAdminServer` depuis `@powerduck/openapi-mcp-server/server` ou la racine du paquet. Importez `createAuthMiddleware` depuis la racine ; le sous-chemin `./server` ne l’exporte pas.

| Export | Signature | Description |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Lance l’application Express d’administration avec interface web et routes MCP. Renvoie `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Contrôle d’accès Bearer ou `x-api-key`. Omettez la clé pour le désactiver. Argument positionnel. |

## Exécution et utilitaires

| Export | Description |
| --- | --- |
| `ServiceRegistry` | Classe de `ManagedServiceRecord` : `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Vrai pour `AbortError` ou `CanceledError` d’axios. |
| `newId()` | UUID, avec une valeur de secours horodatée. |

## CLI

Exécutable **`openapi-mcp`**. Une seule commande, `serve` :

```
openapi-mcp serve [options]
```

| Option | Valeur par défaut | Description |
| --- | --- | --- |
| `--port <n>` | `3000` | Port HTTP du transport web. |
| `--host <host>` | `127.0.0.1` | Hôte HTTP. |
| `--transport <mode>` | `web` | `stdio` ou `web`. |
| `--spec <path>` | — | Chemin du fichier OpenAPI, obligatoire en mode stdio. |
| `--base-url <url>` | — | Remplace l’URL de base amont. |
| `--api-key <key>` | — | Clé API d’administration. |
| `--upstream-header "Name: value"` | — | En-tête amont répétable. |
| `--timeout <ms>` | `30000` | Délai maximal amont. |
| `--no-persist` | — | Désactive la persistance de l’état. |

## Types (réexportés depuis `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult` ; `ResolvedPrompt` est obsolète. Fonctions de garde : `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Erreurs et comportement

- Un identifiant d’outil, de prompt ou de ressource inconnu produit une erreur MCP `InvalidParams`, pas un échec encodé dans le résultat normal.
- Une spécification absente pendant une session active provoque une `InternalError`.
- Les réponses amont 4xx/5xx sont renvoyées au modèle comme contenu avec `isError: true`, sans exception. Seuls les échecs de transport (DNS, TLS, expiration du délai, annulation) lèvent une exception.

## Voir aussi

- [Configuration](../configuration/)
- [Exemples](../examples/)

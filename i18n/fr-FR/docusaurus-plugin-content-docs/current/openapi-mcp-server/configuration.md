---
sidebar_position: 4
title: "Configuration"
description: "Configuration complète de @powerduck/openapi-mcp-server : ServerConfig, SecurityContext, ExecutionContext, TransportMode et unions littérales pour les sources, états, protocoles, niveaux de journalisation et encodages du corps."
---

# Configuration

L’objet central de configuration est `ServerConfig`, accepté par `startAdminServer()`. Les types de contexte associés interviennent dans l’exécution des outils.

## `ServerConfig`

Seul `port` est obligatoire.

| Champ | Type | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `port` | `number` | — (obligatoire) | Port TCP d’écoute, entier de 0 à 65535. |
| `host` | `string` | `"127.0.0.1"` | Interface d’écoute ; boucle locale par défaut pour éviter une exposition accidentelle. |
| `apiKey` | `string` | undefined | Secret partagé exigé par l’API d’administration et le transport HTTP lorsqu’il est défini. |
| `specPath` | `string` | undefined | Spécification chargée une seule fois au démarrage. |
| `baseUrlOverride` | `string` | undefined | Remplace l’URL de base amont issue de `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | En-têtes ajoutés à chaque requête amont. |
| `requestTimeoutMs` | `number` | undefined | Délai maximal par requête amont, en millisecondes. |
| `persistState` | `boolean` | `true` | Conserve la spécification chargée entre les redémarrages. |
| `stateFilePath` | `string` | undefined | Emplacement du fichier d’état persistant. |
| `allowedOrigins` | `string[]` | undefined | Origines CORS autorisées ; une liste vide ou absente désactive l’accès interorigine. |
| `allowedHosts` | `string[]` | undefined | Valeurs autorisées de l’en-tête `Host`. |
| `maxLogEntries` | `number` | 200 | Nombre maximal d’entrées de journal conservées en mémoire. |
| `redactSensitiveHeaders` | `boolean` | `true` | Masque les valeurs des en-têtes sensibles avant journalisation. |
| `redactHeaderNames` | `string[]` | undefined | Noms d’en-têtes supplémentaires à masquer, en plus de la liste intégrée. |
| `security` | `SecurityContext` | undefined | Identifiants transmis à l’API amont pour chaque appel d’outil. |

## `SecurityContext`

| Champ | Type | Envoyé sous la forme |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Paires exactes nom d’en-tête/valeur. |

Les identifiants sont injectés par l’exécuteur et ne sont jamais exposés au modèle comme arguments d’outil.

## `ExecutionContext`

Contexte par appel transmis à `executeToolCall` et renvoyé par un `ContextProvider` :

| Champ | Type | Description |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Remplace l’URL du serveur de la spécification pour cet appel. |
| `upstreamHeaders` | `Record<string, string>` | En-têtes amont supplémentaires. |
| `requestTimeoutMs` | `number` | Délai maximal par appel, avec un minimum de 1 seconde. |
| `security` | `SecurityContext` | Identifiants propres à l’appel. |
| `correlationId` | `string` | Relie les entrées de journal d’une même invocation. |
| `protocol` | `ProtocolHint` | Transport à l’origine de l’appel. |
| `onLog` | `(entry) => void` | Reçoit les entrées de journal des requêtes et réponses ; ne doit jamais lever d’exception. |
| `signal` | `AbortSignal` | Annule une requête amont en cours. |

## Unions littérales et fonctions de garde

| Union | Valeurs | Fonction de garde |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Transmis comme troisième argument à `buildMcpServer()` :

| Champ | Type | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Indication de protocole annoncée. |
| `name` | `string` | `"openapi-mcp"` | Nom du serveur annoncé. |
| `version` | `string` | `"1.1.0"` | Version du serveur annoncée. |
| `pageSize` | `number` | 100 | Nombre maximal d’entrées par réponse de liste, plafonné à 500. |
| `instructions` | `string` | intégré | Conseil d’utilisation exposé dans le champ MCP `instructions`. |

## Options de la couche de transport (`AttachMcpRoutesOptions`)

Importez `attachMcpRoutes` depuis `@powerduck/openapi-mcp-server` et passez un objet d’options en deuxième argument. L’ancien wrapper `attachSseRoutes()` n’accepte que les arguments positionnels `(app, specProvider, contextProvider, routeGuard?)`.

| Champ | Type | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (obligatoire) | Fournit le document pour les nouvelles sessions. |
| `contextProvider` | `ContextProvider` | — (obligatoire) | Fournit le contexte amont pour chaque appel. |
| `routeGuard` | `RequestHandler` | undefined | Middleware appliqué à chaque route MCP. |
| `maxSessions` | `number` | 64 | Limite de sessions simultanées. |
| `sessionIdleMs` | `number` | 600000 | Délai d’inactivité en millisecondes ; 0 le désactive. |
| `allowedOrigins` | `string[]` | undefined | Origines autorisées ; une liste non vide active la protection contre le DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Valeurs autorisées de l’en-tête `Host`. |
| `enableLegacySse` | `boolean` | `true` | Monte le transport HTTP+SSE obsolète. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Reçoit les événements du cycle de vie ; ne doit jamais lever d’exception. |

> Ces options appartiennent à `attachMcpRoutes` et ne sont pas des champs supplémentaires de `ServerConfig`. Le serveur d’administration transmet ses réglages d’origines et d’hôtes, mais conserve les limites de sessions et le délai d’inactivité par défaut du transport. Pour modifier ces limites, utilisez directement la fonction publique de transport.

## Voir aussi

- [Référence de l’API](../api-reference/)
- [Exemples](../examples/)

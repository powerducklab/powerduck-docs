---
sidebar_position: 1
title: "Présentation de @powerduck/openapi-request"
description: "@powerduck/openapi-request est un débogueur de collections et un moteur d’exécution de requêtes pour OpenAPI 3.2. À partir d’un document OpenAPI, il prépare et envoie les requêtes, reconnaît les réponses en streaming et peut produire un document actualisé à partir des réponses observées. Une interface compacte donne accès à six protocoles de communication."
---

# Présentation de @powerduck/openapi-request

`@powerduck/openapi-request` est un débogueur de collections et un moteur d’exécution de requêtes pour OpenAPI 3.2. À partir d’un document OpenAPI, il prépare et envoie les requêtes, reconnaît les réponses en streaming et peut produire un document actualisé à partir des réponses observées. Une interface compacte donne accès à six protocoles de communication.

- **Nom du paquet :** `@powerduck/openapi-request`
- **Version :** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Licence :** MIT
- **Format des modules :** distributions ESM et CommonJS, avec déclarations de types incluses.

## Rôle de la bibliothèque

La bibliothèque répond à trois besoins en prenant un même document comme référence :

- **Un client adapté aux interfaces graphiques** — `createClient()` renvoie un objet dont les méthodes `prepare()`, `send()`, `connect()`, `discover()` et `writeback()` correspondent aux étapes d’un éditeur graphique de requêtes.
- **Un débogueur pilotable par script** — `createDebugger()` renvoie un `ProtoKit` doté de `send()`, `sendMany()` et `toCollection()` pour l’automatisation, les scripts et la CI.
- **Des sessions persistantes à gestion manuelle** — `createManualSession()` renvoie un objet de session bidirectionnelle avec ouverture, envoi, fermeture et flux d’événements. Sa structure est identique pour WebSocket, MCP et gRPC : une même interface peut gérer les trois.

## Adaptateurs de protocole

Le cœur est indépendant du transport ; les comportements sont fournis par les adaptateurs de protocole enregistrés dans un `AdapterRegistry`.

- **HTTP / SSE** — prise en charge par défaut. Les requêtes JSON classiques et les flux Server-Sent Events sont reconnus automatiquement à partir des types de contenu déclarés ou des en-têtes de réponse réels.
- **WebSocket** — sessions bidirectionnelles texte ou binaires avec un format d’événement commun.
- **gRPC** — appels unaires, streaming serveur, streaming client et bidirectionnels à partir de fichiers `.proto` ou de la réflexion serveur.
- **MCP** — appels d’outils Model Context Protocol via Streamable HTTP ou stdio.
- **GraphQL** — introspection, génération et exécution d’opérations.

## Fonctionnalités principales

- **Modèle de collection OpenAPI 3.2** — recherche des opérations par `operationId` ou `method`+`path`, puis préparation des requêtes à partir des paramètres, des corps de requête et des exemples.
- **Détection du streaming** — `isStreamingOperation()`, `isSseContentType()` et `isStreamingContentType()` classent les réponses selon les types de contenu déclarés ; `probeStreamingResponse()` examine les en-têtes de réponse réels.
- **Réintégration des réponses** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` et `writeBackResponse()` déduisent les schémas de réponse et renvoient un document actualisé. Par défaut, `send()` le renvoie dans `patchedSpec` si la réintégration aboutit ; `writeBack: false` désactive ce comportement. Le document d’entrée n’est pas modifié et aucun fichier n’est enregistré automatiquement. Vérifiez `writeBackSkippedReason` et `writeBackWarnings` avant de sauvegarder le résultat.
- **Utilitaires de schéma** — `sampleFromSchema()` génère des exemples de données à partir d’un schéma.
- **Chargement différé des dépendances lourdes** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) et MCP (`@modelcontextprotocol/sdk`) sont chargés à la première utilisation. Un usage limité à HTTP évite ainsi leur coût de chargement.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Démarrage rapide

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Pour aller plus loin

- [Installation](./installation.md) — organisation du paquet, exports par sous-chemin et dépendances homologues pour les fonctionnalités de protocole.
- [Démarrage rapide](./quickstart.md) — première requête, exécution du débogueur et session manuelle.
- [Configuration](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` et configuration par protocole.
- [Référence API](./api-reference.md) — tous les exports regroupés par fonctionnalité.
- [Exemples](./examples.md) — exemples exécutables pour HTTP, SSE, WebSocket, GraphQL, MCP et gRPC.

## Licence

MIT.

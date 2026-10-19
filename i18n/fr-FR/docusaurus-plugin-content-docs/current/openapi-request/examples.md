---
sidebar_position: 6
title: "Exemples"
description: "Ces exemples d’intégration utilisent l’API publique"
---

# Exemples

Ces exemples d’intégration utilisent l’API publique. Fournissez dans `spec` un document OpenAPI 3.2 chargé, contenant les identifiants d’opération et les chemins utilisés dans chaque exemple. Remplacez les URL, jetons et chemins de fichiers locaux par vos propres valeurs. Les exemples réseau nécessitent un service accessible ; ils ne constituent pas des serveurs de simulation autonomes.

## 1. Requête HTTP avec SendOptions

`prepare()` et `send()` acceptent tous deux un objet `SendOptions` contenant `spec`, `target` et `values`.

```typescript
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Create client and debugger (options are optional)
const client = createClient();
const dbg = createDebugger();

// Plan a request by operationId
const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

console.log(plan.protocol);      // "http"
console.log(plan.display.mode);  // "response"
console.log(plan.stream.kind);   // "none"

// Send the request with concrete values
const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: {
    path: { id: "42" },
    query: { include: "profile" },
  },
  serverUrl: "https://api.example.com",
  auth: { type: "bearer", token: "your-token" },
  timeout: 15000,
});

console.log(result.response.status);   // e.g. 200
console.log(result.response.body);     // body value returned by the adapter
console.log(result.response.headers);  // response headers
console.log(result.response.timings.durationMs); // request duration in ms
```

### Cibler une opération par méthode et chemin

```typescript
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### Exécution par lots avec sendMany

```typescript
const batch = await dbg.sendMany(
  spec,
  [
    { target: { operationId: "listUsers" } },
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "2" } } },
  ],
  {
    serverUrl: "https://api.example.com",
    auth: { type: "bearer", token: "your-token" },
  },
);

batch.results.forEach((r, i) => {
  if ("error" in r) {
    console.log(`Request ${i} failed:`, r.error);
  } else {
    console.log(`Request ${i} status:`, r.response.status);
  }
});
```

## 2. Flux SSE

Lorsqu’une réponse déclare `text/event-stream`, le client prévoit automatiquement le mode d’affichage `event-list`.

```typescript
const plan = client.prepare({
  spec,
  target: { operationId: "streamEvents" },
});

console.log(plan.stream.kind);   // "sse"
console.log(plan.display.mode);   // "event-list"
```

### Sonder un point de terminaison réel

```typescript
import { probeStreamingResponse } from "@powerduck/openapi-request";

const probe = await probeStreamingResponse("https://api.example.com/events");
console.log(probe.kind, probe.status); // "sse" | "ndjson" | "chunked" | "none"
// The probe performs a request; consume or cancel its response body.
await probe.response.body?.cancel();
```

### Analyser un flux SSE

```typescript
import { SseParser } from "@powerduck/openapi-request/http";

const response = await fetch("https://api.example.com/events");
if (!response.ok || !response.body) throw new Error("SSE response unavailable");
const parser = new SseParser();
const reader = response.body.getReader();
try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const event of parser.push(value)) console.log(event.event, event.data);
  }
  for (const event of parser.flush()) console.log(event.event, event.data);
} finally {
  await reader.cancel();
  reader.releaseLock();
}
```

## 3. Session WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

// Subscribe before opening so connection events are included.
const subscription = session.onEvent((event) => {
  console.log("Event:", event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "subscribe", channel: "updates" });
  // Keep the session open for as long as your application needs it.
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

## 4. Opération GraphQL

```typescript
import {
  discoverAndWriteGraphQLSchema,
  runGraphQL,
} from "@powerduck/openapi-request/graphql";

const endpoint = "https://api.example.com/graphql";
const headers = { Authorization: `Bearer ${token}` };

// Returns a new spec; introspection must be enabled by the server.
const discovered = await discoverAndWriteGraphQLSchema(spec, endpoint, { headers });
console.log(discovered.spec, discovered.warnings);

// Execute an explicit query with a matching server schema.
const result = await runGraphQL({
  endpoint,
  headers,
  query: "query GetUser($id: ID!) { user(id: $id) { id name } }",
  operationName: "GetUser",
  variables: { id: "42" },
  useGet: false,
}, {
  spec,
  target: { operationId: "getUserById" },
  timeout: 15000,
});
console.log(result.response.body);
```

## 5. Appel d’un outil MCP (HTTP et stdio)

```typescript
import { createManualSession } from "@powerduck/openapi-request";

// Streamable HTTP
const httpSession = createManualSession({
  kind: "mcp",
  endpoint: "https://mcp.example.com/mcp",
  headers: { Authorization: `Bearer ${token}` },
});

// stdio child process
const stdioSession = createManualSession({
  kind: "mcp",
  transport: "stdio",
  command: "node",
  args: ["./mcp-server.js"],
});

// Only the HTTP session is opened here. Opening stdioSession starts its process.
try {
  await httpSession.open();
  const outcome = await httpSession.send({
    method: "tools/call",
    params: { name: "get_user", arguments: { id: "42" } },
  });
  console.log(outcome);
} finally {
  await httpSession.close();
}
```

## 6. Appel unaire gRPC

```typescript
import { grpcCall } from "@powerduck/openapi-request/grpc";

const result = await grpcCall({
  address: "grpc.example.com:50051",
  service: "helloworld.Greeter",
  method: "SayHello",
  protoPaths: ["./protos/helloworld.proto"],
  metadata: { "x-tenant": "acme" },
  deadlineMs: 5000,
}, {
  messages: [{ name: "World" }],
});

console.log(result.messages); // decoded response(s)
console.log(result.status);   // { code, codeName, details }
```

La même fonction gère les flux serveur, client et bidirectionnels avec `options.messages` et des limites telles que `maxMessages`, `idleTimeoutMs` et `maxSessionMs`. Pour un flux de longue durée, utilisez `createGrpcManualSession()`.

## 7. Réécriture des réponses dans la spécification

```typescript
import { writeBackResponse, toResponseObject, locateOperation } from "@powerduck/openapi-request";

// Locate the operation
const located = locateOperation(spec, { operationId: "getUserById" });

// Build a response object from the result
const fragment = toResponseObject(result, {
  // Optional: response normalization options
});

// Write back into the spec
const updated = writeBackResponse(
  spec,
  located.path,
  located.method,
  fragment,
  {
    // Optional: WriteBackOptions
    overwriteExamples: true,
  },
);
```

`writeBackResponse()` renvoie une copie modifiée sans enregistrer de fichier. Vérifiez les exemples capturés avant de les publier. Contrairement au pipeline d’envoi du débogueur, cette fonction de bas niveau n’applique pas `requirePassingTests`.

### Déduire un schéma et générer un exemple à partir d’une réponse

```typescript
import { inferSchema, sampleFromSchema } from "@powerduck/openapi-request";

// Use this for JSON responses; handle parse errors for non-JSON bodies.
const body = result.response.body;
const schema = inferSchema(typeof body === "string" ? JSON.parse(body) : body);

// Generate a realistic sample from the schema
const sample = sampleFromSchema(schema);
```

## Voir aussi

- [Démarrage rapide](./quickstart.md)
- [Référence API](./api-reference.md)
- [Configuration](./configuration.md)

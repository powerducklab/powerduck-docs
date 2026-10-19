---
sidebar_position: 1
title: "Einführung in @powerduck/openapi-request"
description: "@powerduck/openapi-request ist ein Collection-Debugger und eine Laufzeitumgebung für Anfragen auf Basis von OpenAPI 3.2. Die Bibliothek plant und sendet Anfragen anhand eines OpenAPI-Dokuments, erkennt Streaming-Antworten und kann aus beobachteten Antworten ein aktualisiertes Dokument erzeugen. Eine kompakte Schnittstelle unterstützt sechs Kommunikationsprotokolle."
---

# Einführung in @powerduck/openapi-request

`@powerduck/openapi-request` ist ein Collection-Debugger und eine Laufzeitumgebung für Anfragen auf Basis von OpenAPI 3.2. Die Bibliothek plant und sendet Anfragen anhand eines OpenAPI-Dokuments, erkennt Streaming-Antworten und kann aus beobachteten Antworten ein aktualisiertes Dokument erzeugen. Eine kompakte Schnittstelle unterstützt sechs Kommunikationsprotokolle.

- **Paketname:** `@powerduck/openapi-request`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Lizenz:** MIT
- **Modulformat:** ESM- und CommonJS-Builds mit enthaltenen Typdeklarationen.

## Einsatzbereiche

Die Bibliothek deckt drei Anforderungen ab und verwendet dabei dasselbe Dokument als maßgebliche Grundlage:

- **Client für grafische Oberflächen** — `createClient()` liefert ein Objekt mit `prepare()`, `send()`, `connect()`, `discover()` und `writeback()`. Die Methoden entsprechen den Arbeitsschritten eines grafischen Anfrage-Editors.
- **Skriptgesteuerter Debugger** — `createDebugger()` liefert ein `ProtoKit` mit `send()`, `sendMany()` und `toCollection()` für Automatisierung, Skripte und CI.
- **Langlebige, manuell gesteuerte Sitzungen** — `createManualSession()` liefert ein bidirektionales Sitzungsobjekt mit Öffnen, Senden, Schließen und Ereignisstrom. Für WebSocket, MCP und gRPC ist die Struktur gleich, sodass eine gemeinsame Oberfläche alle drei steuern kann.

## Protokolladapter

Der Kern ist unabhängig vom Transport. Das jeweilige Verhalten stellen Protokolladapter bereit, die in einer `AdapterRegistry` registriert sind.

- **HTTP / SSE** — standardmäßig unterstützt. Gewöhnliche JSON-Anfragen und Server-Sent-Events-Streams werden anhand deklarierter Inhaltstypen oder tatsächlicher Antwort-Header automatisch erkannt.
- **WebSocket** — bidirektionale Text- und Binärsitzungen mit einheitlicher Ereignisstruktur.
- **gRPC** — unäre Aufrufe, Server-Streaming, Client-Streaming und bidirektionales Streaming auf Basis von `.proto`-Dateien oder Server-Reflection.
- **MCP** — Aufrufe von Model-Context-Protocol-Tools über Streamable HTTP oder stdio.
- **GraphQL** — Introspektion sowie Erzeugung und Ausführung von Operationen.

## Zentrale Funktionen

- **Collection-Modell für OpenAPI 3.2** — Operationen werden über `operationId` oder `method`+`path` gefunden; Parameter, Anfragekörper und Beispiele dienen zur Anfrageplanung.
- **Streaming-Erkennung** — `isStreamingOperation()`, `isSseContentType()` und `isStreamingContentType()` klassifizieren Antworten anhand deklarierter Inhaltstypen. `probeStreamingResponse()` untersucht die tatsächlichen Antwort-Header.
- **Antworten zurückschreiben** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` und `writeBackResponse()` leiten Antwortschemata ab und liefern ein aktualisiertes Dokument. Bei erfolgreichem Zurückschreiben gibt `send()` dieses standardmäßig als `patchedSpec` zurück; `writeBack: false` deaktiviert das Verhalten. Das Eingabedokument bleibt unverändert, und es wird keine Datei automatisch gespeichert. Prüfen Sie vor dem Speichern `writeBackSkippedReason` und `writeBackWarnings`.
- **Schema-Hilfsfunktionen** — `sampleFromSchema()` erzeugt Beispieldaten aus einem Schema.
- **Verzögertes Laden großer Abhängigkeiten** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) und MCP (`@modelcontextprotocol/sdk`) werden erst bei der ersten Verwendung geladen. Bei ausschließlicher HTTP-Nutzung entfällt dieser Ladeaufwand.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Schnellstart

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

## Weitere Schritte

- [Installation](./installation.md) — Paketstruktur, Unterpfad-Exporte und Peer-Abhängigkeiten für Protokollfunktionen.
- [Schnellstart](./quickstart.md) — erste Anfrage, Debugger-Ausführung und manuelle Sitzung.
- [Konfiguration](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` und protokollspezifische Einstellungen.
- [API-Referenz](./api-reference.md) — sämtliche Exporte nach Funktionsbereich.
- [Beispiele](./examples.md) — ausführbare Beispiele für HTTP, SSE, WebSocket, GraphQL, MCP und gRPC.

## Lizenz

MIT.

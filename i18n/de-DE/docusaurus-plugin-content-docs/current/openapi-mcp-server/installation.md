---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/openapi-mcp-server mit npm, yarn oder pnpm oder global. Enthält die CLI openapi-mcp und den Unterpfad ./server; benötigt Node.js 22.12.0 oder neuer."
---

# Installation

## Voraussetzungen

- **Node.js `>=22.12.0`** (in `engines` angegeben).

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

Das Paket registriert das Programm `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

Die CLI bietet einen einzigen Befehl, `serve` (siehe [Schnellstart](/docs/de-DE/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Beide Build-Formate enthalten Typdeklarationen. Zusätzliche `@types/*`-Pakete sind nicht nötig:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Unterpfad-Export

| Import | Inhalt |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Kernbibliothek: Laden von Spezifikationen, Erzeugen von Tools, Prompts und Ressourcen, Ausführen von Anfragen, Aufbau des MCP-Servers sowie stdio- und HTTP-Transporte. |
| `@powerduck/openapi-mcp-server/server` | HTTP-Administrationsserver und Authentifizierungs-Middleware (`startAdminServer`, `createAuthMiddleware`). |

## Laufzeitabhängigkeiten

Diese Abhängigkeiten werden automatisch mit dem Paket installiert:

- `@modelcontextprotocol/sdk` — Implementierung des MCP-Protokolls.
- `@powerduck/openapi-parser` — OpenAPI-Validierung, Referenzauflösung und Aktualisierung.
- `express` und `cors` — HTTP-Administrationsserver und CORS.
- `axios` — HTTP-Client zum Aufruf des Zielservers bei der Werkzeugausführung.
- `commander` — CLI-Framework.
- `js-yaml` — YAML-Parsing.
- `multer` — Verarbeitung hochgeladener Spezifikationen.
- `terser` — Minifizierung der eingebetteten Weboberflächen-Dateien.

## Überprüfung

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Nächste Schritte

- [Schnellstart](/docs/de-DE/openapi-mcp-server/quickstart/)
- [Konfiguration](/docs/de-DE/openapi-mcp-server/configuration/)

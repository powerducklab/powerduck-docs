---
sidebar_position: 1
title: "Einführung"
description: "OpenAPI in MCP-Dienste umwandeln: Tools, Prompts und Ressourcen, Webverwaltung, stdio, HTTP und die openapi-mcp-CLI."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Einführung

`@powerduck/openapi-mcp-server` wandelt ein OpenAPI-Dokument in einen laufenden MCP-Dienst (Model Context Protocol) um. Aus Operationen entstehen **Tools**, aus API-Metadaten und Operationen **Prompts** und aus dem API-Katalog **Ressourcen**. Der Dienst stellt sie über MCP bereit und enthält eine Weboberfläche zur Verwaltung.

- **Paketname:** `@powerduck/openapi-mcp-server`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Lizenz:** MIT
- **Node-Version:** `>=22.12.0`
- **CLI-Programm:** `openapi-mcp`
- **Modulformat:** ESM- und CommonJS-Builds mit enthaltenen Typdeklarationen.

Validierung und Auflösung von Referenzen übernehmen `@powerduck/openapi-parser`, die Protokollimplementierung basiert auf `@modelcontextprotocol/sdk`.

## Generierte Inhalte

- **Tools** — Ein MCP-Tool je OpenAPI-Operation, einschließlich Parameterserialisierung (path/query/header/cookie-Stile und explode-Regeln), Kodierung des Request-Bodys (JSON, form-urlencoded, multipart, Text, Binärdaten) und MCP-Tool-Annotationen (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Globale Prompts (`spec_overview`, `integration_guardrails`) sowie Prompts je Operation (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Feste Katalogressourcen wie `openapi://spec/summary`, `openapi://catalog/tools` und `openapi://spec/document`.

## Transportwege

- **stdio** — `startStdioServer()` stellt einem lokalen MCP-Client (Claude Desktop oder Editorintegration) ein Dokument bereit.
- **HTTP** — `attachMcpRoutes(app, options)` bindet Streamable HTTP unter `/mcp` und optional älteres SSE unter `/sse` in Ihre Express-App ein. Die Optionen steuern Sitzungslimits, Leerlaufzeitlimits, CORS und Schutz vor DNS-Rebinding. `startAdminServer()` ergänzt die Verwaltungsoberfläche und nutzt die Standardsitzungslimits. `attachSseRoutes()` bleibt als veralteter Wrapper mit Positionsargumenten erhalten.

## Verwaltungsserver

`startAdminServer()` startet eine Express-App mit:

- einer Webverwaltung zum Hochladen oder Einfügen von Spezifikationen, Prüfen von Tools, Prompts und Ressourcen sowie Anzeigen laufender Dienste und Anfrageprotokolle;
- den MCP-HTTP-Transporten;
- API-Schlüssel-Authentifizierung, Anfrageprotokollierung mit Maskierung vertraulicher Header und optionaler Zustandsspeicherung.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Schnellstart

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Nächste Schritte

- [Installation](../installation/) — npm/yarn/pnpm, globale Installation, Unterpfad `./server` und Abhängigkeiten.
- [Schnellstart](../quickstart/) — CLI und programmatische Verwendung.
- [Konfiguration](../configuration/) — Vollständige Beschreibung von `ServerConfig`.
- [API-Referenz](../api-reference/) — Alle Exporte und CLI-Befehle.
- [Beispiele](../examples/) — Anwendungsbeispiele.

## Lizenz

MIT.

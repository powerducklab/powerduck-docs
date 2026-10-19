---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/openapi-cli global, als Entwicklungsabhängigkeit oder mit npx. Erfordert Node.js 22.12.0 oder neuer."
---

# Installation

## Voraussetzungen

- **Node.js**: `>= 22.12.0` (im Feld `engines` des Pakets angegeben).
- Ein Paketmanager: npm, yarn oder pnpm.

Das Paket enthält ESM- (`dist/index.js`) und CommonJS-Builds (`dist/index.cjs`) sowie TypeScript-Deklarationen (`dist/index.d.ts`). Zusätzliche `@types`-Pakete sind nicht nötig.

## Globale Installation (für die CLI empfohlen)

Die globale Installation macht das Programm `openapi-cli` über deinen `PATH` verfügbar:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Prüfe das Programm:

```bash
openapi-cli --help
```

## Projektlokale Installation (für CI empfohlen)

Lege die Version im Projekt fest, damit CI eine bekannte Version verwendet:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Rufe das Programm anschließend über deinen Paketmanager auf:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Einmaliger Aufruf mit npx

Ohne vorherige Installation:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Paketstruktur

| Einstiegspunkt | Pfad |
|-------|------|
| ESM-Einstiegspunkt | `dist/index.js` |
| CommonJS-Einstiegspunkt | `dist/index.cjs` |
| Typdefinitionen | `dist/index.d.ts` |
| CLI-Einstiegspunkt (bin) | `dist/cli.js` |
| Programmname | `openapi-cli` |

Das Paket deklariert `"type": "module"` und stellt nur die Unterpfade `.` und `./package.json` bereit.

## Programmatischer Import

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Laufzeitabhängigkeiten

Das veröffentlichte Paket benötigt:

- `@powerduck/openapi-parser` (`^0.3.12`) — Auflösung interner `$ref`-Verweise.
- `@powerduck/openapi-request` (`0.2.22`) — Ausführung von Protokollanfragen.
- `commander` (`^12.1.0`) — Auswertung der CLI-Argumente.
- `https-proxy-agent` (`^5.0.1`) — Proxy-Unterstützung für den HTTP-Transport.

## Nächste Schritte

- [Schnellstart](/docs/de-DE/openapi-cli/quickstart/) — führe deine erste Testsuite aus.
- [Befehle](/docs/de-DE/openapi-cli/commands/) — vollständige Referenz der Optionen.

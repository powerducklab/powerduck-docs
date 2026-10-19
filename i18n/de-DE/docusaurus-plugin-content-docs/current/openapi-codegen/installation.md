---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/openapi-codegen mit npm, yarn oder pnpm für Node.js oder den Browser. Erfordert Node.js 22.12.0 oder neuer."
---

# Installation

## Voraussetzungen

- **Node.js**: `>= 22.12.0` (im Feld `engines` des Pakets angegeben) für die Nutzung unter Node.js.
- Ein **bereits geparstes** OpenAPI-Dokument als JavaScript-Objekt, nicht als rohe JSON-/YAML-Zeichenfolge.
- Ein moderner Browser mit Fetch-API für die Browsernutzung.

Das Paket enthält ESM- (`dist/index.js`) und CommonJS-Builds (`dist/index.cjs`) mit TypeScript-Deklarationen. Es hat **keine Laufzeitabhängigkeiten**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Nutzung unter Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Die integrierten Generatoren werden **beim Modulimport automatisch registriert**. Daher funktioniert `generate` sofort ohne zusätzliche Einrichtung.

## Nutzung im Browser

Die Bibliothek ist vollständig browserkompatibel und verwendet keine integrierten Node.js-Module. Lade sie über ein ESM-CDN und rufe sie direkt auf:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Auch Vite, esbuild und webpack funktionieren ohne zusätzliche Einrichtung. Der ESM-Build unterstützt Tree Shaking.

## Dokument übergeben

Übergib ein bereits geparstes Objekt. Für JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Parse YAML zunächst mit einem separaten YAML-Paket:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Paketstruktur

| Einstiegspunkt | Pfad |
|-------|------|
| ESM-Einstiegspunkt | `dist/index.js` |
| CommonJS-Einstiegspunkt | `dist/index.cjs` |
| Typdefinitionen | `dist/index.d.ts` |

Es gibt kein CLI-Programm; die Bibliothek wird ausschließlich aus Code aufgerufen.

## Nächste Schritte

- [Schnellstart](/docs/de-DE/openapi-codegen/quickstart/) — erzeuge dein erstes Codebeispiel.
- [Konfiguration](/docs/de-DE/openapi-codegen/configuration/) — alle Optionen zur Codegenerierung.

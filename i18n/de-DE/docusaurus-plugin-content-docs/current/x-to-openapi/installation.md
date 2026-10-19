---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/x-to-openapi mit npm, yarn oder pnpm. ESM mit CommonJS-Unterstützung und den konfigurationsfreien Funktionen curlToOpenApi und postmanToOpenApi."
---

# Installation

Installiere `@powerduck/x-to-openapi` mit deinem bevorzugten Paketmanager.

## Voraussetzungen

- **Node.js:** `>= 22.12.0`
- **TypeScript:** optional; vollständige Typdefinitionen sind enthalten.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Laufzeitabhängigkeiten

| Paket | Version | Verwendung |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Kanonische OpenAPI-Typen und Validierung der Ausgabe |
| `curlconverter` | `^4.12.0` | Parsen von curl-Befehlen in strukturierte Anfragen |

Beide Abhängigkeiten werden automatisch installiert.

---

## Modulsystem: ESM mit CJS-Unterstützung

Das Paket deklariert `"type": "module"` und liefert beide Builds über einen einzigen Einstiegspunkt:

| Build | Bedingung | Datei |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Typen | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

Das Paket deklariert `"sideEffects": false`, sodass Tree Shaking ungenutzte Adapter entfernt.

---

## Konfigurationsfreie Hilfsfunktionen

Meist reichen zwei Funktionen aus. Sie erstellen eine [`XToOpenApi`](/docs/de-DE/x-to-openapi/api-reference/#xtoopenapi)-Instanz, registrieren den passenden Adapter und rufen `convert` auf:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Nutze die vollständige Klasse [`XToOpenApi`](/docs/de-DE/x-to-openapi/api-reference/#xtoopenapi), wenn du eigene Optionen, mehrere Adapter, die Erkennung `"auto"` oder einen eigenen Adapter benötigst.

---

## Überprüfung

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Nächste Schritte

- [Schnellstart](/docs/de-DE/x-to-openapi/quickstart/) — konvertiere einen curl-Befehl und eine Postman-Sammlung und registriere einen eigenen Adapter.
- [API-Referenz](/docs/de-DE/x-to-openapi/api-reference/) — alle Exporte und Optionen.

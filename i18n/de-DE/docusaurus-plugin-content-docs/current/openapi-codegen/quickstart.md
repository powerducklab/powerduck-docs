---
sidebar_position: 3
title: "Schnellstart"
description: "Erzeuge mit @powerduck/openapi-codegen dein erstes ausführbares Anfragebeispiel und zeige die verfügbaren Generatoren an."
---

# Schnellstart

Diese Anleitung zeigt, wie du ein ausführbares Anfragebeispiel erzeugst und verfügbare Generatoren findest.

## 1. Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Aus einem Dokument generieren

Übergib ein **bereits geparstes** OpenAPI-Dokument sowie `path`, `method`, `language` und `client`. `generate()` gibt den Quellcode als Zeichenfolge zurück.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Entsprechendes Beispiel für CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Verfügbare Generatoren auflisten

`list()` gibt die Beschreibungen aller registrierten Generatoren zurück:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Jede Beschreibung hat die Form `{ language: string; client: string }`. Die Bezeichner unterscheiden Groß- und Kleinschreibung. Übernimm sie genau aus der Generatorliste in der API-Referenz. [API-Referenz](/docs/de-DE/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Du kannst einen Generator auch programmatisch auswählen:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Zugangsdaten angeben

Verwende `securityValues`, um benannte Sicherheitsschemas mit Werten zu belegen. Die Schlüssel müssen den Schemanamen im Dokument entsprechen:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Server-URL überschreiben

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Fehlerbehandlung

`generate()` löst bei fehlenden Eingaben oder nicht unterstützten Generatoren eine Ausnahme aus. Fange diese beim Verarbeiten nicht vertrauenswürdiger Dokumente ab:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Nächste Schritte

- [Konfiguration](/docs/de-DE/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Beispiele](/docs/de-DE/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, eigene Generatoren, Plugins und direkte Verwendung von `RequestIR`.
- [API-Referenz](/docs/de-DE/openapi-codegen/api-reference/) — Alle Exporte.

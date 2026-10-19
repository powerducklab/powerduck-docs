---
sidebar_position: 1
title: "Einführung"
description: "Mit @powerduck/openapi-codegen ausführbare HTTP-Beispiele aus OpenAPI erzeugen: 21 Sprachen, 41 Clients, browserfähig und ohne Laufzeitabhängigkeiten."
---

# Einführung

`@powerduck/openapi-codegen` ist eine TypeScript-Bibliothek, die eine OpenAPI-Operation in **ausführbaren HTTP-Anfragecode** für eine gewählte Sprache und einen HTTP-Client umwandelt. Sie eignet sich für API-Dokumentationsseiten, Entwicklerportale, API-Explorer, CLI-Werkzeuge und Codegenerierung während des Builds.

Sie unterstützt **21 Sprachen** und **41 Sprach-/Client-Kombinationen**, ist **browserfähig** und hat **keine Laufzeitabhängigkeiten**.

## Warum openapi-codegen?

- **Keine Laufzeitabhängigkeiten** — läuft im Browser, in Node.js, Electron und Edge-Umgebungen ohne eingebaute Node-Module.
- **Zwei Modulformate** — native ESM- und CommonJS-Builds (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — verarbeitet bereits geparste Dokumentobjekte. JSON und YAML sind möglich, wenn sie vor dem Aufruf von `generate()` geparst werden.
- **41 integrierte Generatoren** für 21 Sprachen, die beim Import automatisch registriert werden.
- **Vollständige Parameterserialisierung** — Pfad-, Query-, Header- und Cookie-Parameter nach den OpenAPI-Regeln `style` / `explode` / `allowReserved`.
- **Sicherheitsschemas** — API-Schlüssel in Header, Query oder Cookie sowie HTTP Bearer und HTTP Basic.
- **Body-Typen** — JSON, Klartext, URL-kodierte Formulardaten und `multipart/form-data`.
- **`$ref`-Auflösung** — dokumentinterne JSON-Pointer mit Cache, Referenzketten und Erkennung zyklischer Referenzen.
- **Automatische Beispiele** — leitet Beispielwerte aus JSON Schema ab (`example`, `enum`, `default`, Typen, Formate und Einschränkungen).
- **Plugins** — eigene Generatoren über `register()` oder `use()` registrieren.

## Funktionsweise

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` löst `$ref`s auf, führt Parameter auf Pfad- und Operationsebene zusammen, wählt den Medientyp des Anfragebodys, erzeugt Beispielwerte, löst Sicherheitsschemas auf und erstellt einen normalisierten `RequestIR`.
2. Der gewählte `Generator` erhält den `RequestIR` und gibt ausführbaren Quellcode als Zeichenfolge zurück.

Üblicherweise genügt der Aufruf `generate({...})`, der beide Schritte übernimmt.

## Kurzes Beispiel

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Nächste Schritte

- [Installation](/docs/de-DE/openapi-codegen/installation/) — npm / yarn / pnpm und Verwendung im Browser.
- [Schnellstart](/docs/de-DE/openapi-codegen/quickstart/) — Das erste Codebeispiel erzeugen und Generatoren auflisten.
- [Konfiguration](/docs/de-DE/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [API-Referenz](/docs/de-DE/openapi-codegen/api-reference/) — Alle Exporte sowie die vollständige Liste der Sprachen und Clients.
- [Beispiele](/docs/de-DE/openapi-codegen/examples/) — fetch, Python requests, cURL, eigene Generatoren, Plugins und direkter `RequestIR`.

---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi ist ein erweiterbares TypeScript-Framework, das curl-Befehle und Postman Collections (v2.0 / v2.1.0) in OpenAPI-3.2-Dokumente umwandelt. Es eignet sich für CI-Pipelines, die Erzeugung von API-Dokumentation und die Rekonstruktion von Schnittstellen aus HTTP-Anfragen."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** ist ein erweiterbares TypeScript-Framework, das **curl-Befehle** und **Postman Collections (v2.0 / v2.1.0)** in **OpenAPI-3.2**-Dokumente umwandelt. Es eignet sich für CI-Pipelines, die Erzeugung von API-Dokumentation und die Rekonstruktion von Schnittstellen aus HTTP-Anfragen.

Für die Dokumentvalidierung nutzt es [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser).

- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Lizenz:** MIT
- **Node.js-Voraussetzung:** `>= 22.12.0`
- **Ausgabe:** ausschließlich OpenAPI **3.2.0**
- **Quellcode:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Ablauf

```text
curl-Befehl → CurlAdapter
Postman Collection → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI-3.2-Dokument
             ↓
     validateOpenApi32() → Diagnosen
```

1. Ein **Adapter** zerlegt die Quelle, etwa curl-Text oder eine Postman Collection, in [`NormalizedRequest`](./api-reference.md#normalizedrequest)-Objekte.
2. Der **Builder** führt Anfragen nach Methode und Pfad zusammen, leitet Schemas, Pfadparameter und Sicherheitsdefinitionen ab und erzeugt ein OpenAPI-3.2-Dokument.
3. Der **Validator** prüft die Ausgabe anhand des OpenAPI-Schemas über `@powerduck/openapi-parser` und liefert Diagnosemeldungen.

---

## Funktionen

- **Zwei integrierte Adapter:** [`CurlAdapter`](./api-reference.md#curladapter) für einzelne und mehrere Befehle sowie die Browserausgabe „Copy all as cURL“; [`PostmanAdapter`](./api-reference.md#postmanadapter) für v2.0/v2.1.0, verschachtelte Ordner und vererbte Authentifizierung.
- **Hilfsfunktionen ohne Konfiguration:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) und [`postmanToOpenApi`](./api-reference.md) registrieren einen Adapter und konvertieren mit einem Aufruf.
- **OpenAPI-3.2-Ausgabe:** Jedes Dokument deklariert `openapi: "3.2.0"`. Die Validierung ist standardmäßig aktiv. Prüfen Sie die Diagnosemeldungen oder aktivieren Sie den strikten Modus, um Fehler zurückzuweisen.
- **Mehrere Anfragen zusammenführen:** Gleiche Methoden und Pfade werden kombiniert; Query-, Header- und Cookie-Parameter sowie Body-Schemas werden strukturell zusammengeführt.
- **Pfadparameter ableiten:** Numerische IDs, UUIDs, ULIDs und lange Hexadezimalabschnitte werden zu Platzhaltern wie `/users/{userId}`, wenn sie in mindestens N Beispielen variieren.
- **Sicherheit ableiten:** Bearer, Basic und API-Schlüssel in Headern, Query oder Cookies werden erkannt und in `securitySchemes` abgebildet.
- **Verschiedene Body-Formate:** JSON, XML, form-urlencoded, multipart/form-data mit Text und Dateien, GraphQL, Text und Binärdaten.
- **Postman-Testskripte erhalten:** `pm.test()` / `pm.expect()` werden pro Operation als `x-postman-scripts` ausgegeben.
- **Diagnosen:** Jedes Problem enthält Schweregrad und Code sowie gegebenenfalls Quelldetails; im Modus [`strict`](./api-reference.md#convertoptions) führen Fehler zu Ausnahmen.
- **Erweiterbar:** Implementieren Sie [`SourceAdapter`](./api-reference.md), um HAR, HTTPie oder Insomnia als Quellen hinzuzufügen.

---

## Plugin-Architektur

Das Framework basiert auf einer kleinen Adapterschnittstelle:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Adapter werden über eine [`AdapterRegistry`](./api-reference.md#adapterregistry) an einer [`XToOpenApi`](./api-reference.md#xtoopenapi)-Instanz registriert:

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Die Hilfsfunktionen binden beide integrierten Adapter bereits ein. Ein direkter Zugriff auf die Registry ist daher meist unnötig.

---

## Hilfsfunktionen oder Klasse?

| Anwendungsfall | API |
|---|---|
| Einen oder mehrere curl-Befehle konvertieren | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Eine Postman Collection als Objekt oder Zeichenfolge konvertieren | [`postmanToOpenApi`](./api-reference.md) |
| Eigene Optionen, mehrere Adapter, `"auto"`-Erkennung oder eigener Adapter | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Nächste Schritte

- [Installation](./installation.md) — Paket hinzufügen und Hilfsfunktionen kennenlernen.
- [Schnellstart](./quickstart.md) — curl-Befehle und Postman Collections konvertieren und einen eigenen Adapter verwenden.
- [API-Referenz](./api-reference.md) — alle Exporte, Typen, Optionen, Standardwerte und Diagnosecodes.
- [Beispiele](./examples.md) — curl, Stapelverarbeitung, Postman Collections, eigene Adapter und Pfadableitung.

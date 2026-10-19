---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch bearbeitet Konfigurationen mit einer klaren zweischichtigen Architektur. Die Bibliothek wendet RFC 6902 JSON Patch auf JSON-, JSONC- und YAML-Zeichenfolgen an, erhält Kommentare und Formatierung und ergänzt atomare Schreibvorgänge sowie prozessübergreifende Dateisperren für Node.js und Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** bearbeitet Konfigurationen mit einer klaren **zweischichtigen Architektur**. Die Bibliothek wendet [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) auf JSON-, JSONC- und YAML-Zeichenfolgen an, erhält Kommentare und Formatierung und ergänzt atomare Schreibvorgänge sowie prozessübergreifende Dateisperren für Node.js und Electron.

- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Lizenz:** MIT
- **Node.js-Voraussetzung:** `>= 22.12.0`
- **Quellcode:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Warum conf-patch?

Wer Konfigurationsdateien programmgesteuert bearbeitet, muss häufig zwischen einer vollständigen Neuserialisierung, die Kommentare und Formatierung verändern kann, und fehleranfälliger Textbearbeitung wählen. conf-patch bietet dafür:

- **Inkrementelle Änderungen unter Erhalt der Kommentare** für JSON/JSONC mit `jsonc-parser` sowie AST-basierte Änderungen für YAML mit `yaml`. JSON/JSONC wird nicht vollständig neu serialisiert; bei YAML wird der geänderte AST neu serialisiert.
- **Atomare Schreibvorgänge** über eine temporäre Datei und anschließendes Umbenennen, damit kein teilweise geschriebener Zieldateiinhalt entsteht.
- **Prozessübergreifende Dateisperren** mit Eigentümertoken, exponentiellen Wiederholungsabständen und Wiederherstellung veralteter Sperren.
- **Eine vielseitig einsetzbare API:** Die Kernschicht läuft auch in Browsern, Edge Functions und Anwendungen mit IndexedDB-Speicherung.

---

## Zweischichtige Architektur

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Kernschicht — `@powerduck/conf-patch/core` (browsergeeignet)

Reine Funktionen für **Zeichenfolgen**, ohne `node:fs`, `node:path` oder andere Node.js-spezifische APIs. Dieser Unterpfad kann in Browser-, Edge-Function- und Service-Worker-Code eingebunden werden.

| Funktion | Zweck |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | RFC-6902-Operationen auf eine Konfigurationszeichenfolge anwenden |
| [`setContentValue`](../api-reference/#setcontentvalue) | Einen verschachtelten Wert setzen oder anlegen (mit `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Einen Schlüssel oder ein Arrayelement entfernen (mit `remove`) |

### Dateischicht — `@powerduck/conf-patch` (Node.js / Electron)

Asynchrone Funktionen zum Lesen und Schreiben von Dateien, die die Kernschicht um atomare Schreibvorgänge und Sperren ergänzen.

| Funktion | Zweck |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | UTF-8-Text über einen Dateipfad oder eine `file://`-URL lesen |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Inhalte atomar schreiben, optional unter einer Sperre |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Lesen, Ändern und Schreiben innerhalb einer Dateisperre |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Einen verschachtelten Wert in einer Datei setzen |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Einen verschachtelten Wert aus einer Datei löschen |
| [`withFileLock`](../api-reference/#withfilelock) | Beliebige Aufgaben unter einer exklusiven Sperre ausführen |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Alle Sperren des aktuellen Prozesses freigeben |

---

## Unterstützte Formate

| Format | Erweiterung | Verhalten |
|---|---|---|
| **JSON** | `.json` | Standard-JSON; inkrementelle Änderungen mit `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON mit Kommentaren und nachgestellten Kommas. Kommentare bleiben erhalten. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. AST-Änderungen erhalten Kommentare, Anker und Einrückung. |

[`detectFormat`](../api-reference/#detectformat) ordnet Dateierweiterungen einem [`ConfigFormat`](../api-reference/#configformat) zu. Andere Erweiterungen lösen einen Fehler aus, sofern `format` nicht ausdrücklich angegeben wird.

---

## RFC-6902-Operationen

conf-patch implementiert eine gezielte Teilmenge von RFC 6902. Unterstützt werden genau diese Operationen:

| `op` | Verhalten |
|---|---|
| `"add"` | An einem Arrayindex einfügen oder eine Objekteigenschaft hinzufügen bzw. ersetzen |
| `"replace"` | Einen vorhandenen Wert ersetzen; der Pfad muss existieren |
| `"remove"` | Einen vorhandenen Schlüssel oder ein Arrayelement entfernen; der Pfad muss existieren |

:::caution
`"move"`, `"copy"` und `"test"` werden **nicht unterstützt**. Der Typ [`JsonPatchOp`](../api-reference/#jsonpatchop) beschränkt `op` auf `"add" | "replace" | "remove"`.
:::

Hinweise zum Verhalten:

- `add` **fügt** an einem Arrayindex ein (RFC 6902). Verwenden Sie `replace`, um ein vorhandenes Element zu ersetzen.
- Bei `add` muss der übergeordnete Pfad bereits existieren. Legen Sie Eltern vor ihren Kindern an.
- Bei `replace` und `remove` muss der Zielpfad existieren.
- Mit `strict: true` (Standard) führt eine fehlgeschlagene Operation zu einer Ausnahme. Mit `strict: false` wird sie übersprungen und eine Warnung protokolliert.

---

## Kommentare und Formatierung erhalten

- **JSON/JSONC:** Änderungen werden als Textbereiche anhand des Syntaxbaums berechnet. Umgebende Kommentare, nachgestellte Kommas und Einrückungen bleiben erhalten.
- **YAML:** Der `yaml`-AST wird direkt geändert und neu serialisiert. Kommentare, Anker, Aliasse und Einrückungen bleiben erhalten.

---

## OpenAPI-Validierung

conf-patch validiert OpenAPI-/Swagger-Dokumente über eine abgesicherte Schnittstelle zu `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) validiert Rohinhalte in JSON oder YAML.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) validiert ein Dokument anhand seines Dateipfads.
- Die Eingabeverarbeitung berücksichtigt Größenlimits, Pfadbeschränkungen (`allowedRootDirectory`), Strukturkomplexität, Zeitlimits und Abbruch über `AbortSignal`.
- Fehler lösen einen [`OpenApiValidationError`](../api-reference/#openapivalidationerror) mit einem maschinenlesbaren `code` aus.

---

## Nächste Schritte

- [Installation](../installation/) — conf-patch hinzufügen und die beiden Einstiegspunkte kennenlernen.
- [Schnellstart](../quickstart/) — eine Zeichenfolge im Browser und eine Datei auf dem Datenträger ändern.
- [API-Referenz](../api-reference/) — alle Exporte, Typen und Optionen.
- [Beispiele](../examples/) — ausführbare Beispiele für JSON, YAML, JSONC, OpenAPI-Validierung und Sperren.

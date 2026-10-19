---
sidebar_position: 1
title: "Einführung"
description: "@powerduck/openapi-cli ist ein Kommandozeilenwerkzeug, das ein OpenAPI-3.2-Dokument gesammelt gegen einen laufenden Server testet. Geben Sie eine Spezifikationsdatei oder URL an: Das Werkzeug führt die Operationen des Dokuments aus, prüft jede Antwort mit Assertions und erzeugt Berichte in drei Formaten."
---

# Einführung

`@powerduck/openapi-cli` ist ein Kommandozeilenwerkzeug, das ein OpenAPI-3.2-Dokument gesammelt gegen einen laufenden Server testet. Geben Sie eine Spezifikationsdatei oder URL an: Das Werkzeug führt die Operationen des Dokuments aus, prüft jede Antwort mit Assertions und erzeugt Berichte in drei Formaten.

Für die Anfrageausführung verwendet es [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request), für die Auflösung von `$ref`-Verweisen [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser).

## Warum openapi-cli?

- **Für CI geeignet** — standardmäßig signalisiert ein Exit-Code ungleich null fehlgeschlagene Tests oder Ausführungsfehler. Damit lässt sich das Werkzeug direkt in GitHub Actions, GitLab CI oder andere Pipelines integrieren.
- **Mehrere Protokolle ab Werk** — eine Spezifikation kann HTTP-, SSE-, WebSocket-, GraphQL-, gRPC- und MCP-Operationen beschreiben; derselbe Runner verarbeitet sie alle.
- **Zwei Arten von Assertions** — deklarative `x-tests`-Arrays für einfache Prüfungen und Skripte im Postman-Stil mit `pm.test()` / `pm.expect()` für komplexe Fälle.
- **Drei Berichtsformate** — maschinenlesbares JSON, farbige und gut lesbare CLI-Ausgabe sowie ein eigenständiger interaktiver HTML-Bericht.
- **Lokale oder entfernte Spezifikationen** — Laden über einen Dateipfad oder eine `http(s)://`-URL mit Weiterleitungen und Zeitlimit.
- **Flexible Filter** — Auswahl der auszuführenden Operationen nach Methode, Pfad, Tag oder operationId bei begrenzter Parallelität.

## Unterstützte Protokolle

Der Runner erkennt das Protokoll jeder Operation anhand von OpenAPI-Erweiterungen oder Antwort-Inhaltstypen:

| Protokoll | Kennung | Auswahl |
|----------|-----------|--------------------|
| HTTP | `http` | Standard für reguläre Operationen |
| Server-Sent Events | `sse` | Antwort-Inhaltstyp `text/event-stream` oder `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Das Protokoll lässt sich außerdem mit der Erweiterung `x-protocol` an der Operation oder am Pfadeintrag ausdrücklich festlegen.

## Berichte

Nach einem Lauf erzeugt das Werkzeug folgende Ausgaben; Dateien werden standardmäßig unter `./openapi-cli-report` gespeichert:

- `report.json` — das vollständige `TestReport`-Objekt als formatiertes JSON.
- `report.html` — ein eigenständiger HTML-Bericht ohne Abhängigkeiten mit Zusammenfassung, Fortschrittsbalken, Filterbuttons und aufklappbaren Testzeilen.
- Standardausgabe — eine farbige CLI-Zusammenfassung mit Fortschrittsbalken und Assertions für jeden Test.

## Verwendung im Programmcode

Dieselbe Pipeline steht als Bibliothek zur Verfügung. Lösen Sie die Konfiguration auf, führen Sie die Tests aus und wählen Sie anschließend die gewünschten Berichtsgeneratoren:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Weitere Schritte

- [Installation](./installation.md) — global oder als Entwicklungsabhängigkeit installieren.
- [Schnellstart](./quickstart.md) — die erste Testsuite ausführen.
- [Konfiguration](./configuration.md) — vollständige Referenz zu `CliConfig`.
- [Befehle](./commands.md) — sämtliche CLI-Optionen und Exit-Codes.
- [API-Referenz](./api-reference.md) — alle exportierten Funktionen und Typen.
- [Beispiele](./examples.md) — direkt ausführbare Anwendungsbeispiele.

---
sidebar_position: 3
title: "Schnellstart"
description: "Führe deine ersten Stapeltests mit @powerduck/openapi-cli über die CLI und aus Node.js aus."
---

# Schnellstart

Diese Anleitung führt dich durch den ersten Test eines OpenAPI-Dokuments.

## Voraussetzungen

- Node.js `>= 22.12.0`.
- Ein OpenAPI-3.2-Dokument im **JSON**-Format. YAML wird nicht akzeptiert; wandle es vorher in JSON um. Das Dokument muss auf oberster Ebene ein `paths`-Objekt enthalten.

## 1. Über die CLI ausführen

Der einfachste Aufruf lädt eine lokale Spezifikation und testet alle Operationen gegen die erste darin angegebene Server-URL:

```bash
openapi-cli --spec openapi.json
```

Überschreibe den Zielserver und schreibe Berichte in ein eigenes Verzeichnis:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Teste eine entfernte Spezifikation nur mit `GET`-Operationen und 10 parallelen Workern:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Verwende für komplexe Einstellungen eine JSON-Konfigurationsdatei:

```bash
openapi-cli --config openapi-cli.config.json
```

Alle Optionen findest du unter [Befehle](/docs/de-DE/openapi-cli/commands/).

## 2. Eine minimale Testspezifikation erstellen

Ein minimales OpenAPI-Dokument mit deklarativen Assertions:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Definiert eine Operation **keine** Assertions, ergänzt der Runner eine implizite Prüfung auf Protokollerfolg. Bei HTTP ist das eine `2xx`-Statusprüfung, damit 4xx/5xx-Antworten nicht unbemerkt als erfolgreich gelten.

## 3. Aus Node.js ausführen (programmatische API)

Die Bibliothek stellt denselben Ablauf als Funktionen bereit: `resolveConfig` → `runTests` → Reporter.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` akzeptiert dieselbe Optionsstruktur wie die CLI. `runTests` gibt einen `TestReport` mit `summary`, `results`, `config`, `generatedAt` und `version` zurück. [Konfiguration](/docs/de-DE/openapi-cli/configuration/).

## 4. Exit-Codes für CI

| Code | Bedeutung |
|---|---|
| `0` | Alle Tests bestanden oder `--no-fail-on-error` ist gesetzt. |
| `1` | Mindestens ein Test ist fehlgeschlagen oder hat einen Fehler verursacht. |
| `2` | Konfigurationsfehler, Fehler beim Laden der Spezifikation oder schwerwiegender Laufzeitfehler. |

## Nächste Schritte

- [Konfiguration](/docs/de-DE/openapi-cli/configuration/) — alle Felder von `CliConfig` und ihre Standardwerte.
- [Befehle](/docs/de-DE/openapi-cli/commands/) — alle CLI-Optionen.
- [Beispiele](/docs/de-DE/openapi-cli/examples/) — Authentifizierung, Filter, Berichte und Assertions.
- [API-Referenz](/docs/de-DE/openapi-cli/api-reference/) — alle exportierten Funktionen und Typen.

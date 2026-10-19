---
sidebar_position: 5
title: "CLI-Befehle"
description: "Das Paket enthält ein einziges ausführbares Programm, openapi-cli. Es akzeptiert eine flache Liste von Optionen; Unterbefehle wie run / validate / init gibt es nicht:"
---

# CLI-Befehle

Das Paket enthält ein einziges ausführbares Programm, `openapi-cli`. Es akzeptiert eine flache Liste von Optionen; Unterbefehle wie `run` / `validate` / `init` gibt es **nicht**:

```
openapi-cli [options]
```

## Aufrufsyntax

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Eine Spezifikation ist **erforderlich**: Geben Sie `--spec` (oder `-s`) an oder setzen Sie `specPath` in einer mit `--config` geladenen JSON-Konfigurationsdatei. Die übrigen Optionen sind optional.

## Grundlegende Optionen

| Option | Kurzform | Standard | Beschreibung |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Pfad oder `http(s)://`-URL einer OpenAPI-3.2-JSON-Spezifikation |
| `--server <url>` | `-S` | *(aus der Spezifikation)* | Server-URL aus der Spezifikation überschreiben |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Ausgabeverzeichnis für Berichte |
| `--format <formats>` | `-f` | `json,cli,html` | Kommagetrennte Berichtsformate: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Pfad zur JSON-Konfigurationsdatei; CLI-Argumente haben Vorrang |

## Ausführungsoptionen

| Option | Kurzform | Standard | Beschreibung |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Maximale Anzahl gleichzeitiger Anfragen; Ganzzahl von 1 bis 100 |
| `--timeout <ms>` | `-t` | `30000` | Zeitlimit je Anfrage in ms, Ganzzahl von 1 bis 600000; gilt auch beim Abrufen entfernter Spezifikationen |
| `--no-fail-on-error` | — | aus | Nach einem abgeschlossenen Lauf auch bei fehlgeschlagenen Tests `0` zurückgeben; Konfigurationsfehler und fatale Fehler führen weiterhin zum Fehlschlag |

## Filteroptionen

| Option | Standard | Beschreibung |
|--------|---------|-------------|
| `--method <methods>` | — | Kommagetrennte HTTP-Methoden, die berücksichtigt werden sollen, z. B. `get,post` |
| `--path <patterns>` | — | Kommagetrennte reguläre Ausdrücke zum Abgleich mit jedem Pfad |
| `--tag <tags>` | — | Kommagetrennte OpenAPI-Tags, die berücksichtigt werden sollen |
| `--operation-id <ids>` | — | Kommagetrennte `operationId`-Werte, die berücksichtigt werden sollen |

## Netzwerk- und TLS-Optionen

| Option | Kurzform | Standard | Beschreibung |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S)-Proxy-URL, z. B. `http://proxy.corp:8080` |
| `--ca <path>` | — | — | CA-Zertifikatsbündel im PEM-Format |
| `--cert <path>` | — | — | Clientzertifikat im PEM-Format für mTLS |
| `--key <path>` | — | — | Privater Clientschlüssel im PEM-Format für mTLS |
| `--insecure` | `-k` | aus | TLS-Zertifikatsprüfung überspringen |

## Authentifizierung, Header und Variablen

| Option | Kurzform | Beschreibung |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Zusätzliche Header als `Key: Value`; mehrfach verwendbar |
| `--bearer <token>` | — | Bearer-Token für den Header `Authorization` |
| `--variable <vars...>` | `-v` | Postman-Variablen als `KEY=VALUE`; mehrfach verwendbar |
| `--env <path>` | — | Pfad zu einer `.env`-Datei; vorhandene Umgebungsvariablen bleiben erhalten |

## gRPC-Optionen

| Option | Standard | Beschreibung |
|--------|---------|-------------|
| `--grpc-no-reflection` | aus | gRPC-Server-Reflection deaktivieren und stattdessen proto-Dateien verwenden |
| `--grpc-proto <paths...>` | — | Pfade zu `.proto`-Dateien oder zu Verzeichnissen mit solchen Dateien |

## MCP-Optionen

| Option | Standard | Beschreibung |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP-Transport: `streamable-http` oder `stdio` |
| `--mcp-command <command>` | — | MCP-stdio-Befehl, z. B. `npx` |
| `--mcp-args <args>` | — | MCP-stdio-Argumente, durch Leerzeichen oder Kommas getrennt |
| `--mcp-cwd <dir>` | — | Arbeitsverzeichnis des MCP-stdio-Unterprozesses |

## Informationsoptionen

| Option | Kurzform | Beschreibung |
|--------|-------|-------------|
| `--help` | `-h` | Hilfe anzeigen |
| `--version` | `-V` | Version anzeigen |

## Exit-Codes

| Code | Bedeutung |
|------|---------|
| `0` | Alle Tests bestanden oder `--no-fail-on-error` gesetzt |
| `1` | Mindestens ein Test ist fehlgeschlagen oder hat einen Fehler gemeldet, oder die CLI-Argumente konnten nicht verarbeitet werden |
| `2` | Konfigurationsfehler, Fehler beim Laden der Spezifikation oder fataler Laufzeitfehler |

Wenn `resolveConfig` eine Ausnahme auslöst, etwa weil weder `--spec` noch ein konfigurierter `specPath` vorliegt, gibt die CLI `Error:` in Rot aus und beendet sich mit `2`. Bei einer Ausnahme in `runTests` gibt sie `Fatal error:` aus und beendet sich mit `2`. Nach einem vollständig durchgeführten Lauf liefert sie nur dann `1`, wenn `report.summary.failed > 0 || report.summary.errors > 0` und `failOnError !== false` gelten.

## Umgebungsvariablen

Es gibt keine speziellen `OPENAPI_CLI_*`-Variablen. Die Konfiguration erfolgt über Optionen, die Konfigurationsdatei und folgende Mechanismen:

- **`.env`-Datei** — mit `--env .env` werden `KEY=VALUE`-Paare in `process.env` geladen. Vorhandene Variablen werden nicht überschrieben.
- **`${VAR}`-Ersetzung** — nach dem Laden wird `${VAR_NAME}` in `serverUrl`, `proxy`, den Werten von `headers`, `auth.token` und den Werten von `variables` ersetzt.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Aufrufbeispiele

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```

---
sidebar_position: 6
title: "Konfiguration"
description: "Die Auflösung folgt der Priorität CLI-Argumente > Konfigurationsdatei > Standardwerte. Das Ergebnis ist das von resolveConfig gelieferte CliConfig-Objekt."
---

# Konfiguration

Die Auflösung folgt der Priorität **CLI-Argumente > Konfigurationsdatei > Standardwerte**. Das Ergebnis ist das von [`resolveConfig`](./api-reference.md#resolveconfig) gelieferte `CliConfig`-Objekt.

## CliConfig

Der zentrale Konfigurationstyp. Außer `specPath` sind alle Felder optional.

| Feld | Typ | Standard | Beschreibung |
|-------|------|---------|-------------|
| `specPath` | `string` | **erforderlich** | Pfad oder `http(s)://`-URL zur OpenAPI-3.2-JSON-Spezifikation |
| `serverUrl` | `string` | *(aus der Spezifikation)* | Basis-URL des Servers aus der Spezifikation überschreiben |
| `outputDir` | `string` | `"./openapi-cli-report"` | Verzeichnis für Berichtsdateien |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Zu erzeugende Berichtsformate |
| `filter` | `FilterConfig` | `undefined` | Zu testende Operationen filtern |
| `concurrency` | `number` | `5` | Maximale Anzahl gleichzeitiger Anfragen; Ganzzahl von 1 bis 100 |
| `timeout` | `number` | `30000` | Zeitlimit je Anfrage in ms, Ganzzahl von 1 bis 600000; gilt auch für das Laden entfernter Spezifikationen |
| `proxy` | `string` | `undefined` | HTTP(S)-Proxy-URL, z. B. `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS- und Zertifikatskonfiguration |
| `headers` | `Record<string, string>` | `undefined` | Zusätzliche Header bei jeder Anfrage |
| `auth` | `AuthConfig` | `undefined` | Authentifizierungskonfiguration |
| `variables` | `Record<string, string>` | `undefined` | Einzusetzende Postman-Variablen `{{name}}` |
| `failOnError` | `boolean` | `true` | Nur CLI: nach fehlgeschlagenen Tests einen Code ungleich null liefern; Bibliotheksaufrufer prüfen den Bericht |
| `envFile` | `string` | `undefined` | Pfad zu einer `.env`-Datei mit einem `KEY=VALUE`-Paar je Zeile |
| `grpcReflection` | `boolean` | automatisch | gRPC: explizite Konfiguration hat Vorrang vor der Operationserweiterung; andernfalls aktiviert, wenn keine proto-Pfade angegeben sind |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: Pfade zu `.proto`-Dateien oder Verzeichnissen |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: Transport für MCP-Operationen |
| `mcpCommand` | `string` | `undefined` | MCP stdio: zu startender Befehl |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: Befehlsargumente |
| `mcpCwd` | `string` | `undefined` | MCP stdio: Arbeitsverzeichnis |

`ReportFormat` ist der Union-Typ `"json" | "cli" | "html"`.

## Erweiterte Laufzeitoptionen

Die folgenden Felder gehören ebenfalls zu `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` und `maxResponseSize` können in einer JSON-Datei stehen. Übergeben Sie `signal`, `httpRuntime` und `resolveTransport` nach der Konfigurationsauflösung direkt im Code an `runTests()`: Dies sind Laufzeitobjekte, keine JSON-Konfiguration.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` steuert HTTP-Weiterleitungen, Cookies und die Protokollauswahl. Für HTTP/SSE beträgt der Standardwert von `maxEvents` 50; `maxStreamMs` fällt auf `timeout` zurück. `maxResponseSize` wird an die Anfragelaufzeit weitergereicht. gRPC verwendet `maxStreamMs` als Stream-Frist, ersatzweise `timeout` und anschließend 30000 ms. `signal` bricht einen Lauf ab; `httpRuntime` stellt die HTTP-Zertifikats- und Dateiverarbeitung bereit; `resolveTransport` ermittelt Transporteinstellungen je Ziel.

## DEFAULT_CONFIG

Das von der Bibliothek exportierte Objekt mit integrierten Standardwerten:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `methods` | `string[]` | Nur diese HTTP-Methoden testen, z. B. `["get","post"]`; in Konfigurationsdateien kleinschreiben, CLI-Eingaben werden normalisiert |
| `paths` | `string[]` | Nur Pfade testen, die einem dieser regulären Ausdrücke entsprechen; bei ungültigen Ausdrücken wird eine Teilzeichenfolge gesucht |
| `tags` | `string[]` | Nur Operationen mit mindestens einem dieser Tags testen |
| `operationIds` | `string[]` | Nur exakt diese `operationId`-Werte testen |

Ein Filter ohne Schlüssel wird zu `undefined` aufgelöst; alle Operationen werden ausgeführt.

## TlsConfig

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `caCert` | `string` | Pfad zu einem CA-Zertifikatsbündel im PEM-Format |
| `clientCert` | `string` | Pfad zu einem PEM-Clientzertifikat für mTLS |
| `clientKey` | `string` | Pfad zu einem privaten PEM-Clientschlüssel für mTLS |
| `strictSSL` | `boolean` | TLS-Zertifikatsprüfung bei `false` überspringen; unsicher |
| `pfx` | `string` | Pfad zu einem PFX-Zertifikatsbündel; gRPC benötigt stattdessen PEM |
| `passphrase` | `string` | Passphrase für verschlüsseltes Zertifikatsmaterial |

> Hinweis: Die CLI-Option `--insecure` entspricht `tls.strictSSL = false` und **deaktiviert** somit die Prüfung.

## AuthConfig

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Authentifizierungsverfahren; unterstützte Namen stehen unten |
| `parameters` | `Record<string, string \| number \| boolean>` | Verfahrensspezifische Parameter für die Anfragelaufzeit |
| `token` | `string` | Bearer-Token für `type: "bearer"` |
| `username` | `string` | Benutzername für `type: "basic"` |
| `password` | `string` | Passwort für `type: "basic"` |
| `key` | `string` | API-Schlüsselname für `type: "apikey"` |
| `value` | `string` | API-Schlüsselwert für `type: "apikey"` |
| `in` | `"header" \| "query"` | Position des API-Schlüssels |

Unterstützte `type`-Werte sind `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` und `edgegrid`. Verfügbarkeit und Pflichtparameter hängen vom Protokoll und der Anfragelaufzeit ab; ein Name allein konfiguriert noch keine Authentifizierung.

Die CLI-Option `--bearer` erzeugt derzeit nur `{ type: "bearer", token }`. Umfangreichere `basic`- und `apikey`-Konfigurationen werden über eine Konfigurationsdatei bereitgestellt.

## JSON-Konfigurationsdatei

Die Datei enthält gewöhnliches JSON gemäß `Partial<CliConfig>`. Übergeben Sie sie mit `--config <path>` / `-c`. CLI-Argumente haben stets Vorrang vor Dateiwerten.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

Eine fehlende Datei löst `Config file not found: <path>` aus; ungültiges JSON löst `Invalid config file (must be JSON)` aus.

## Ersetzung von Umgebungsvariablen

Nach dem Laden einer `.env`-Datei über `--env` / `envFile` werden `${VAR_NAME}`-Verweise in folgenden Zeichenfolgenfeldern ersetzt:

- `serverUrl`
- `proxy`
- Werte von `headers`
- `auth.token`
- Werte von `variables`

Beispiel:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Verhalten von `.env`: Vorhandene Einträge in `process.env` werden **nicht** überschrieben; umschließende einfache und doppelte Anführungszeichen werden entfernt; Leerzeilen und `#`-Kommentarzeilen werden ignoriert; fehlende Dateien werden stillschweigend übersprungen.

## Konfiguration im Programmcode

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` löst `"No OpenAPI spec path provided..."` aus, wenn keine Spezifikation angegeben ist, und `Invalid proxy URL: <url>`, wenn `proxy` keine gültige URL ist.

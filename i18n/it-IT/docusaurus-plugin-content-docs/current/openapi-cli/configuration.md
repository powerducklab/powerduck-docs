---
sidebar_position: 6
title: "Configurazione"
description: "La precedenza è argomenti CLI > file di configurazione > valori predefiniti. Il risultato è l’oggetto CliConfig restituito da resolveConfig."
---

# Configurazione

La precedenza è **argomenti CLI > file di configurazione > valori predefiniti**. Il risultato è l’oggetto `CliConfig` restituito da [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

Tipo di configurazione principale. Tutti i campi tranne `specPath` sono facoltativi.

| Campo | Tipo | Predefinito | Descrizione |
|-------|------|---------|-------------|
| `specPath` | `string` | **obbligatorio** | Percorso o URL `http(s)://` della specifica JSON OpenAPI 3.2 |
| `serverUrl` | `string` | *(dalla specifica)* | Sostituire l’URL di base del server della specifica |
| `outputDir` | `string` | `"./openapi-cli-report"` | Directory per i file dei report |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Formati di report da generare |
| `filter` | `FilterConfig` | `undefined` | Filtrare le operazioni da verificare |
| `concurrency` | `number` | `5` | Numero massimo di richieste simultanee; intero da 1 a 100 |
| `timeout` | `number` | `30000` | Timeout per richiesta in ms, intero da 1 a 600000; vale anche per il recupero di specifiche remote |
| `proxy` | `string` | `undefined` | URL del proxy HTTP(S), ad esempio `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Configurazione TLS e certificati |
| `headers` | `Record<string, string>` | `undefined` | Intestazioni aggiuntive inviate con ogni richiesta |
| `auth` | `AuthConfig` | `undefined` | Configurazione dell’autenticazione |
| `variables` | `Record<string, string>` | `undefined` | Variabili Postman `{{name}}` da inserire |
| `failOnError` | `boolean` | `true` | Solo CLI: restituire un codice diverso da zero dopo test non superati; chi usa la libreria deve esaminare il report |
| `envFile` | `string` | `undefined` | Percorso del file `.env`, con una coppia `KEY=VALUE` per riga |
| `grpcReflection` | `boolean` | automatico | gRPC: prevale la configurazione esplicita, poi l’estensione dell’operazione; altrimenti attivato in assenza di percorsi proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: percorsi di file `.proto` o directory |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: trasporto delle operazioni MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: comando da avviare |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: argomenti del comando |
| `mcpCwd` | `string` | `undefined` | MCP stdio: directory di lavoro |

`ReportFormat` è l’unione `"json" | "cli" | "html"`.

## Opzioni avanzate di esecuzione

Anche i campi seguenti fanno parte di `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` e `maxResponseSize` possono essere forniti in un file JSON. Dopo aver risolto la configurazione, passa `signal`, `httpRuntime` e `resolveTransport` direttamente a `runTests()` nel codice: sono oggetti di esecuzione, non configurazione JSON.

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

`requester` controlla i reindirizzamenti HTTP, i cookie e la scelta del protocollo. Per HTTP/SSE, `maxEvents` è 50 per impostazione predefinita e `maxStreamMs` usa `timeout` se non definito; `maxResponseSize` viene inoltrato al motore delle richieste. gRPC usa `maxStreamMs` come scadenza del flusso, poi `timeout` e infine 30000 ms. `signal` annulla l’esecuzione; `httpRuntime` fornisce la gestione HTTP di certificati e file; `resolveTransport` risolve le impostazioni di trasporto per ogni destinazione.

## DEFAULT_CONFIG

Oggetto dei valori predefiniti esportato dalla libreria:

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

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `methods` | `string[]` | Verificare solo questi metodi HTTP, ad esempio `["get","post"]`; nei file usare minuscole, mentre l’input CLI viene normalizzato |
| `paths` | `string[]` | Verificare solo i percorsi che corrispondono a una di queste espressioni regolari; se non valida, si usa una ricerca per sottostringa |
| `tags` | `string[]` | Verificare solo le operazioni con almeno uno di questi tag |
| `operationIds` | `string[]` | Verificare solo questi valori esatti di `operationId` |

Un filtro senza chiavi viene risolto in `undefined`: vengono eseguite tutte le operazioni.

## TlsConfig

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `caCert` | `string` | Percorso della raccolta di certificati CA in PEM |
| `clientCert` | `string` | Percorso del certificato client PEM per mTLS |
| `clientKey` | `string` | Percorso della chiave privata client PEM per mTLS |
| `strictSSL` | `boolean` | Saltare la verifica TLS quando è `false`; non sicuro |
| `pfx` | `string` | Percorso della raccolta di certificati PFX; gRPC richiede invece PEM |
| `passphrase` | `string` | Passphrase del materiale del certificato cifrato |

> Nota: l’opzione CLI `--insecure` corrisponde a `tls.strictSSL = false`, quindi **disattiva** la verifica.

## AuthConfig

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Schema di autenticazione; nomi supportati riportati sotto |
| `parameters` | `Record<string, string \| number \| boolean>` | Parametri specifici dello schema passati al motore delle richieste |
| `token` | `string` | Token Bearer per `type: "bearer"` |
| `username` | `string` | Nome utente per `type: "basic"` |
| `password` | `string` | Password per `type: "basic"` |
| `key` | `string` | Nome della chiave API per `type: "apikey"` |
| `value` | `string` | Valore della chiave API per `type: "apikey"` |
| `in` | `"header" \| "query"` | Posizione della chiave API |

I valori `type` supportati sono `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` ed `edgegrid`. Disponibilità e parametri richiesti dipendono dal protocollo e dal motore delle richieste; il solo nome non configura l’autenticazione.

Attualmente l’opzione CLI `--bearer` produce solo `{ type: "bearer", token }`. Le configurazioni più complete `basic` / `apikey` si forniscono tramite file.

## File di configurazione JSON

Il file contiene JSON conforme a `Partial<CliConfig>`. Passalo con `--config <path>` / `-c`. Gli argomenti CLI hanno sempre la precedenza sui valori del file.

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

Un file mancante genera `Config file not found: <path>`; JSON non valido genera `Invalid config file (must be JSON)`.

## Espansione delle variabili d’ambiente

Dopo il caricamento di un file `.env` tramite `--env` / `envFile`, i riferimenti `${VAR_NAME}` vengono espansi in questi campi stringa:

- `serverUrl`
- `proxy`
- Valori di `headers`
- `auth.token`
- Valori di `variables`

Esempio:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Comportamento di `.env`: le voci esistenti di `process.env` **non** vengono sovrascritte; gli apici singoli o doppi che delimitano i valori vengono rimossi; righe vuote e commenti `#` vengono ignorati; un file mancante viene saltato senza avviso.

## Costruzione dal codice

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` solleva `"No OpenAPI spec path provided..."` se non è fornita una specifica e `Invalid proxy URL: <url>` se `proxy` non è un URL valido.

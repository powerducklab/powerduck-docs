---
sidebar_position: 6
title: Configuration
description: "The complete CliConfig reference for @powerduck/openapi-cli: every field, nested type, and default value."
---

# Configuration

Configuration is resolved with the precedence **CLI arguments > config file >
defaults**. The resolved object is the `CliConfig` interface returned by
[`resolveConfig`](./api-reference#resolveconfig).

## CliConfig

The central configuration type. All fields except `specPath` are optional.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `specPath` | `string` | **required** | Path or `http(s)://` URL to the OpenAPI 3.2 JSON spec |
| `serverUrl` | `string` | *(from spec)* | Override the server base URL from the spec |
| `outputDir` | `string` | `"./openapi-cli-report"` | Directory to write report files |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Report formats to generate |
| `filter` | `FilterConfig` | `undefined` | Filter which operations to test |
| `concurrency` | `number` | `5` | Max concurrent requests |
| `timeout` | `number` | `30000` | Per-request timeout in ms (also applies to remote spec fetch) |
| `proxy` | `string` | `undefined` | HTTP(S) proxy URL, e.g. `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS / certificate configuration |
| `headers` | `Record<string, string>` | `undefined` | Extra headers sent with every request |
| `auth` | `AuthConfig` | `undefined` | Authentication configuration |
| `variables` | `Record<string, string>` | `undefined` | Postman `{{name}}` variables to inject |
| `failOnError` | `boolean` | `true` | Exit with non-zero code if any test fails |
| `envFile` | `string` | `undefined` | Path to a `.env` file (`KEY=VALUE` per line) |
| `grpcReflection` | `boolean` | `true` | gRPC: use server reflection |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: paths to `.proto` files or directories |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: transport for MCP operations |
| `mcpCommand` | `string` | `undefined` | MCP stdio: command to spawn |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: command arguments |
| `mcpCwd` | `string` | `undefined` | MCP stdio: working directory |

`ReportFormat` is the union `"json" | "cli" | "html"`.

## DEFAULT_CONFIG

The built-in defaults object exported from the library:

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

| Field | Type | Description |
|-------|------|-------------|
| `methods` | `string[]` | Only test these HTTP methods (e.g. `["get","post"]`), matched case-insensitively |
| `paths` | `string[]` | Only test paths matching any of these regex patterns (falls back to substring match) |
| `tags` | `string[]` | Only test operations carrying any of these tags |
| `operationIds` | `string[]` | Only test these exact `operationId` values |

A filter with no keys present resolves to `undefined` (everything runs).

## TlsConfig

| Field | Type | Description |
|-------|------|-------------|
| `caCert` | `string` | Path to a CA certificate bundle (PEM) |
| `clientCert` | `string` | Path to a client certificate (PEM) for mTLS |
| `clientKey` | `string` | Path to a client private key (PEM) for mTLS |
| `strictSSL` | `boolean` | Skip TLS certificate verification when `false` (insecure) |

> Note: the CLI flag `--insecure` maps to `tls.strictSSL = false` (i.e. it
> **disables** verification).

## AuthConfig

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"bearer" \| "basic" \| "apikey" \| "none"` | Auth scheme |
| `token` | `string` | Bearer token (for `type: "bearer"`) |
| `username` | `string` | Username (for `type: "basic"`) |
| `password` | `string` | Password (for `type: "basic"`) |
| `key` | `string` | API key name (for `type: "apikey"`) |
| `value` | `string` | API key value (for `type: "apikey"`) |
| `in` | `"header" \| "query"` | Where the API key is placed |

At present the CLI `--bearer` flag only produces `{ type: "bearer", token }`.
The richer `basic` / `apikey` shapes are used when supplied from a config file.

## JSON config file

A config file is plain JSON matching `Partial<CliConfig>`. Pass it with
`--config <path>` / `-c`. CLI arguments always win over file values.

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

A missing config file throws `Config file not found: <path>`; invalid JSON
throws `Invalid config file (must be JSON)`.

## Environment variable expansion

After a `.env` file is loaded (via `--env` / `envFile`), `${VAR_NAME}`
references are expanded in these string fields:

- `serverUrl`
- `proxy`
- `headers` values
- `auth.token`
- `variables` values

Example:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` behavior: existing `process.env` entries are **not** overwritten;
surrounding single/double quotes are stripped; blank and `#` comment lines are
ignored; a missing file is silently skipped.

## Programmatic construction

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  filter: { methods: ["get"] },
});
```

`resolveConfig` throws `"No OpenAPI spec path provided..."` when no spec is
supplied, and `Invalid proxy URL: <url>` when `proxy` is not a valid URL.

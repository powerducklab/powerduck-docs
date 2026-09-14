---
sidebar_position: 5
title: CLI Commands
description: "Complete CLI reference for the openapi-cli binary: every flag, exit code, and environment variable."
---

# CLI Commands

The package ships a single binary, `openapi-cli`. It takes a flat list of
options (there is **no** `run` / `validate` / `init` subcommand):

```
openapi-cli [options]
```

## Synopsis

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

`--spec` (or `-s`) is **required**. Everything else is optional.

## Core options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | **required** | Path or `http(s)://` URL to an OpenAPI 3.2 JSON spec |
| `--server <url>` | `-S` | *(from spec)* | Override the server URL from the spec |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Output directory for reports |
| `--format <formats>` | `-f` | `json,cli,html` | Comma-separated report formats: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Path to a JSON config file (CLI args take precedence) |

## Execution options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Max concurrent requests |
| `--timeout <ms>` | `-t` | `30000` | Per-request timeout in ms (also used when fetching a remote spec) |
| `--no-fail-on-error` | — | off | Exit `0` even when tests fail |

## Filtering options

| Option | Default | Description |
|--------|---------|-------------|
| `--method <methods>` | — | Comma-separated HTTP methods to include (e.g. `get,post`) |
| `--path <patterns>` | — | Comma-separated regex patterns matched against each path |
| `--tag <tags>` | — | Comma-separated OpenAPI tags to include |
| `--operation-id <ids>` | — | Comma-separated `operationId` values to include |

## Network & TLS options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) proxy URL (e.g. `http://proxy.corp:8080`) |
| `--ca <path>` | — | — | CA certificate bundle (PEM) |
| `--cert <path>` | — | — | Client certificate (PEM) for mTLS |
| `--key <path>` | — | — | Client private key (PEM) for mTLS |
| `--insecure` | `-k` | off | Skip TLS certificate verification |

## Authentication, headers & variables

| Option | Short | Description |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Extra headers as `Key: Value`; repeatable |
| `--bearer <token>` | — | Bearer token sent in the `Authorization` header |
| `--variable <vars...>` | `-v` | Postman variables as `KEY=VALUE`; repeatable |
| `--env <path>` | — | Path to a `.env` file (does not override existing env vars) |

## gRPC options

| Option | Default | Description |
|--------|---------|-------------|
| `--grpc-no-reflection` | off | Disable gRPC server reflection and use proto files instead |
| `--grpc-proto <paths...>` | — | Paths to `.proto` files or directories containing them |

## MCP options

| Option | Default | Description |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP transport: `streamable-http` or `stdio` |
| `--mcp-command <command>` | — | MCP stdio command (e.g. `npx`) |
| `--mcp-args <args>` | — | MCP stdio arguments, space- or comma-separated |
| `--mcp-cwd <dir>` | — | Working directory for the MCP stdio subprocess |

## Informational options

| Option | Short | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help |
| `--version` | `-V` | Show the version |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | All tests passed (or `--no-fail-on-error` was set) |
| `1` | One or more tests failed or errored |
| `2` | Configuration error, spec load failure, or fatal runtime error |

The CLI prints a red `Error:` and exits `2` when `resolveConfig` throws (for
example a missing `--spec`). It prints `Fatal error:` and exits `2` when
`runTests` throws. After a successful run it exits `1` only when
`report.summary.failed > 0 || report.summary.errors > 0` and
`failOnError !== false`.

## Environment variables

There are no dedicated `OPENAPI_CLI_*` variables. Configuration is supplied
through flags, the config file, and:

- **`.env` file** — pass `--env .env` to load `KEY=VALUE` pairs into
  `process.env`. Existing variables are not overwritten.
- **`${VAR}` expansion** — after loading, `${VAR_NAME}` is substituted inside
  `serverUrl`, `proxy`, `headers` values, `auth.token`, and `variables` values.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Run examples

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

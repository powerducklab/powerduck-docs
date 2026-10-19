---
sidebar_position: 5
title: "Comandos CLI"
description: "El paquete incluye un único ejecutable, openapi-cli. Acepta directamente una lista de opciones; no hay subcomandos run / validate / init:"
---

# Comandos CLI

El paquete incluye un único ejecutable, `openapi-cli`. Acepta directamente una lista de opciones; **no hay** subcomandos `run` / `validate` / `init`:

```
openapi-cli [options]
```

## Sintaxis

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

La especificación es **obligatoria**: proporciona `--spec` (o `-s`), o define `specPath` en un archivo JSON cargado con `--config`. Las demás opciones son opcionales.

## Opciones principales

| Opción | Forma corta | Valor predeterminado | Descripción |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Ruta o URL `http(s)://` de una especificación JSON OpenAPI 3.2 |
| `--server <url>` | `-S` | *(de la especificación)* | Sustituir la URL del servidor definida en la especificación |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Directorio de salida de los informes |
| `--format <formats>` | `-f` | `json,cli,html` | Formatos de informe separados por comas: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Ruta del archivo de configuración JSON; los argumentos CLI tienen prioridad |

## Opciones de ejecución

| Opción | Forma corta | Valor predeterminado | Descripción |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Máximo de peticiones simultáneas; entero de 1 a 100 |
| `--timeout <ms>` | `-t` | `30000` | Tiempo de espera por petición en ms, entero de 1 a 600000; también se usa al obtener una especificación remota |
| `--no-fail-on-error` | — | desactivado | Devolver `0` tras una ejecución completada aunque fallen pruebas; los errores de configuración y los errores fatales siguen provocando un fallo |

## Opciones de filtrado

| Opción | Valor predeterminado | Descripción |
|--------|---------|-------------|
| `--method <methods>` | — | Métodos HTTP que se incluirán, separados por comas, por ejemplo `get,post` |
| `--path <patterns>` | — | Expresiones regulares separadas por comas que se comparan con cada ruta |
| `--tag <tags>` | — | Etiquetas OpenAPI que se incluirán, separadas por comas |
| `--operation-id <ids>` | — | Valores `operationId` que se incluirán, separados por comas |

## Opciones de red y TLS

| Opción | Forma corta | Valor predeterminado | Descripción |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | URL del proxy HTTP(S), por ejemplo `http://proxy.corp:8080` |
| `--ca <path>` | — | — | Conjunto de certificados CA en formato PEM |
| `--cert <path>` | — | — | Certificado de cliente PEM para mTLS |
| `--key <path>` | — | — | Clave privada del cliente PEM para mTLS |
| `--insecure` | `-k` | desactivado | Omitir la verificación de certificados TLS |

## Autenticación, cabeceras y variables

| Opción | Forma corta | Descripción |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Cabeceras adicionales como `Key: Value`; se puede repetir |
| `--bearer <token>` | — | Token Bearer enviado en la cabecera `Authorization` |
| `--variable <vars...>` | `-v` | Variables Postman como `KEY=VALUE`; se puede repetir |
| `--env <path>` | — | Ruta del archivo `.env`; no sustituye las variables de entorno existentes |

## Opciones gRPC

| Opción | Valor predeterminado | Descripción |
|--------|---------|-------------|
| `--grpc-no-reflection` | desactivado | Desactivar la reflexión del servidor gRPC y usar archivos proto |
| `--grpc-proto <paths...>` | — | Rutas de archivos `.proto` o directorios que los contengan |

## Opciones MCP

| Opción | Valor predeterminado | Descripción |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | Transporte MCP: `streamable-http` o `stdio` |
| `--mcp-command <command>` | — | Comando MCP stdio, por ejemplo `npx` |
| `--mcp-args <args>` | — | Argumentos MCP stdio separados por espacios o comas |
| `--mcp-cwd <dir>` | — | Directorio de trabajo del subproceso MCP stdio |

## Opciones informativas

| Opción | Forma corta | Descripción |
|--------|-------|-------------|
| `--help` | `-h` | Mostrar la ayuda |
| `--version` | `-V` | Mostrar la versión |

## Códigos de salida

| Código | Significado |
|------|---------|
| `0` | Todas las pruebas pasaron o se activó `--no-fail-on-error` |
| `1` | Una o más pruebas fallaron o tuvieron errores, o falló el análisis de los argumentos CLI |
| `2` | Error de configuración, fallo al cargar la especificación o error fatal de ejecución |

La CLI muestra `Error:` en rojo y termina con `2` si `resolveConfig` lanza una excepción, por ejemplo cuando no se proporciona ni `--spec` ni un `specPath` configurado. Muestra `Fatal error:` y termina con `2` si `runTests` lanza una excepción. Tras una ejecución completada, solo devuelve `1` cuando `report.summary.failed > 0 || report.summary.errors > 0` y `failOnError !== false`.

## Variables de entorno

No hay variables específicas `OPENAPI_CLI_*`. La configuración se proporciona mediante las opciones, el archivo de configuración y estos mecanismos:

- **Archivo `.env`** — pasa `--env .env` para cargar pares `KEY=VALUE` en `process.env`. No se sobrescriben las variables existentes.
- **Expansión de `${VAR}`** — tras la carga, se sustituye `${VAR_NAME}` en `serverUrl`, `proxy`, los valores de `headers`, `auth.token` y los valores de `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Ejemplos de ejecución

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

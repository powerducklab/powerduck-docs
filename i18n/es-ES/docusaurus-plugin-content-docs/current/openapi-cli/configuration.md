---
sidebar_position: 6
title: "Configuración"
description: "La prioridad de resolución es argumentos CLI > archivo de configuración > valores predeterminados. El resultado es el objeto CliConfig devuelto por resolveConfig."
---

# Configuración

La prioridad de resolución es **argumentos CLI > archivo de configuración > valores predeterminados**. El resultado es el objeto `CliConfig` devuelto por [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

Tipo de configuración principal. Todos los campos excepto `specPath` son opcionales.

| Campo | Tipo | Valor predeterminado | Descripción |
|-------|------|---------|-------------|
| `specPath` | `string` | **obligatorio** | Ruta o URL `http(s)://` de la especificación JSON OpenAPI 3.2 |
| `serverUrl` | `string` | *(de la especificación)* | Sustituir la URL base del servidor de la especificación |
| `outputDir` | `string` | `"./openapi-cli-report"` | Directorio para los archivos de informe |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Formatos de informe que se generarán |
| `filter` | `FilterConfig` | `undefined` | Filtrar las operaciones que se probarán |
| `concurrency` | `number` | `5` | Máximo de peticiones simultáneas; entero de 1 a 100 |
| `timeout` | `number` | `30000` | Tiempo de espera por petición en ms, entero de 1 a 600000; también se aplica a especificaciones remotas |
| `proxy` | `string` | `undefined` | URL del proxy HTTP(S), por ejemplo `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Configuración de TLS y certificados |
| `headers` | `Record<string, string>` | `undefined` | Cabeceras adicionales enviadas con cada petición |
| `auth` | `AuthConfig` | `undefined` | Configuración de autenticación |
| `variables` | `Record<string, string>` | `undefined` | Variables Postman `{{name}}` que se inyectarán |
| `failOnError` | `boolean` | `true` | Solo CLI: devolver un código distinto de cero tras un fallo de prueba; quien llame a la biblioteca debe revisar el informe |
| `envFile` | `string` | `undefined` | Ruta del archivo `.env`, con un par `KEY=VALUE` por línea |
| `grpcReflection` | `boolean` | automático | gRPC: prevalece la configuración explícita, seguida de la extensión de la operación; en otro caso se activa si no hay rutas proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: rutas de archivos `.proto` o directorios |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: transporte de las operaciones MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: comando que se iniciará |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: argumentos del comando |
| `mcpCwd` | `string` | `undefined` | MCP stdio: directorio de trabajo |

`ReportFormat` es la unión `"json" | "cli" | "html"`.

## Opciones avanzadas de ejecución

Los siguientes campos también forman parte de `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` y `maxResponseSize` pueden incluirse en un archivo JSON. Tras resolver la configuración, pasa `signal`, `httpRuntime` y `resolveTransport` directamente a `runTests()` desde el código: son objetos de ejecución, no configuración JSON.

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

`requester` controla las redirecciones HTTP, las cookies y la selección del protocolo. Para HTTP/SSE, `maxEvents` vale 50 por defecto y `maxStreamMs` usa `timeout` si no se define; `maxResponseSize` se transmite al motor de peticiones. gRPC usa `maxStreamMs` como límite del flujo, después `timeout` y, por último, 30000 ms. `signal` cancela la ejecución; `httpRuntime` proporciona la gestión HTTP de certificados y archivos; `resolveTransport` resuelve el transporte por destino.

## DEFAULT_CONFIG

Objeto de valores predeterminados exportado por la biblioteca:

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

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `methods` | `string[]` | Probar solo estos métodos HTTP, por ejemplo `["get","post"]`; usa minúsculas en los archivos, ya que solo la entrada CLI se normaliza |
| `paths` | `string[]` | Probar solo rutas que coincidan con alguna expresión regular; si la expresión no es válida, se busca una subcadena |
| `tags` | `string[]` | Probar solo operaciones con alguna de estas etiquetas |
| `operationIds` | `string[]` | Probar solo estos valores exactos de `operationId` |

Un filtro sin claves se resuelve como `undefined`: se ejecutan todas las operaciones.

## TlsConfig

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `caCert` | `string` | Ruta del conjunto de certificados CA en PEM |
| `clientCert` | `string` | Ruta del certificado de cliente PEM para mTLS |
| `clientKey` | `string` | Ruta de la clave privada del cliente PEM para mTLS |
| `strictSSL` | `boolean` | Omitir la verificación TLS cuando sea `false`; no es seguro |
| `pfx` | `string` | Ruta del conjunto de certificados PFX; gRPC requiere PEM |
| `passphrase` | `string` | Contraseña del material de certificado cifrado |

> Nota: la opción CLI `--insecure` corresponde a `tls.strictSSL = false`, es decir, **desactiva** la verificación.

## AuthConfig

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Método de autenticación; consulta los nombres admitidos más abajo |
| `parameters` | `Record<string, string \| number \| boolean>` | Parámetros propios del método que se pasan al motor de peticiones |
| `token` | `string` | Token Bearer para `type: "bearer"` |
| `username` | `string` | Nombre de usuario para `type: "basic"` |
| `password` | `string` | Contraseña para `type: "basic"` |
| `key` | `string` | Nombre de la clave API para `type: "apikey"` |
| `value` | `string` | Valor de la clave API para `type: "apikey"` |
| `in` | `"header" \| "query"` | Ubicación de la clave API |

Los valores de `type` admitidos son `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` y `edgegrid`. La disponibilidad y los parámetros necesarios dependen del protocolo y del motor de peticiones; indicar solo el nombre no configura la autenticación.

Actualmente, la opción CLI `--bearer` solo produce `{ type: "bearer", token }`. Las configuraciones más completas de `basic` / `apikey` se proporcionan mediante un archivo.

## Archivo de configuración JSON

El archivo es JSON que se ajusta a `Partial<CliConfig>`. Pásalo mediante `--config <path>` / `-c`. Los argumentos CLI siempre prevalecen sobre los valores del archivo.

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

Si falta el archivo se lanza `Config file not found: <path>`; si el JSON no es válido se lanza `Invalid config file (must be JSON)`.

## Expansión de variables de entorno

Tras cargar un archivo `.env` mediante `--env` / `envFile`, se expanden las referencias `${VAR_NAME}` en estos campos de texto:

- `serverUrl`
- `proxy`
- Valores de `headers`
- `auth.token`
- Valores de `variables`

Ejemplo:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Comportamiento de `.env`: **no** se sobrescriben las entradas existentes de `process.env`; se eliminan las comillas simples o dobles que rodean los valores; se ignoran las líneas vacías y los comentarios `#`; un archivo inexistente se omite sin avisar.

## Construcción desde código

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` lanza `"No OpenAPI spec path provided..."` cuando no se proporciona una especificación, e `Invalid proxy URL: <url>` si `proxy` no es una URL válida.

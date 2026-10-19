---
sidebar_position: 4
title: "Configuración"
description: "Opciones de generación de @powerduck/openapi-codegen: GenerateOptions, RequestIR y las interfaces Generator y Plugin."
---

# Configuración

No hay un archivo de configuración independiente. La generación se controla con el objeto `GenerateOptions` que se pasa a [`generate()`](/docs/es-ES/openapi-codegen/api-reference/).

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Opción | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `language` | `string` | sí | Identificador del lenguaje de destino, no distingue mayúsculas de minúsculas, p. ej. `"javascript"` |
| `client` | `string` | sí | Identificador del cliente HTTP de destino, p. ej. `"fetch"` |
| `request` | `RequestIR` | una alternativa* | Solicitud ya normalizada; omite `normalize` |
| `document` | `unknown` | una alternativa* | Objeto de documento OpenAPI ya analizado |
| `path` | `string` | con `document` | Plantilla exacta de ruta OpenAPI, p. ej. `"/pets/{id}"` |
| `method` | `string` | con `document` | Método HTTP, p. ej. `"get"` / `"post"` |
| `serverUrl` | `string` | no | Sustituye la URL del servidor del documento |
| `securityValues` | `Record<string, string>` | no | Credenciales indexadas por nombre del esquema de seguridad |
| `softRefMode` | `boolean` | no | No lanza errores por `$ref` rotas o circulares; devuelve valores parciales |

\* Debes proporcionar solo `request` o bien `document` + `path` + `method`. Cuando se proporciona `request`, se ignoran `document`, `path`, `method`, `serverUrl`, `securityValues` y `softRefMode`.

### Errores de validación de entrada

`generate()` lanza un error si faltan entradas obligatorias:

- `TypeError: generate() requires an options object` — Falta el objeto de opciones.
- `Error: Unsupported generator: <language>/<client>` — Combinación desconocida.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` lanza `Error` para métodos no admitidos, ausencia de `paths`, rutas desconocidas u operaciones ausentes; lanza `TypeError` si el documento no es un objeto.

## RequestIR

Representación normalizada de una solicitud, independiente del generador de código. Puedes crearla directamente y pasarla como `options.request` para omitir `normalize`.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Los marcadores de archivo multipart usan esta estructura:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

Un generador es cualquier objeto que cumpla esta interfaz. Los generadores integrados se crean con `createGenerator(language, client, emit)`, pero también puedes registrar los tuyos:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` recibe un `RequestIR` y devuelve el código fuente generado como cadena.

## Plugin

Un plugin registra uno o varios generadores mediante `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Ejemplo:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

Este tipo está previsto para futuras salidas que puedan incluir varios archivos. Actualmente, `generate()` sigue devolviendo un `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Estructura de salida de normalize

Llamar directamente a `normalize()` (consulta la [referencia de la API](/docs/es-ES/openapi-codegen/api-reference/#normalizeoptions)) devuelve un objeto algo más amplio que `RequestIR`:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Orden de resolución de la URL del servidor

`baseUrl` toma el primer valor no vacío de:

1. `options.serverUrl`
2. los `servers` de la operación
3. los `servers` del elemento de ruta
4. los `servers` de la raíz
5. el valor de reserva `"https://example.com"`

Los marcadores `{variable}` del servidor se rellenan desde `server.variables`, con su valor `default` o, en su defecto, `example`, codificado para URI.

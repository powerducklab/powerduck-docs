---
sidebar_position: 4
title: "Referencia de la API"
description: "Documentación completa de la API de @powerduck/openapi-codegen."
---

# Referencia de la API

Documentación completa de la API de `@powerduck/openapi-codegen`.

## Funciones principales

| Exportación | Firma | Descripción |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Genera código fuente ejecutable para una operación |
| `register` | `(generator: Generator) => void` | Registra un generador personalizado |
| `get` | `(language: string, client: string) => Generator \| undefined` | Busca un generador |
| `list` | `() => Array<{ language: string; client: string }>` | Enumera todos los generadores registrados |
| `use` | `(plugin: Plugin) => void` | Aplica un plugin que registra generadores |
| `registerBuiltins` | `() => void` | Registra todos los generadores integrados, automáticamente al importar |
| `normalize` | `(options) => NormalizedRequest` | Convierte documento, ruta y método en una solicitud normalizada |
| `builtinGenerators` | `Generator[]` | Array sin procesar con todas las definiciones de generadores integrados |

Los generadores integrados se registran automáticamente al cargar el módulo, por lo que llamar manualmente a `registerBuiltins()` es opcional.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Devuelve el código fuente generado como cadena. Busca el generador con `get(options.language, options.client)`; si no existe `options.request`, llama a `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`; después llama a `generator.generate(request)`.

Errores posibles:

- `TypeError` si `options` no es un objeto o faltan entradas obligatorias.
- `Error: Unsupported generator: <language>/<client>` para una combinación desconocida.
- Errores de `normalize()` por ruta o método desconocido, documento no válido o `$ref` rotas o circulares, salvo que se active `softRefMode`.

Consulta [Configuración](/docs/es-ES/openapi-codegen/configuration/#generateoptions) para ver la tabla completa de opciones.

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

Registra en el almacén interno sin distinguir mayúsculas de minúsculas, con la clave `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Devuelve el `Generator` o `undefined` si no lo encuentra.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

Equivale a llamar a `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Es idempotente gracias a un indicador interno. Registra cada entrada de `builtinGenerators`.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

Resuelve las `$ref`, combina parámetros de ruta y operación, elige el tipo de contenido del cuerpo, genera valores de ejemplo, resuelve la seguridad y calcula `baseUrl`. Lanza errores para rutas o métodos desconocidos y métodos no admitidos.

## Generadores integrados (21 lenguajes, 41 clientes) {#built-in-generators-21-languages-41-clients}

Identificadores exactos de `language` y `client`, registrados en `src/emitters/index.ts`. Las búsquedas no distinguen mayúsculas de minúsculas; la tabla muestra los identificadores canónicos.

| Lenguaje | `language` | Valores de `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| Archivo de solicitud HTTP | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

Total: 21 lenguajes, 41 combinaciones.

> Disponer de un generador no significa que todos los clientes puedan representar todas las operaciones. Por ejemplo, `shell/wget` no puede construir con seguridad solicitudes `multipart/form-data` arbitrarias; usa `shell/curl` o `shell/httpie`.

## Tipos principales

Reexportados desde `./types`:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## Funciones internas

Todas se reexportan desde la raíz del paquete.

### refs

| Exportación | Descripción |
|--------|-------------|
| `RefResolver` | Clase para resolver referencias JSON Pointer `#/...` dentro del documento. Constructor: `(root, softMode = false)`. Métodos: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Campo público: `softMode`. Lanza errores para referencias externas, rotas o circulares, salvo si `softMode` es verdadero. |

### example

| Exportación | Descripción |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Genera un valor de ejemplo desde JSON Schema. Respeta `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, tipos, formatos y restricciones. |
| `ExampleGenContext` | Tipo `{ isRequestBody: boolean; isResponse: boolean }` que controla el filtrado `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Valor predeterminado: `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Exportación | Descripción |
|--------|-------------|
| `Pair` | Tipo `[string, string]`. |
| `parameter(parameter)` | Serializa un parámetro en `Pair[]` según las reglas OpenAPI `style`/`explode` (form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject). |
| `query(pairs)` | Une los pares en una cadena de consulta. |
| `cookie(pairs)` | Une los pares en un valor de cabecera `Cookie`. |
| `headerValue(value)` | Sanea el valor de una cabecera eliminando CR/LF/NUL. |

### generator

| Exportación | Descripción |
|--------|-------------|
| `createGenerator(language, client, emit)` | Envuelve una función `emit(request) => string` en un `Generator`. |
| `GeneratorEmitter` | Tipo `(request: RequestIR) => string`. |

### registry

| Exportación | Descripción |
|--------|-------------|
| `registerGenerator(generator)` | Inserta en el almacén sin distinguir mayúsculas de minúsculas. |
| `getGenerator(language, client)` | Lee del almacén. |
| `listGenerators()` | Devuelve `[{ language, client }, ...]`. |

### plugin

| Exportación | Descripción |
|--------|-------------|
| `PluginApi` | Tipo `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Llama a `plugin.register(api)`. |

### request

| Exportación | Descripción |
|--------|-------------|
| `CompiledRequest` | Tipo `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Sustituye parámetros de ruta, construye pares query/header/cookie, aplica la seguridad y compone la URL. |
| `form(value)` | Serializa un objeto en una cadena `application/x-www-form-urlencoded`. |

### helpers

Utilidades habituales:

| Exportación | Descripción |
|--------|-------------|
| `isRecord(value)` | Guarda de tipo para objetos simples. |
| `isFileValue(value)` | Guarda de tipo para un marcador `FileValue`. |
| `firstDefined(...values)` | Primer valor distinto de `undefined`. |
| `nonBlankString(value, fallback?)` | Cadena no vacía tras eliminar espacios en los extremos, o `undefined`/valor de reserva. |
| `normalizeMethod(method)` | Método en mayúsculas, con `GET` como valor de reserva. |
| `supportsRequestBody(method)` | `false` para `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` para `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Tipo de contenido efectivo del cuerpo o de la cabecera Content-Type. |
| `hasJsonBody(request)` | Tipo de contenido JSON o `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Texto del cuerpo sin procesar o JSON formateado. |
| `toHeaderObject(headers)` | Convierte pares en un `Record<string,string>`. |
| `toKeyValueBody(value)` | Aplana un cuerpo multipart en descriptores de campo ordenados. |
| `collectByLocation(request, location)` | Filtra parámetros según su ubicación OpenAPI. |
| `operationName(request)` | Deriva un nombre de función o variable en snake_case a partir del método y la ruta. |
| `sanitizeIdentifier(value)` | Convierte texto arbitrario en un identificador válido. |
| `indent(text, prefix="  ")` | Aplica sangría a cada línea no vacía. |
| `stringifyLiteral(value)` | JSON formateado con una alternativa segura. |
| `kotlinValue(value)` / `formFieldValue(value)` | Serializa un valor para un literal o campo de formulario. |
| `fileComment(path, fieldName)` | Crea un comentario TODO para una ruta multipart de marcador. |
| `mergeAllOfSchemas(schemas, resolver)` | Combina superficialmente esquemas `allOf`. |
| `lightweightOpenAPIPreCheck(doc)` | Devuelve advertencias estructurales sobre un documento. |
| `browserHeaders(headers, multipart)` | Elimina cabeceras prohibidas por el navegador. |
| `isBrowserForbiddenHeader(name)` | Indica si una cabecera está controlada por las API de red del navegador. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Funciones de escape de literales de cadena específicas de cada lenguaje. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Guardas de aserción en tiempo de ejecución. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Constantes para archivos de marcador en las cargas. |

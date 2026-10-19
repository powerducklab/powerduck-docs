---
sidebar_position: 4
title: "Referência da API"
description: "Documentação completa da API de @powerduck/openapi-codegen."
---

# Referência da API

Documentação completa da API de `@powerduck/openapi-codegen`.

## Funções principais

| Exportação | Assinatura | Descrição |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Gera código-fonte executável para uma operação |
| `register` | `(generator: Generator) => void` | Registra um gerador personalizado |
| `get` | `(language: string, client: string) => Generator \| undefined` | Busca um gerador |
| `list` | `() => Array<{ language: string; client: string }>` | Lista todos os geradores registrados |
| `use` | `(plugin: Plugin) => void` | Aplica um plugin que registra geradores |
| `registerBuiltins` | `() => void` | Registra todos os geradores integrados, automaticamente na importação |
| `normalize` | `(options) => NormalizedRequest` | Transforma documento, caminho e método em uma requisição normalizada |
| `builtinGenerators` | `Generator[]` | Array original com todas as definições dos geradores integrados |

Os geradores integrados são registrados automaticamente ao carregar o módulo; chamar `registerBuiltins()` manualmente é opcional.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Retorna o código-fonte gerado como string. Busca o gerador com `get(options.language, options.client)`; se `options.request` estiver ausente, chama `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`; depois chama `generator.generate(request)`.

Erros possíveis:

- `TypeError` quando `options` não é um objeto ou faltam entradas obrigatórias.
- `Error: Unsupported generator: <language>/<client>` para uma combinação desconhecida.
- Erros de `normalize()` por caminho ou método desconhecido, documento inválido ou `$ref` quebradas ou circulares, exceto com `softRefMode` ativo.

Veja [Configuração](/docs/pt-BR/openapi-codegen/configuration/#generateoptions) para a tabela completa de opções.

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

Registra no armazenamento interno sem diferenciar maiúsculas de minúsculas, usando a chave `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Retorna o `Generator` ou `undefined` se não for encontrado.

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

Equivale a chamar `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Idempotente, com proteção por um indicador interno. Registra cada entrada de `builtinGenerators`.

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

Resolve `$ref`s, combina parâmetros de caminho e operação, escolhe o tipo de mídia do corpo, gera valores de exemplo, resolve a segurança e calcula `baseUrl`. Lança erros para caminhos ou métodos desconhecidos e métodos não suportados.

## Geradores integrados (21 linguagens, 41 clientes) {#built-in-generators-21-languages-41-clients}

Identificadores exatos de `language` e `client`, registrados em `src/emitters/index.ts`. As buscas não diferenciam maiúsculas de minúsculas; a tabela apresenta os identificadores canônicos.

| Linguagem | `language` | Valores de `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| Arquivo de requisição HTTP | `http` | `http1` |
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

Total: 21 linguagens, 41 combinações.

> A existência de um gerador não significa que todo cliente possa representar qualquer operação. Por exemplo, `shell/wget` não consegue construir com segurança requisições `multipart/form-data` arbitrárias; use `shell/curl` ou `shell/httpie`.

## Tipos fundamentais

Reexportados de `./types`:

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

## Funções do núcleo

Todas são reexportadas pela raiz do pacote.

### refs

| Exportação | Descrição |
|--------|-------------|
| `RefResolver` | Classe para resolver JSON Pointer `#/...` dentro do documento. Construtor: `(root, softMode = false)`. Métodos: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Campo público: `softMode`. Lança erros para referências externas, quebradas ou circulares, exceto quando `softMode` é verdadeiro. |

### example

| Exportação | Descrição |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Gera um valor de exemplo a partir de JSON Schema. Respeita `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, tipos, formatos e restrições. |
| `ExampleGenContext` | Tipo `{ isRequestBody: boolean; isResponse: boolean }` que controla a filtragem `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Valor padrão: `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Exportação | Descrição |
|--------|-------------|
| `Pair` | Tipo `[string, string]`. |
| `parameter(parameter)` | Serializa um parâmetro em `Pair[]` conforme as regras OpenAPI `style`/`explode` (form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject). |
| `query(pairs)` | Junta pares em uma string de consulta. |
| `cookie(pairs)` | Junta pares em um valor de header `Cookie`. |
| `headerValue(value)` | Limpa um valor de header removendo CR/LF/NUL. |

### generator

| Exportação | Descrição |
|--------|-------------|
| `createGenerator(language, client, emit)` | Encapsula uma função `emit(request) => string` em um `Generator`. |
| `GeneratorEmitter` | Tipo `(request: RequestIR) => string`. |

### registry

| Exportação | Descrição |
|--------|-------------|
| `registerGenerator(generator)` | Insere no armazenamento sem diferenciar maiúsculas de minúsculas. |
| `getGenerator(language, client)` | Lê do armazenamento. |
| `listGenerators()` | Retorna `[{ language, client }, ...]`. |

### plugin

| Exportação | Descrição |
|--------|-------------|
| `PluginApi` | Tipo `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Chama `plugin.register(api)`. |

### request

| Exportação | Descrição |
|--------|-------------|
| `CompiledRequest` | Tipo `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Substitui parâmetros de caminho, monta pares query/header/cookie, aplica a segurança e compõe a URL. |
| `form(value)` | Serializa um objeto em uma string `application/x-www-form-urlencoded`. |

### helpers

Utilitários comuns:

| Exportação | Descrição |
|--------|-------------|
| `isRecord(value)` | Guarda de tipo para objetos simples. |
| `isFileValue(value)` | Guarda de tipo para um marcador `FileValue`. |
| `firstDefined(...values)` | Primeiro valor diferente de `undefined`. |
| `nonBlankString(value, fallback?)` | String não vazia após remover espaços nas extremidades, ou `undefined`/valor alternativo. |
| `normalizeMethod(method)` | Método em maiúsculas, com `GET` como padrão. |
| `supportsRequestBody(method)` | `false` para `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` para `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Tipo de mídia efetivo do corpo ou do header Content-Type. |
| `hasJsonBody(request)` | Tipo de mídia JSON ou `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Texto bruto do corpo ou JSON formatado. |
| `toHeaderObject(headers)` | Converte pares em um `Record<string,string>`. |
| `toKeyValueBody(value)` | Transforma um corpo multipart em descritores de campo ordenados. |
| `collectByLocation(request, location)` | Filtra parâmetros por localização OpenAPI. |
| `operationName(request)` | Deriva um nome de função ou variável em snake_case a partir de método e caminho. |
| `sanitizeIdentifier(value)` | Transforma texto arbitrário em um identificador válido. |
| `indent(text, prefix="  ")` | Indenta cada linha não vazia. |
| `stringifyLiteral(value)` | JSON formatado com alternativa segura. |
| `kotlinValue(value)` / `formFieldValue(value)` | Serializa um valor para um literal ou campo de formulário. |
| `fileComment(path, fieldName)` | Cria um comentário TODO para um caminho multipart de marcador. |
| `mergeAllOfSchemas(schemas, resolver)` | Combina superficialmente esquemas `allOf`. |
| `lightweightOpenAPIPreCheck(doc)` | Retorna avisos estruturais sobre um documento. |
| `browserHeaders(headers, multipart)` | Remove headers proibidos pelo navegador. |
| `isBrowserForbiddenHeader(name)` | Indica se um header é controlado pelas APIs de rede do navegador. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Funções de escape de literais de string específicas de cada linguagem. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Guardas de asserção em tempo de execução. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Constantes para arquivos de marcador em uploads. |

---
sidebar_position: 4
title: "API 参考"
description: "@powerduck/openapi-codegen 的完整 API 文档。"
---

# API 参考

`@powerduck/openapi-codegen` 的完整 API 文档。

## 顶层函数

| 导出项 | 签名 | 说明 |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | 为单个操作生成可运行的源代码 |
| `register` | `(generator: Generator) => void` | 注册自定义生成器 |
| `get` | `(language: string, client: string) => Generator \| undefined` | 查找生成器 |
| `list` | `() => Array<{ language: string; client: string }>` | 列出全部已注册生成器 |
| `use` | `(plugin: Plugin) => void` | 应用用于注册生成器的插件 |
| `registerBuiltins` | `() => void` | 注册所有内置生成器，导入时自动调用 |
| `normalize` | `(options) => NormalizedRequest` | 将文档、路径与方法转换为规范化请求 |
| `builtinGenerators` | `Generator[]` | 所有内置生成器定义的原始数组 |

模块加载时会自动注册内置生成器，因此无需手动调用 `registerBuiltins()`。

## generate(options)

```ts
generate(options: GenerateOptions): string
```

以字符串返回生成的源代码。先通过 `get(options.language, options.client)` 查找生成器；若未提供 `options.request`，则调用 `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`；最后调用 `generator.generate(request)`。

可能抛出的错误：

- 当 `options` 不是对象或缺少必填输入时，抛出 `TypeError`。
- 未知的语言/客户端组合会抛出 `Error: Unsupported generator: <language>/<client>`。
- 来自 `normalize()` 的错误：未知路径或方法、无效文档，以及失效或循环的 `$ref`；启用 `softRefMode` 时会宽容处理引用错误。

完整选项表见 [配置](/docs/zh-CN/openapi-codegen/configuration/#generateoptions)。

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

以 `language\0client` 为键，注册到不区分大小写的内部存储中。

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

返回 `Generator`；未找到则返回 `undefined`。

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

等同于调用 `plugin.register({ register })`。

## registerBuiltins()

```ts
registerBuiltins();
```

具有幂等性，由内部标记保护。注册 `builtinGenerators` 中的所有条目。

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

解析 `$ref`，合并路径与操作参数，选择请求体媒体类型，生成示例值，解析安全方案，并计算 `baseUrl`。未知路径或方法，以及不支持的方法会导致错误。

## 内置生成器（21 种语言、41 种客户端） {#built-in-generators-21-languages-41-clients}

以下是 `src/emitters/index.ts` 中注册的精确 `language` / `client` 标识符。查找不区分大小写，表格列出规范写法。

| 语言 | `language` | `client` 值 |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP 请求文件 | `http` | `http1` |
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

共 21 种语言、41 种组合。

> 提供某个生成器，并不代表该客户端能表达所有操作。例如 `shell/wget` 无法安全地构造任意 `multipart/form-data` 请求；此时请使用 `shell/curl` 或 `shell/httpie`。

## 核心类型

从 `./types` 重新导出：

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

## 核心函数

以下函数和类型均从包的根入口重新导出。

### refs

| 导出项 | 说明 |
|--------|-------------|
| `RefResolver` | 解析文档内 `#/...` JSON Pointer 的类。构造函数为 `(root, softMode = false)`；方法包括 `deref(value)`、`resolveRef(ref)`、`clearCache()`；公开字段为 `softMode`。默认会对外部、失效或循环引用抛错，除非 `softMode` 为真。 |

### example

| 导出项 | 说明 |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | 从 JSON Schema 生成示例值，遵循 `example`、`enum`、`const`、`default`、`oneOf`/`anyOf`/`allOf`、类型、格式及约束。 |
| `ExampleGenContext` | 类型为 `{ isRequestBody: boolean; isResponse: boolean }`，用于控制 `readOnly`/`writeOnly` 过滤。 |
| `defaultExampleContext` | 默认值为 `{ isRequestBody: false, isResponse: false }`。 |

### serialize

| 导出项 | 说明 |
|--------|-------------|
| `Pair` | 类型为 `[string, string]`。 |
| `parameter(parameter)` | 按照 OpenAPI `style`/`explode` 规则，将单个参数序列化为 `Pair[]`，支持 form、spaceDelimited、pipeDelimited、label、matrix、simple、deepObject。 |
| `query(pairs)` | 将键值对拼接为查询字符串。 |
| `cookie(pairs)` | 将键值对拼接为 `Cookie` 请求头的值。 |
| `headerValue(value)` | 清理请求头值，移除 CR/LF/NUL。 |

### generator

| 导出项 | 说明 |
|--------|-------------|
| `createGenerator(language, client, emit)` | 将 `emit(request) => string` 函数包装为 `Generator`。 |
| `GeneratorEmitter` | 类型为 `(request: RequestIR) => string`。 |

### registry

| 导出项 | 说明 |
|--------|-------------|
| `registerGenerator(generator)` | 写入不区分大小写的存储。 |
| `getGenerator(language, client)` | 从存储中读取。 |
| `listGenerators()` | 返回 `[{ language, client }, ...]`。 |

### plugin

| 导出项 | 说明 |
|--------|-------------|
| `PluginApi` | 类型为 `{ register(generator: Generator): void }`。 |
| `applyPlugin(plugin, api)` | 调用 `plugin.register(api)`。 |

### request

| 导出项 | 说明 |
|--------|-------------|
| `CompiledRequest` | 类型为 `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`。 |
| `compile(request)` | 替换路径参数，构建查询、请求头和 Cookie 键值对，应用安全方案，并拼接 URL。 |
| `form(value)` | 将对象序列化为 `application/x-www-form-urlencoded` 字符串。 |

### helpers

常用工具：

| 导出项 | 说明 |
|--------|-------------|
| `isRecord(value)` | 普通对象的类型守卫。 |
| `isFileValue(value)` | `FileValue` 标记的类型守卫。 |
| `firstDefined(...values)` | 返回首个非 `undefined` 的值。 |
| `nonBlankString(value, fallback?)` | 返回去除两端空白后的非空字符串，或 `undefined`/回退值。 |
| `normalizeMethod(method)` | 将方法转为大写，默认使用 `GET`。 |
| `supportsRequestBody(method)` | 对于 `GET`/`HEAD` 返回 `false`。 |
| `requiresRequestBody(method)` | 对于 `POST`/`PUT`/`PATCH` 返回 `true`。 |
| `mediaTypeOf(request, fallback)` | 从请求体或 Content-Type 请求头获取有效媒体类型。 |
| `hasJsonBody(request)` | 判断媒体类型是否为 JSON 或 `+json`。 |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | 返回原始请求体文本或格式化 JSON。 |
| `toHeaderObject(headers)` | 将键值对转换为 `Record<string,string>`。 |
| `toKeyValueBody(value)` | 将 multipart 请求体展开为有序字段描述。 |
| `collectByLocation(request, location)` | 按 OpenAPI 参数位置过滤。 |
| `operationName(request)` | 根据方法与路径派生 snake_case 风格的函数名或变量名。 |
| `sanitizeIdentifier(value)` | 将任意文本转换为合法标识符。 |
| `indent(text, prefix="  ")` | 为每个非空行添加缩进。 |
| `stringifyLiteral(value)` | 格式化 JSON，并提供安全回退。 |
| `kotlinValue(value)` / `formFieldValue(value)` | 将值序列化为字面量或表单字段。 |
| `fileComment(path, fieldName)` | 为 multipart 文件占位路径生成 TODO 注释。 |
| `mergeAllOfSchemas(schemas, resolver)` | 浅合并 `allOf` 模式。 |
| `lightweightOpenAPIPreCheck(doc)` | 返回文档的结构性警告。 |
| `browserHeaders(headers, multipart)` | 移除浏览器禁止设置的请求头。 |
| `isBrowserForbiddenHeader(name)` | 判断某个请求头是否由浏览器网络 API 控制。 |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | 适用于各语言的字符串字面量转义函数。 |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | 运行时断言守卫。 |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | 文件上传占位值所用的常量。 |

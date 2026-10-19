---
sidebar_position: 4
title: "Configuração"
description: "Opções de geração de @powerduck/openapi-codegen: GenerateOptions, RequestIR e as interfaces Generator e Plugin."
---

# Configuração

Não há arquivo de configuração separado. A geração é controlada pelo objeto `GenerateOptions` passado para [`generate()`](/docs/pt-BR/openapi-codegen/api-reference/).

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

| Opção | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `language` | `string` | sim | Identificador da linguagem de destino, não diferencia maiúsculas de minúsculas, ex.: `"javascript"` |
| `client` | `string` | sim | Identificador do cliente HTTP de destino, ex.: `"fetch"` |
| `request` | `RequestIR` | uma alternativa* | Requisição já normalizada; pula `normalize` |
| `document` | `unknown` | uma alternativa* | Objeto de documento OpenAPI já analisado |
| `path` | `string` | com `document` | Modelo exato de caminho OpenAPI, ex.: `"/pets/{id}"` |
| `method` | `string` | com `document` | Método HTTP, ex.: `"get"` / `"post"` |
| `serverUrl` | `string` | não | Substitui a URL do servidor do documento |
| `securityValues` | `Record<string, string>` | não | Credenciais indexadas pelo nome do esquema de segurança |
| `softRefMode` | `boolean` | não | Não lança erro para `$ref` quebradas ou circulares; retorna valores parciais |

\* É necessário fornecer apenas `request` ou então `document` + `path` + `method`. Quando `request` é fornecido, `document`, `path`, `method`, `serverUrl`, `securityValues` e `softRefMode` são ignorados.

### Erros de validação de entrada

`generate()` lança um erro quando faltam entradas obrigatórias:

- `TypeError: generate() requires an options object` — Objeto de opções ausente.
- `Error: Unsupported generator: <language>/<client>` — Combinação desconhecida.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` lança `Error` para métodos não suportados, ausência de `paths`, caminhos desconhecidos e operações ausentes; lança `TypeError` para documentos que não são objetos.

## RequestIR

Representação normalizada de uma requisição, independente do gerador de código. Você pode criá-la diretamente e passá-la como `options.request` para pular `normalize`.

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

Marcadores de arquivo multipart usam esta estrutura:

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

Um gerador é qualquer objeto compatível com esta interface. Os geradores integrados são criados com `createGenerator(language, client, emit)`, mas você pode registrar os seus:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` recebe um `RequestIR` e retorna o código-fonte gerado como string.

## Plugin

Um plugin registra um ou mais geradores por meio de `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Exemplo:

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

Esse tipo foi declarado para futuras saídas que possam incluir vários arquivos. Atualmente, `generate()` ainda retorna uma `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Estrutura de saída de normalize

Chamar `normalize()` diretamente (veja a [referência da API](/docs/pt-BR/openapi-codegen/api-reference/#normalizeoptions)) retorna um objeto um pouco mais amplo que `RequestIR`:

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

## Ordem de resolução da URL do servidor

`baseUrl` usa o primeiro valor não vazio entre:

1. `options.serverUrl`
2. os `servers` da operação
3. os `servers` do item de caminho
4. os `servers` da raiz
5. o valor alternativo `"https://example.com"`

Os marcadores `{variable}` do servidor são preenchidos a partir de `server.variables`, usando `default` ou, na ausência dele, `example`, com codificação URI.

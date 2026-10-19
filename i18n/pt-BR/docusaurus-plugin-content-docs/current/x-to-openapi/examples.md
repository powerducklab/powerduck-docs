---
sidebar_position: 5
title: "Exemplos"
description: "Exemplos práticos e executáveis com a API pública"
---

# Exemplos

Exemplos práticos e executáveis com a API pública. As funções de conversão são assíncronas: use `await`. Elas analisam a entrada localmente, sem enviar as requisições HTTP registradas.

---

## 1. Comando curl básico

Converta um comando curl e examine o documento gerado.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

Os diagnósticos são retornados mesmo quando a conversão é bem-sucedida:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Vários comandos curl em lote

Passe um array de comandos ou uma string com vários comandos. Requisições com o mesmo método e caminho são mescladas; os esquemas são combinados estruturalmente.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### Saída de “Copiar tudo como cURL” do navegador

Cole o bloco inteiro: [`splitCurlCommands`](./api-reference.md#splitcurlcommands) trata aspas, continuações de linha, prompts e `curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Coleção Postman

Converta um objeto de coleção. Pastas aninhadas, herança de autenticação e scripts de teste são respeitados.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

Uma string JSON também funciona:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Inferência de parâmetros de caminho

Com `inferPathParameters` ativado, como ocorre por padrão, as requisições são agrupadas por método, origem e estrutura do caminho. Um segmento só vira parâmetro quando o grupo tem pelo menos `pathParameterMinSamples` requisições, os valores variam e **todos** parecem identificadores: números, UUID, ULID ou strings hexadecimais com pelo menos 8 caracteres.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

Os nomes dos parâmetros vêm do segmento estático anterior mais próximo, convertido para singular e camelCase:

| Padrão do caminho | Nomes dos parâmetros |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

Nomes repetidos no mesmo caminho recebem sufixos numéricos (`userId`, `userId2`).

Desative a inferência para manter os segmentos literais:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Adaptador personalizado

Implemente [`SourceAdapter`](./api-reference.md) para adicionar uma fonte, como HAR, HTTPie ou Insomnia, e registre-a em `XToOpenApi`.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. Tratamento de erros e modo estrito

Os problemas são coletados em `result.diagnostics`. Com `strict: true`, diagnósticos de nível erro lançam uma [`ConversionError`](./api-reference.md#conversionerror); avisos isolados não. Opções inválidas e IDs de adaptador desconhecidos também podem lançar exceções.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

A verificação atual de tamanho lança `ConversionError` quando uma string, ou a soma dos elementos string de um array, ultrapassa 10 × 1024 × 1024 unidades de código JavaScript, independentemente de `strict`. Não é um limite de bytes UTF-8 e não mede objetos já analisados; aplique seu próprio limite em bytes antes de aceitar entradas não confiáveis.

---

## Próximos passos

- [Referência da API](./api-reference.md): valores padrão das opções e códigos de diagnóstico.
- [Início rápido](./quickstart.md): sua primeira conversão completa.

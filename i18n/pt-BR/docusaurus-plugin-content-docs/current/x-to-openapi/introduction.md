---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi é um framework TypeScript extensível que converte comandos curl e coleções do Postman (v2.0 / v2.1.0) em documentos OpenAPI 3.2. Foi criado para pipelines de CI, geração de documentação de APIs e reconstrução de interfaces a partir de requisições HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** é um framework TypeScript extensível que converte **comandos curl** e **coleções do Postman (v2.0 / v2.1.0)** em documentos **OpenAPI 3.2**. Foi criado para pipelines de CI, geração de documentação de APIs e reconstrução de interfaces a partir de requisições HTTP.

Utiliza [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) para validar documentos.

- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Licença:** MIT
- **Requisito do Node.js:** `>= 22.12.0`
- **Saída:** somente OpenAPI **3.2.0**
- **Código-fonte:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Como funciona

```text
comando curl → CurlAdapter
coleção do Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → documento OpenAPI 3.2
             ↓
     validateOpenApi32() → diagnósticos
```

1. Um **adaptador** analisa a origem, como texto curl ou uma coleção do Postman, e produz uma lista de objetos [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. O **gerador** combina requisições por método e caminho, infere esquemas, parâmetros de caminho e segurança, e produz um documento OpenAPI 3.2.
3. O **validador** verifica a saída em relação ao esquema OpenAPI usando `@powerduck/openapi-parser` e retorna diagnósticos.

---

## Recursos

- **Dois adaptadores integrados:** [`CurlAdapter`](./api-reference.md#curladapter) aceita comandos individuais, lotes e a saída «Copy all as cURL» do navegador; [`PostmanAdapter`](./api-reference.md#postmanadapter) aceita v2.0/v2.1.0, pastas aninhadas e autenticação herdada.
- **Funções sem configuração:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) e [`postmanToOpenApi`](./api-reference.md) registram o adaptador e convertem em uma chamada.
- **Saída OpenAPI 3.2:** cada documento declara `openapi: "3.2.0"`. A validação é habilitada por padrão. Confira os diagnósticos ou ative o modo estrito para rejeitar erros.
- **Combinação de requisições:** operações com método e caminho iguais são combinadas; parâmetros de consulta, cabeçalhos, cookies e esquemas de corpo são mesclados estruturalmente.
- **Inferência de parâmetros de caminho:** IDs numéricos, UUIDs, ULIDs e segmentos hexadecimais longos viram modelos como `/users/{userId}` quando variam em pelo menos N amostras.
- **Inferência de segurança:** detecta Bearer, Basic e chaves de API em cabeçalhos, consultas ou cookies e gera os `securitySchemes` correspondentes.
- **Vários tipos de corpo:** JSON, XML, form-urlencoded, multipart/form-data com texto e arquivos, GraphQL, texto e binário.
- **Preservação de testes do Postman:** `pm.test()` / `pm.expect()` são incluídos como `x-postman-scripts` em cada operação.
- **Diagnósticos:** cada problema tem gravidade, código e detalhes de origem quando disponíveis; o modo [`strict`](./api-reference.md#convertoptions) lança exceções em caso de erro.
- **Extensível:** implemente [`SourceAdapter`](./api-reference.md) para adicionar origens HAR, HTTPie ou Insomnia.

---

## Arquitetura de plugins

O framework se baseia em uma pequena interface de adaptador:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Os adaptadores são registrados em uma instância [`XToOpenApi`](./api-reference.md#xtoopenapi) por meio de [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

As funções sem configuração já incluem os dois adaptadores; na maioria dos casos, não é necessário usar o registro diretamente.

---

## Funções auxiliares ou classe?

| Caso de uso | API |
|---|---|
| Converter um comando curl ou um lote | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Converter uma coleção do Postman como objeto ou string | [`postmanToOpenApi`](./api-reference.md) |
| Opções personalizadas, vários adaptadores, detecção `"auto"` ou adaptador próprio | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Próximos passos

- [Instalação](./installation.md) — adicionar o pacote e conhecer as funções sem configuração.
- [Início rápido](./quickstart.md) — converter comandos curl e coleções do Postman e usar um adaptador próprio.
- [Referência da API](./api-reference.md) — todas as exportações, tipos, opções, valores padrão e códigos de diagnóstico.
- [Exemplos](./examples.md) — curl, lotes de comandos, coleções do Postman, adaptadores próprios e inferência de caminhos.

---
sidebar_position: 6
title: "Configuração"
description: "A prioridade de resolução é argumentos CLI > arquivo de configuração > valores padrão. O resultado é o objeto CliConfig retornado por resolveConfig."
---

# Configuração

A prioridade de resolução é **argumentos CLI > arquivo de configuração > valores padrão**. O resultado é o objeto `CliConfig` retornado por [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

Tipo central de configuração. Todos os campos, exceto `specPath`, são opcionais.

| Campo | Tipo | Padrão | Descrição |
|-------|------|---------|-------------|
| `specPath` | `string` | **obrigatório** | Caminho ou URL `http(s)://` da especificação JSON OpenAPI 3.2 |
| `serverUrl` | `string` | *(da especificação)* | Substituir a URL base do servidor da especificação |
| `outputDir` | `string` | `"./openapi-cli-report"` | Diretório dos arquivos de relatório |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Formatos de relatório a gerar |
| `filter` | `FilterConfig` | `undefined` | Filtrar as operações a testar |
| `concurrency` | `number` | `5` | Máximo de requisições simultâneas; inteiro de 1 a 100 |
| `timeout` | `number` | `30000` | Tempo limite por requisição em ms, inteiro de 1 a 600000; também se aplica à busca de especificações remotas |
| `proxy` | `string` | `undefined` | URL do proxy HTTP(S), como `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Configuração de TLS e certificados |
| `headers` | `Record<string, string>` | `undefined` | Cabeçalhos extras enviados em todas as requisições |
| `auth` | `AuthConfig` | `undefined` | Configuração de autenticação |
| `variables` | `Record<string, string>` | `undefined` | Variáveis Postman `{{name}}` a injetar |
| `failOnError` | `boolean` | `true` | Somente CLI: retornar código diferente de zero após falhas nos testes; quem usa a biblioteca deve analisar o relatório |
| `envFile` | `string` | `undefined` | Caminho do arquivo `.env`, com um par `KEY=VALUE` por linha |
| `grpcReflection` | `boolean` | automático | gRPC: configuração explícita primeiro, depois a extensão da operação; caso contrário, ativado quando não há caminhos proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: caminhos de arquivos `.proto` ou diretórios |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: transporte das operações MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: comando a iniciar |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: argumentos do comando |
| `mcpCwd` | `string` | `undefined` | MCP stdio: diretório de trabalho |

`ReportFormat` é a união `"json" | "cli" | "html"`.

## Opções avançadas de execução

Os campos a seguir também fazem parte de `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` e `maxResponseSize` podem ser fornecidos em um arquivo JSON. Após resolver a configuração, passe `signal`, `httpRuntime` e `resolveTransport` diretamente para `runTests()` no código: são objetos de execução, não configuração JSON.

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

`requester` controla redirecionamentos HTTP, cookies e a seleção do protocolo. Para HTTP/SSE, `maxEvents` tem padrão 50 e `maxStreamMs` usa `timeout` quando não definido; `maxResponseSize` é encaminhado ao mecanismo de requisições. gRPC usa `maxStreamMs` como prazo do fluxo, depois `timeout` e, por último, 30000 ms. `signal` cancela a execução; `httpRuntime` fornece o tratamento HTTP de certificados e arquivos; `resolveTransport` resolve as configurações de transporte por destino.

## DEFAULT_CONFIG

Objeto de valores padrão exportado pela biblioteca:

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

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `methods` | `string[]` | Testar apenas estes métodos HTTP, como `["get","post"]`; use minúsculas nos arquivos, pois a entrada CLI é normalizada |
| `paths` | `string[]` | Testar apenas caminhos que correspondam a alguma expressão regular; se a expressão for inválida, usa busca por substring |
| `tags` | `string[]` | Testar apenas operações com alguma destas tags |
| `operationIds` | `string[]` | Testar apenas estes valores exatos de `operationId` |

Um filtro sem chaves é resolvido como `undefined`: todas as operações são executadas.

## TlsConfig

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `caCert` | `string` | Caminho do conjunto de certificados CA em PEM |
| `clientCert` | `string` | Caminho do certificado do cliente PEM para mTLS |
| `clientKey` | `string` | Caminho da chave privada do cliente PEM para mTLS |
| `strictSSL` | `boolean` | Ignorar a verificação TLS quando for `false`; inseguro |
| `pfx` | `string` | Caminho do conjunto de certificados PFX; gRPC exige PEM |
| `passphrase` | `string` | Senha do material de certificado criptografado |

> Observação: a opção CLI `--insecure` corresponde a `tls.strictSSL = false`, ou seja, **desativa** a verificação.

## AuthConfig

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Esquema de autenticação; veja os nomes compatíveis abaixo |
| `parameters` | `Record<string, string \| number \| boolean>` | Parâmetros específicos do esquema enviados ao mecanismo de requisições |
| `token` | `string` | Token Bearer para `type: "bearer"` |
| `username` | `string` | Nome de usuário para `type: "basic"` |
| `password` | `string` | Senha para `type: "basic"` |
| `key` | `string` | Nome da chave de API para `type: "apikey"` |
| `value` | `string` | Valor da chave de API para `type: "apikey"` |
| `in` | `"header" \| "query"` | Local em que a chave de API é inserida |

Os valores de `type` aceitos são `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` e `edgegrid`. A disponibilidade e os parâmetros necessários dependem do protocolo e do mecanismo de requisições; informar apenas o nome não configura a autenticação.

Atualmente, a opção CLI `--bearer` produz apenas `{ type: "bearer", token }`. Configurações mais completas de `basic` / `apikey` são fornecidas por arquivo.

## Arquivo de configuração JSON

O arquivo contém JSON compatível com `Partial<CliConfig>`. Informe-o com `--config <path>` / `-c`. Argumentos CLI sempre prevalecem sobre os valores do arquivo.

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

Um arquivo ausente gera `Config file not found: <path>`; JSON inválido gera `Invalid config file (must be JSON)`.

## Expansão de variáveis de ambiente

Após carregar um arquivo `.env` por `--env` / `envFile`, as referências `${VAR_NAME}` são expandidas nestes campos de texto:

- `serverUrl`
- `proxy`
- Valores de `headers`
- `auth.token`
- Valores de `variables`

Exemplo:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Comportamento de `.env`: entradas existentes em `process.env` **não** são sobrescritas; aspas simples ou duplas ao redor dos valores são removidas; linhas vazias e comentários `#` são ignorados; arquivos ausentes são ignorados silenciosamente.

## Construção no código

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` lança `"No OpenAPI spec path provided..."` quando nenhuma especificação é fornecida e `Invalid proxy URL: <url>` quando `proxy` não é uma URL válida.

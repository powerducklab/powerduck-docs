---
sidebar_position: 4
title: "Referência da API"
description: "Referência completa de @powerduck/conf-patch, com as assinaturas e os valores padrão de cada símbolo exportado."
---

# Referência da API

Referência completa de `@powerduck/conf-patch`, com as assinaturas e os valores padrão de cada símbolo exportado.

Há dois pontos de entrada:

- **`@powerduck/conf-patch`** — todos os recursos abaixo: camada principal, arquivos, validação OpenAPI e utilitários.
- **`@powerduck/conf-patch/core`** — apenas o subconjunto compatível com navegadores: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, funções de asserção e os tipos `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Camada principal (compatível com navegadores)

### `patchContent`

Aplica uma lista de operações RFC 6902 a uma string de configuração. Função pura, sem acesso ao sistema de arquivos.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `content` | `string` | Conteúdo bruto da configuração. Deve corresponder ao `format` indicado. |
| `ops` | `JsonPatchOp[]` | Operações aplicadas em ordem. Um array vazio retorna `content` sem alterações. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Com `true` (padrão), uma operação com falha lança uma exceção. Com `false`, ela é ignorada e informada por `console.warn`. |

**Retorna:** o conteúdo de configuração modificado (`string`).

**Exceções:** `TypeError` se `content` não for uma string ou `ops` for inválido; um erro descrevendo a operação com falha quando `strict` for `true`.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

Define ou cria um valor. Internamente chama `patchContent` com uma operação `add`. Conforme a RFC 6902, `add` substitui uma propriedade existente ou insere em um índice de array.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `content` | `string` | Conteúdo bruto da configuração. |
| `path` | `readonly (string \| number)[]` | Caminho em segmentos, por exemplo `["server", "port"]`. Não pode estar vazio. |
| `value` | `unknown` | Valor a gravar. |
| `format` | `ConfigFormat` | Formato da configuração. |

**Retorna:** o conteúdo atualizado (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Remove uma chave ou um elemento de array. Internamente chama `patchContent` com uma operação `remove`. O caminho precisa existir.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## Camada de arquivos (somente Node.js / Electron)

### `readConfigFile`

Lê texto UTF-8 de um caminho local ou URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filePath` | `string` | Caminho absoluto, relativo ou URL `file://`. Não pode estar vazio. |

**Retorna:** o conteúdo UTF-8 bruto (`Promise<string>`).

**Exceções:** se a leitura falhar, um erro que contém a falha subjacente do sistema de arquivos.

---

### `writeConfigFile`

Grava conteúdo de forma **atômica**, usando arquivo temporário e renomeação, com um **bloqueio de arquivo** exclusivo por padrão. Os diretórios pais são criados antes do bloqueio.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filePath` | `string` | Caminho do arquivo de configuração. |
| `content` | `string` | Conteúdo a gravar. Deve ser uma string. |
| `options` | `WriteConfigOptions` | Veja abaixo. |

**Exceções:** `TypeError` para entradas inválidas; falhas de gravação do sistema de arquivos são encapsuladas.

#### `WriteConfigOptions`

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `lock` | `boolean` | `true` | Ativar o bloqueio durante a gravação. |
| `lockTimeoutMs` | `number` | Padrão de `withFileLock` (10 s) | Espera máxima para adquirir o bloqueio, em milissegundos. |
| `lockRetryDelayMs` | `number` | Padrão de `withFileLock` (25 ms) | Espera inicial entre tentativas, em milissegundos, antes do aumento exponencial. |
| `lockStaleThresholdMs` | `number` | Padrão de `withFileLock` | Idade do bloqueio, em milissegundos, a partir da qual a recuperação é permitida. |
| `allowStaleRecovery` | `boolean` | `false` | Permitir a recuperação automática de bloqueios obsoletos. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Transação principal da camada de arquivos: lê sob bloqueio, aplica `patchContent` e grava de forma atômica **somente se o conteúdo mudar**. Sem `options.format`, o formato é detectado pela extensão.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filePath` | `string` | Caminho do arquivo de configuração. Não pode estar vazio. |
| `ops` | `JsonPatchOp[]` | Operações a aplicar. Um array vazio retorna sem leitura nem gravação. |
| `options` | `PatchConfigOptions` | Veja abaixo. |

**Exceções:** `TypeError` se `filePath` estiver vazio, as opções de bloqueio forem inválidas ou não for possível detectar o formato sem um `format` explícito; erro da operação quando `strict` for `true`.

#### `PatchConfigOptions`

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `format` | `ConfigFormat` | detecção automática | Formato explícito, com prioridade sobre a detecção pela extensão. |
| `strict` | `boolean` | `true` | Operações com falha lançam exceções. |
| `lock` | `boolean` | `true` | Ativar o bloqueio de arquivos. |
| `lockTimeoutMs` | `number` | 10 s | Não negativo. Espera máxima pelo bloqueio. |
| `lockRetryDelayMs` | `number` | 25 ms | Positivo. Espera inicial entre tentativas. |
| `lockStaleThresholdMs` | `number` | calculado | Positivo. Idade necessária para recuperar um bloqueio obsoleto. |
| `allowStaleRecovery` | `boolean` | `false` | Recuperar automaticamente bloqueios obsoletos. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Adiciona ou substitui um valor aninhado em um arquivo. Delega uma operação `add` a `patchConfigFile`.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

Remove um valor aninhado existente de um arquivo. Delega uma operação `remove` a `patchConfigFile`.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

Executa um callback assíncrono por uma fila local ao processo **e** um arquivo de bloqueio exclusivo (`<file>.confedit.lock`). Os bloqueios usam tokens de propriedade. Um bloqueio obsoleto só é recuperado se `allowStaleRecovery` for `true` e sua idade ultrapassar `staleThresholdMs`. PIDs não são verificados, pois podem ser reutilizados.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filePath` | `string` | Arquivo a bloquear. |
| `callback` | `() => Promise<T>` | Trabalho executado enquanto o bloqueio estiver ativo. |
| `options` | `FileLockOptions` | Veja abaixo. |

**Retorna:** o resultado de `callback` (`Promise<T>`). O bloqueio sempre é liberado em um bloco `finally`, mesmo se o callback lançar uma exceção.

#### `FileLockOptions`

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Espera máxima pelo bloqueio, em milissegundos. Deve ser não negativa. |
| `retryDelayMs` | `number` | `25` | Espera inicial em milissegundos. Deve ser positiva. Aumenta por um fator de 1,5 até o limite de 1000 ms. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Idade que permite a recuperação, em milissegundos. Deve ser positiva. |
| `allowStaleRecovery` | `boolean` | `false` | Recuperação automática de bloqueios obsoletos. Desativada por padrão no processo principal único do Electron para evitar a interrupção de transações ativas. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Remove todos os arquivos de bloqueio do processo atual. Use durante o encerramento, após as transações ativas terminarem. Para limpeza assíncrona no Electron, impeça a primeira saída e retome o encerramento depois da limpeza, conforme os exemplos. Falhas individuais são ignoradas.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Validação de OpenAPI

### `validateOpenAPISpec`

Valida conteúdo bruto OpenAPI/Swagger em JSON ou YAML. A entrada é tratada como **conteúdo** por padrão; só é interpretada como caminho com `inputKind: "file"`. A validação é delegada a `@powerduck/openapi-parser`; esta função acrescenta controles de segurança às entradas.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `input` | `string` | Conteúdo bruto da especificação, ou caminho de arquivo com `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Veja abaixo. |

**Retorna:** o documento validado em caso de sucesso (`Promise<AnyOpenAPIDocument>`).

**Exceções:** `TypeError` para entrada vazia ou que não seja string; [`OpenApiValidationError`](#openapivalidationerror) para opções inválidas ou falhas de validação.

---

### `validateOpenAPIFile`

Atalho que chama `validateOpenAPISpec` com `inputKind: "file"` e `baseFilePath` definido como o caminho informado. Exige `allowedRootDirectory`.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Como interpretar `input`. |
| `baseFilePath` | `string` | — | Caminho base do contexto de resolução de referências. |
| `allowedRootDirectory` | `string` | — | Diretório raiz dos arquivos de entrada. **Obrigatório** quando `inputKind` é `"file"`. |
| `timeoutMs` | `number` | `15000` | Prazo máximo da operação, em milissegundos. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Tamanho máximo da entrada bruta, em bytes. |
| `maxDocumentNodes` | `number` | `100000` | Número máximo de nós do documento analisado, como proteção contra DoS. |
| `maxDocumentDepth` | `number` | `100` | Profundidade máxima de aninhamento, como proteção contra DoS. |
| `maxValidationErrors` | `number` | `50` | Número máximo de erros incluídos na mensagem. |
| `maxErrorMessageLength` | `number` | `1000` | Número máximo de caracteres por erro de validação. |
| `signal` | `AbortSignal` | — | Sinal de cancelamento opcional. |

---

### `OpenApiValidationError`

Erro estruturado lançado quando a validação falha. Adapte os erros no limite da aplicação antes de retorná-los ao cliente: mensagens e causas podem conter caminhos locais ou detalhes do documento.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Propriedade | Tipo | Descrição |
|---|---|---|
| `code` | `string` | Código de erro processável pelo programa; veja a tabela abaixo. |
| `message` | `string` | Detalhe legível para o usuário. |
| `cause` | `unknown` | Erro subjacente opcional. |

#### Códigos de erro

| Código | Significado |
|---|---|
| `INVALID_OPTION` | Foi informado um valor de opção inválido. |
| `INPUT_TOO_LARGE` | O conteúdo bruto excede `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | O arquivo de entrada excede o limite de tamanho. |
| `FILE_INPUT_FORBIDDEN` | Entrada de arquivo usada sem `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | O caminho resolvido está fora de `allowedRootDirectory`. |
| `PARSE_ERROR` | Não foi possível analisar o conteúdo JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | O documento não é um objeto JSON. |
| `UNSUPPORTED_VERSION` | O documento não declara uma versão OpenAPI/Swagger compatível; apenas as versões principais `2` e `3` são aceitas. |
| `DOCUMENT_TOO_DEEP` | A profundidade excede `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | O número de nós excede `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | A especificação não passou na validação OpenAPI. |
| `OPERATION_TIMEOUT` | A operação excedeu `timeoutMs`. |
| `OPERATION_ABORTED` | A operação foi cancelada por `signal`. |
| `UNKNOWN_ERROR` | Erro inesperado. |

---

## Utilitários

### `detectFormat`

Detecta um [`ConfigFormat`](#configformat) pela extensão de um caminho ou URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Extensão | Resultado |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| qualquer outra extensão | lança um erro |

---

### `normalizeFilePath`

Converte um caminho local ou URL `file:` em um caminho nativo absoluto. Preserva espaços válidos e nomes de arquivo Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

Uma URL `file:` é decodificada com `fileURLToPath`; um caminho absoluto é retornado sem alterações; um caminho relativo é resolvido a partir de `process.cwd()`.

---

## Funções de asserção

São reexportadas para usos avançados e módulos internos. O código da aplicação raramente precisa chamá-las diretamente.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Lança `TypeError` se `value` não for uma string não vazia.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Lança uma exceção se `path` não for um array não vazio de strings não vazias ou inteiros seguros não negativos.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Valida cada operação: `op` deve ser `"add" | "replace" | "remove"`, `path` deve passar em `assertPatchPath`, e `add`/`replace` devem ter uma propriedade própria `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Lança uma exceção se `format` não for `"json"`, `"jsonc"` ou `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Retorna `error.message` para instâncias de `Error`; caso contrário, `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Cria um `Error` e adiciona a propriedade `cause` com `Object.defineProperty`, com uma alternativa para ambientes de execução antigos.

---

## Tipos

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
Apenas `"add"`, `"replace"` e `"remove"` são aceitos. `"move"`, `"copy"` e `"test"` são excluídos intencionalmente.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

União das estruturas de documentos OpenAPI/Swagger compatíveis retornadas pela validação:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` é um tipo estrutural permissivo:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Resumo das exportações

| Símbolo | Entrada principal | Subcaminho do núcleo | Categoria |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | função |
| `setContentValue` | ✓ | ✓ | função |
| `deleteContentValue` | ✓ | ✓ | função |
| `PatchContentOptions` | ✓ | ✓ | tipo |
| `assertNonEmptyString` | ✓ | ✓ | função |
| `assertPatchPath` | ✓ | ✓ | função |
| `assertPatchOperations` | ✓ | ✓ | função |
| `assertConfigFormat` | ✓ | ✓ | função |
| `getErrorMessage` | ✓ | ✓ | função |
| `createError` | ✓ | ✓ | função |
| `ConfigFormat` | ✓ | ✓ | tipo |
| `JsonPatchOp` | ✓ | ✓ | tipo |
| `JsonPathSegment` | ✓ | ✓ | tipo |
| `readConfigFile` | ✓ | — | função |
| `writeConfigFile` | ✓ | — | função |
| `WriteConfigOptions` | ✓ | — | tipo |
| `patchConfigFile` | ✓ | — | função |
| `setConfigValue` | ✓ | — | função |
| `deleteConfigValue` | ✓ | — | função |
| `withFileLock` | ✓ | — | função |
| `releaseAllLocalLocks` | ✓ | — | função |
| `PatchConfigOptions` | ✓ | — | tipo |
| `FileLockOptions` | ✓ | — | tipo |
| `detectFormat` | ✓ | — | função |
| `normalizeFilePath` | ✓ | — | função |
| `validateOpenAPISpec` | ✓ | — | função |
| `validateOpenAPIFile` | ✓ | — | função |
| `OpenApiValidationError` | ✓ | — | classe |
| `ValidateOpenApiOptions` | ✓ | — | tipo |
| `OpenApiInputKind` | ✓ | — | tipo |
| `AnyOpenAPIDocument` | ✓ | — | tipo |
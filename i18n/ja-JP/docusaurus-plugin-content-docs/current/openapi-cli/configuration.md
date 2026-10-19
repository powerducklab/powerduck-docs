---
sidebar_position: 6
title: "設定"
description: "設定は CLI 引数 > 設定ファイル > 既定値 の優先順位で解決されます。結果は resolveConfig が返す CliConfig オブジェクトです。"
---

# 設定

設定は **CLI 引数 > 設定ファイル > 既定値** の優先順位で解決されます。結果は [`resolveConfig`](./api-reference.md#resolveconfig) が返す `CliConfig` オブジェクトです。

## CliConfig

中心となる設定型です。`specPath` 以外はすべて省略可能です。

| フィールド | 型 | 既定値 | 説明 |
|-------|------|---------|-------------|
| `specPath` | `string` | **必須** | OpenAPI 3.2 JSON 仕様のパスまたは `http(s)://` URL |
| `serverUrl` | `string` | *（仕様から取得）* | 仕様のサーバーベース URL を上書き |
| `outputDir` | `string` | `"./openapi-cli-report"` | レポートファイルの出力先ディレクトリ |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | 生成するレポート形式 |
| `filter` | `FilterConfig` | `undefined` | テストする操作を絞り込む |
| `concurrency` | `number` | `5` | 最大同時リクエスト数。1～100 の整数 |
| `timeout` | `number` | `30000` | リクエストごとのタイムアウト（ミリ秒）。1～600000 の整数。リモート仕様の取得にも適用 |
| `proxy` | `string` | `undefined` | HTTP(S) プロキシ URL。例：`http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS と証明書の設定 |
| `headers` | `Record<string, string>` | `undefined` | 各リクエストで送信する追加ヘッダー |
| `auth` | `AuthConfig` | `undefined` | 認証設定 |
| `variables` | `Record<string, string>` | `undefined` | 注入する Postman 変数 `{{name}}` |
| `failOnError` | `boolean` | `true` | CLI のみ：テスト失敗後にゼロ以外の終了コードを返す。ライブラリの呼び出し側はレポートを確認する |
| `envFile` | `string` | `undefined` | 1 行に 1 組の `KEY=VALUE` を記述した `.env` ファイルのパス |
| `grpcReflection` | `boolean` | 自動 | gRPC：明示的な設定、操作の拡張の順に優先。どちらもなければ proto パスが未指定の場合に有効 |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC：`.proto` ファイルまたはディレクトリのパス |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP：MCP 操作のトランスポート |
| `mcpCommand` | `string` | `undefined` | MCP stdio：起動するコマンド |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio：コマンド引数 |
| `mcpCwd` | `string` | `undefined` | MCP stdio：作業ディレクトリ |

`ReportFormat` は共用体型 `"json" | "cli" | "html"` です。

## 高度なランタイムオプション

次のフィールドも `CliConfig` に含まれます。`requester`、`maxEvents`、`maxStreamMs`、`maxResponseSize` は JSON 設定ファイルで指定できます。`signal`、`httpRuntime`、`resolveTransport` は JSON 設定ではなく実行時のオブジェクトなので、設定の解決後にコードから `runTests()` へ直接渡してください。

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

`requester` は HTTP リダイレクト、Cookie、プロトコル選択を制御します。HTTP/SSE では `maxEvents` の既定値は 50 で、`maxStreamMs` は未指定なら `timeout` を使用します。`maxResponseSize` はリクエストランタイムに渡されます。gRPC のストリーム期限には `maxStreamMs`、次に `timeout`、最後に 30000 ミリ秒が使われます。`signal` は実行をキャンセルし、`httpRuntime` は HTTP の証明書・ファイル処理を提供し、`resolveTransport` は対象ごとのトランスポート設定を解決します。

## DEFAULT_CONFIG

ライブラリからエクスポートされる組み込みの既定値オブジェクトです。

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

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `methods` | `string[]` | 指定した HTTP メソッドのみテスト。例：`["get","post"]`。設定ファイルでは小文字を使用し、CLI 入力は自動的に正規化される |
| `paths` | `string[]` | いずれかの正規表現に一致するパスのみテスト。正規表現が無効なら部分文字列照合に切り替える |
| `tags` | `string[]` | いずれかの指定タグを持つ操作のみテスト |
| `operationIds` | `string[]` | 指定した `operationId` と完全一致する操作のみテスト |

キーがないフィルターは `undefined` に解決され、すべての操作が実行されます。

## TlsConfig

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `caCert` | `string` | CA 証明書バンドル（PEM）のパス |
| `clientCert` | `string` | mTLS 用クライアント証明書（PEM）のパス |
| `clientKey` | `string` | mTLS 用クライアント秘密鍵（PEM）のパス |
| `strictSSL` | `boolean` | `false` で TLS 証明書検証を省略。安全ではない |
| `pfx` | `string` | PFX 証明書バンドルのパス。gRPC では PEM が必要 |
| `passphrase` | `string` | 暗号化された証明書素材のパスフレーズ |

> 注：CLI オプション `--insecure` は `tls.strictSSL = false` に対応し、検証を**無効化**します。

## AuthConfig

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | 認証方式。対応する名前は下記を参照 |
| `parameters` | `Record<string, string \| number \| boolean>` | リクエストランタイムへ渡す認証方式固有のパラメーター |
| `token` | `string` | `type: "bearer"` 用の Bearer トークン |
| `username` | `string` | `type: "basic"` 用のユーザー名 |
| `password` | `string` | `type: "basic"` 用のパスワード |
| `key` | `string` | `type: "apikey"` 用の API キー名 |
| `value` | `string` | `type: "apikey"` 用の API キー値 |
| `in` | `"header" \| "query"` | API キーを配置する場所 |

対応する `type` は `bearer`、`basic`、`apikey`、`none`、`digest`、`oauth1`、`oauth2`、`jwt`、`hawk`、`aws4`、`ntlm`、`asap`、`edgegrid` です。利用可否と必須パラメーターはプロトコルとリクエストランタイムによって異なり、名前の指定だけでは認証設定は完了しません。

現在、CLI の `--bearer` は `{ type: "bearer", token }` のみを生成します。より詳細な `basic` / `apikey` 設定は設定ファイルから指定します。

## JSON 設定ファイル

設定ファイルは `Partial<CliConfig>` に従う通常の JSON です。`--config <path>` / `-c` で指定します。CLI 引数は常にファイルの値より優先されます。

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

ファイルがない場合は `Config file not found: <path>`、JSON が無効な場合は `Invalid config file (must be JSON)` がスローされます。

## 環境変数の展開

`--env` / `envFile` で `.env` を読み込むと、次の文字列フィールド内の `${VAR_NAME}` 参照が展開されます。

- `serverUrl`
- `proxy`
- `headers` の値
- `auth.token`
- `variables` の値

例：

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` の動作：既存の `process.env` エントリーは**上書きしません**。値を囲む単一・二重引用符は除去し、空行と `#` コメント行は無視します。ファイルがない場合は通知せずにスキップします。

## プログラムでの設定構築

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

仕様が指定されていない場合、`resolveConfig` は `"No OpenAPI spec path provided..."` をスローします。`proxy` が有効な URL でない場合は `Invalid proxy URL: <url>` をスローします。

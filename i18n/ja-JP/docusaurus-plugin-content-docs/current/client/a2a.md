---
sidebar_position: 6
title: "A2A エージェント"
description: "A2A の設計、デバッグ、ドキュメント化。JSON-RPC、REST、デスクトップ gRPC、JWS 検証と実行可能なデモ。"
---

# A2A エージェント

MCP はツールとリソースを公開し、A2A はエージェント間の委任、メッセージ、タスク、成果物を扱います。Powerduck は両者を別々のプロトコルとして同じローカル仕様で管理します。

## 作成とデバッグ

1. **新規リクエスト → A2A** を選択します。既定は **1.0 / JSON-RPC**。1.0 は REST とデスクトップ gRPC にも対応し、0.3 は JSON-RPC のみです。暗黙のバージョン変換は行いません。
2. エンドポイントとメソッドを選び、**リクエスト本文を生成**でプレビューを確認してから **リクエスト本文を置換**を押します。キャンセルやメソッドの切り替えだけでは下書きを変更しません。
3. JSON-RPC は本文の `params`、REST/gRPC は直接リクエストオブジェクトを編集します。REST/gRPC に `jsonrpc`、`id`、`params` の外側の封筒は不要です。認証とヘッダーを設定すると、送信時に `A2A-Version` が付与されます。
4. HTTP 200 でも RPC `error` を確認してください。1.0 の JSON-RPC 成功応答は `result` 内に `task` または `message` を含みます。
5. 仕様に保存すると、`x-a2a` に設定、例、契約が保持されます。JSON-RPC は本文のメソッド、REST/gRPC は選択したメソッドを使用します。リクエスト ID とメッセージ ID は別です。会話を継続する際は応答のコンテキスト／タスク ID を引き継ぎます。

## トランスポート

REST の URL は `https://agent.example/rest` のようなマウント先です。メソッドから HTTP 動詞とパスを決定し、タスク ID をエンコードし、絞り込みとページングをクエリに変換します。デバッグとドキュメントは同じ対応表を使います。

gRPC はデスクトップ専用です。システムの証明書を信頼する TLS は `https://host:port`、ローカル平文テストは `http://localhost:port` を使い、パスは付けません。ヘッダーは metadata になり、公式 `lf.a2a.v1.A2AService` と ProtoJSON を使用します。HTTP スクリプト、プロキシ、独自 TLS 設定はこのバインディングでは拒否されます。

## Agent Card と JWS

通常は `/.well-known/agent-card.json` から **公開 Agent Card を取得**します。能力、スキル、認証、バージョンを確認してからインターフェースを明示的に適用します。取得だけで URL を変更したり別の宛先へ認証情報を送ったりしません。公開取得は認証情報とリダイレクトを使用せず、上限は 1 MiB。ブラウザーには CORS が必要です。

**JWS 署名を検証**を開き、信頼できる経路で取得した公開 JWKS を貼り付けます。検証はローカルで行い、カード内の鍵 URL を参照しません。対象は A2A 1.0 標準フィールドのみで、独自フィールドは含みません。A2A のフィールド存在規則と RFC 8785 に従い、必須の空文字列・配列や明示された任意の真偽値を保持します。これらを削除する署名者とは互換性がありません。署名成功だけでは未知の鍵の所有組織を保証できません。

カード保存はスナップショットのみで、信頼判定は保存しません。共有前に非公開情報を除去してください。保護された情報には認証付き extended-card メソッドを使います。

## タスクとストリーム

1.0 は `SendStreamingMessage`／`SubscribeToTask`、0.3 は `message/stream`／`tasks/resubscribe` を使います。SSE またはネイティブ gRPC のイベント、状態、成果物を確認できます。**停止**はローカル接続のみ終了します。リモートの中止はタスク ID を指定して `CancelTask` または `tasks/cancel` を送信します。終了済みタスクはそのまま再開できません。

タスク取得、1.0 の一覧、拡張カード、プッシュ通知設定の対応可否はエージェントの能力次第です。Powerduck は通知受信サーバーをホストしません。

## OpenAPI 拡張

`x-a2a` は Powerduck 独自の拡張で、標準 Agent Card や OpenAPI キーワードではありません。仕様のパスは操作の識別子で、実際の送信先は `endpoint` です。

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version` は `1.0`／`0.3`、`binding` は `JSONRPC`（1.0 は `HTTP+JSON`／`GRPC` も可）。`agentCardUrl` は探索先、`agentCard` は任意のスナップショットです。`example` は JSON-RPC の封筒または REST/gRPC オブジェクト。`requestSchema`／`responseSchema` は明示的な契約で、単一の応答から完全な契約を推定しません。SSE は `text/event-stream` と OAS 3.2 `itemSchema` を使用します。ドキュメントと Copy for LLM は設定を保持し、gRPC は ProtoJSON、HTTP バインディングはコード例を表示します。

## サーバー生成

**サーバー生成 → サーバープロジェクトをダウンロード**から Node.js 22+ のプロジェクトを取得します。`npm install` 後、32 文字以上のランダムな `A2A_TOKEN` と `HANDLER_URL` を設定して `npm start`。HTTP ハンドラーは `{message, contextId}` を受け取り、空でない `parts` を含む Message を返します。既存の認証情報はエクスポートされません。

ペイロード上限、60 秒の期限、同時実行制限、終了処理があります。`SIGNING_JWK_FILE` で署名し、`CORS_ORIGINS` でブラウザーの許可元を指定できます。ステートレスなアダプターであり、永続タスクやプッシュ配信エンジンではありません。公開前に URL、TLS、リバースプロキシのレート制限、複数ユーザー向け認証を設定してください。

## 実行可能なローカルデモ

React リポジトリの `examples/a2a-demo` は数値の合計を返します。AI キーや外部サービスは不要です。

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

`openapi.json` をインポートし、Bearer Token に `powerduck-local-demo-token-0123456789` を設定します。`[12,30]` を送ると `Sum: 42` と構造化された `total: 42` が返ります。JSON-RPC は `http://127.0.0.1:9999/rpc`、REST は `http://127.0.0.1:9999/rest`、gRPC は `http://127.0.0.1:9998`。カードは `http://127.0.0.1:9999/.well-known/agent-card.json` です。検証にはローカルの `.runtime/trusted-jwks.json` を使い、再起動後は新しい鍵を読み込みます。

`npm test` は別ポートで全トランスポート、SSE、構造化応答、改ざん拒否、認証、CORS を検証します。デモはローカル専用で、永続タスクやプッシュ配信はありません。デモ token を公開運用に使わないでください。ブラウザーの許可元は既定で `http://localhost:3000` と `http://127.0.0.1:3000`。他のオリジンは `CORS_ORIGINS` で指定します。

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)

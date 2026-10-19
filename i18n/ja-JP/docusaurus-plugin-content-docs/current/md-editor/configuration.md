---
sidebar_position: 4
title: "設定"
description: "MarkdownEditor コンストラクターは、コンテナー要素またはセレクターと、その後に MarkdownEditorOptions オブジェクトを受け取ります。このページでは各フィールドの型、既定値、動作、および関連するオプションの型を説明します。"
---

# 設定

`MarkdownEditor` コンストラクターは、コンテナー要素またはセレクターと、その後に `MarkdownEditorOptions` オブジェクトを受け取ります。このページでは各フィールドの型、既定値、動作、および関連するオプションの型を説明します。

## `MarkdownEditorOptions`

```ts
interface MarkdownEditorOptions {
  value?: string;
  mode?: EditorMode;
  theme?: EditorTheme;
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  preview?: boolean;
  onChange?: (value: string) => void;
  toolbar?: ToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
  mention?: MentionOptions;
  docLink?: DocLinkOptions;
  renderDebounce?: number | false;
  autoPreview?: boolean;
}
```

| オプション | 型 | 既定値 | 説明 |
|--------|------|---------|-------------|
| `value` | `string` | `''` | 初期の Markdown コンテンツ。 |
| `mode` | `EditorMode` | `'simple'` | `'simple'` はツールバーやステータスバーなしで編集領域とプレビューを表示します。`'complex'` は両方のバーを追加します。 |
| `theme` | `EditorTheme` | `'light'` | `data-theme` 属性で適用するテーマ。`'light'` または `'dark'`。 |
| `math` | `boolean` | `true` | KaTeX 数式を有効にします。インラインは `$...$`、ブロックは `$$...$$`。 |
| `mindmap` | `boolean` | `true` | ```` ```mindmap ```` のフェンス付きブロックから Markmap マインドマップを描画します。 |
| `codeHighlight` | `boolean` | `true` | 3 色の丸を備えたヘッダーとコピーボタン付きの highlight.js コードブロックを有効にします。 |
| `tips` | `boolean` | `true` | `:::notice`、`:::warning` などの注記ブロックを有効にします。 |
| `preview` | `boolean` | `true` | プレビュー領域を表示します。`false` の場合は編集領域だけを作成します。 |
| `onChange` | `(value: string) => void` | — | 編集のたびに、文書全体の文字列を引数として呼び出します。 |
| `toolbar` | `ToolbarConfig` | すべての操作 | ツールバーに表示する操作を指定し、ラベルやアイコンを上書きします。 |
| `onImageUpload` | `(file: File) => Promise<string>` | — | エディターに画像ファイルを貼り付けるかドロップすると呼び出すフックです。Promise は画像 URL を返し、`![alt](url)` として挿入されます。画像ダイアログは URL 入力用で、ファイル選択機能はありません。 |
| `mention` | `MentionOptions` | — | @メンションのドロップダウン設定。省略すると、`@` を入力してもドロップダウンは開きません。 |
| `docLink` | `DocLinkOptions` | — | ドキュメントリンク挿入の設定。省略すると、トリガー文字を入力してもドロップダウンは開きません。 |
| `renderDebounce` | `number \| false` | 適応型 | プレビューのデバウンス時間（ミリ秒）。`false` は編集ごとに同期描画し、数値は固定の待機時間を指定します。省略時は `adaptiveDebounceMs(value.length)` を使い、基本値は 120 ミリ秒、上限は 600 ミリ秒です。 |
| `autoPreview` | `boolean` | `true` | `true` では編集後にデバウンスを経てプレビューを再描画します。`false` では `renderNow()` またはステータスバーの更新ボタンで更新します。 |

## `EditorMode` と `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'`（既定）：ツールバー、ステータスバー、行番号を表示しません。
- `'complex'`：ツールバー、ステータスバー、行番号を有効にします。
- `'light'`（既定）と `'dark'` は構文ハイライトの配色と CSS カスタムプロパティを制御します。

いずれも `setMode(mode)` と `setTheme(theme)` で実行時に変更できます。

## `ToolbarConfig`

`ToolbarConfig` は、表示する**操作名の配列**、または**操作名と上書き設定を対応させたオブジェクト**です。

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### 配列形式（表示項目の指定）

列挙した操作だけを表示します。順序は組み込みツールバーのままで、配列は表示の絞り込みに使われ、並べ替えには使われません。

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### オブジェクト形式（項目ごとの上書き）

既定ではすべての操作を表示します。オブジェクト形式で項目を非表示にしたり、ラベルやアイコンを変更したりできます。

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold', icon: '<b>B</b>' },
    image: { show: false },
    youtube: { show: false },
  },
});
```

### `ToolbarItemOverride`

```ts
interface ToolbarItemOverride {
  show?: boolean;  // Show this item. Default: true.
  label?: string;  // Custom tooltip / aria-label.
  icon?: string;   // Custom icon as an HTML string.
}
```

有効な操作名の一覧は[機能](./features.md#toolbar-actions)を参照してください。

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| フィールド | 型 | 既定値 | 説明 |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | `@` の後に入力したテキストを受け取る検索フックです。ドロップダウンの有効化に必要です。 |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | カーソル位置に挿入し、`@query` を置き換えるテキストを返します。プレビューでバッジを表示するには `[@label](mention:id)` の形式を返してください。 |
| `minChars` | `number` | `0` | ドロップダウンを表示するために必要な検索文字列の最小長。 |
| `maxItems` | `number` | `8` | ドロップダウンに表示する項目の上限。 |

`MentionItem` は [API リファレンス](./api-reference.md)で説明しています。

## `DocLinkOptions`

```ts
interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto';
  triggerChar?: string;
  minChars?: number;
  maxItems?: number;
}
```

| フィールド | 型 | 既定値 | 説明 |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | トリガー文字の入力後に呼び出す検索フックです。ドロップダウンの有効化に必要です。 |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | 組み込みの fetch + DOMParser | このフックを上書きしてバックエンドプロキシ経由でメタデータを取得すると、ブラウザーの CORS 制限を回避できます。 |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` は `:::doc-link` カードを挿入し、メタデータがなければリンクに切り替えます。`'link'` は常に通常の Markdown リンクを、`'auto'` はメタデータがあるときにカードを挿入します。 |
| `triggerChar` | `string` | `'/'` | ドキュメント検索のドロップダウンを開く文字。 |
| `minChars` | `number` | `0` | 検索を開始するために必要な検索文字列の最小長。 |
| `maxItems` | `number` | `8` | ドロップダウンに表示する項目の上限。 |

## `RendererOptions`

`Renderer` コンストラクターと `renderMarkdown(source, options)` で使用します。

```ts
interface RendererOptions {
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  html?: boolean;
  breaks?: boolean;
  theme?: 'light' | 'dark';
}
```

| オプション | 型 | 既定値 | 説明 |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | KaTeX 数式の描画を有効にします。 |
| `mindmap` | `boolean` | `true` | Markmap マインドマップの描画を有効にします。 |
| `codeHighlight` | `boolean` | `true` | highlight.js コードブロックを有効にします。 |
| `tips` | `boolean` | `true` | 注記ブロックを有効にします。 |
| `html` | `boolean` | `false` | Markdown 内の生 HTML を許可します。既定の `false` の方が安全です。 |
| `breaks` | `boolean` | `false` | ソフト改行を `<br>` に変換します。 |
| `theme` | `'light' \| 'dark'` | — | `renderMarkdown` では HTML をテーマ付きコンテナーで囲みます。`Renderer.render` は囲みのない HTML を返すため、コンテナーのスタイルは別途設定してください。 |

タスクリストのチェックボックス、`:::doc-link` カード、@メンションのバッジは常に有効で、`RendererOptions` では無効にできません。

## 次のステップ

- [機能](./features.md) — 各オプションの実行時の動作。
- [API リファレンス](./api-reference.md) — 型の全体像。

---
sidebar_position: 1
title: "はじめに"
description: "@powerduck/md-editor は、ブラウザーに組み込める高性能な Markdown エディターです。CodeMirror 6 の編集領域と markdown-it によるライブプレビューを組み合わせ、KaTeX 数式、Markmap マインドマップ、コードのハイライト、注記ブロック、設定可能なツールバー、キーボードショートカット、画像アップロード用フック、@メンション、ドキュメントリンクの挿入に対応しています。"
---

# はじめに

`@powerduck/md-editor` は、ブラウザーに組み込める高性能な Markdown エディターです。[CodeMirror 6](https://codemirror.net) の編集領域と [markdown-it](https://github.com/markdown-it/markdown-it) によるライブプレビューを組み合わせ、KaTeX 数式、Markmap マインドマップ、コードのハイライト、注記ブロック、設定可能なツールバー、キーボードショートカット、画像アップロード用フック、@メンション、ドキュメントリンクの挿入に対応しています。

- **パッケージ名：** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **ライセンス：** MIT
- **モジュール形式：** ECMAScript モジュール（`type: "module"`）。ESM（`dist/index.mjs`）と CJS（`dist/index.cjs`）の両方のビルド、および型宣言（`dist/index.d.ts`）を提供します。

## 主な機能

以下は、実装済みのソースモジュールに対応する機能です。

- **Markdown 編集：** CodeMirror 6 を使用し、Markdown の構文ハイライトとライト・ダークのハイライトテーマに対応します。
- **KaTeX 数式：** 独立した markdown-it プラグインで、インラインの `$...$` とブロックの `$$...$$` に対応します。`$5` のような金額は、ヒューリスティックな判定で数式解析から除外します。
- **Markmap マインドマップ：** ```` ```mindmap ```` のフェンス付きブロックから描画します。markmap-lib と markmap-view は動的にインポートされるため、マインドマップがない場合に初期バンドルを増やしません。
- **コードのハイライト：** highlight.js を使用し、macOS 風の 3 色の丸を備えたヘッダー、言語ラベル、ワンクリックのコピーボタンを表示します。
- **注記ブロック：** `:::notice`、`:::info`、`:::tip`、`:::success`、`:::warning`、`:::danger` にアイコンと色分けを適用します。
- **GitHub 風プレビュー：** `github-markdown-css` を使用します。
- **充実したツールバー：** 22 の操作、画像・動画・YouTube・表の挿入ダイアログ、数式とマインドマップのテンプレート選択、すべてのショートカットを確認できるヘルプを備えています。
- **キーボードショートカット：** `Mod` は Windows/Linux では Ctrl、macOS では Cmd に対応します。
- **ツールバーの設定：** 表示する項目の配列、または項目ごとの `show`、`label`、`icon` の設定でカスタマイズできます。
- **画像アップロード用フック：** エディターに画像を貼り付けるかドロップすると、`onImageUpload` を呼び出します。
- **@メンションのドロップダウン：** `mention` オプションで設定します。選択したメンションはプレビューで装飾付きのバッジになります。
- **ドキュメントリンクの挿入：** `docLink` で設定し、通常のリンクまたは `:::doc-link` プレビューカードを挿入します。メタデータは組み込みローダーまたはカスタムフックで取得します。オリジンをまたぐリクエストにはブラウザーの CORS ルールが適用されます。
- **動画表示：** 画像構文の URL が `.mp4`、`.webm`、`.ogg` などの既知の拡張子で終わる場合、`<video controls>` 要素として描画します。
- **単独レンダラー：** `renderMarkdown(source, options)` は、エディターをマウントせずに、プレビューと同じプラグインとスタイルを使った HTML を生成します。
- **ブロック単位の差分描画：** ATX 見出しでソースを分割し、変更されたブロックだけを再描画します。変更のないブロックは、初期化済みのマインドマップ SVG を含む既存の DOM ノードを再利用します。描画結果は内容のハッシュでキャッシュします。
- **適応型デバウンス：** プレビュー描画までの待機時間は文書の長さに応じて変わり、基本値は 120 ミリ秒、上限は 600 ミリ秒です。
- **2 つの編集モード：** `simple` はツールバーなしの編集とプレビュー、`complex` はツールバーとステータスバーを備え、実行時に切り替えられます。
- **2 つのテーマ：** `light` と `dark` を、`data-theme` 属性と CSS カスタムプロパティで適用します。

## アーキテクチャの概要

ライブラリーは 2 種類のインターフェースを提供します。

1. **ネイティブ JavaScript クラス：** 主な API は、コンテナー要素を指定して作成する `MarkdownEditor` を中心に構成されます。内部には `CodeEditor`（CodeMirror のラッパー）、`Renderer`（markdown-it のラッパー）、プレビュー用の `IncrementalRenderer` があり、`complex` モードでは `Toolbar` と `StatusBar` も使用します。ダイアログ、@メンションコントローラー、ドキュメントリンクコントローラーは、必要に応じてマウントするモジュールです。

2. **React サブパスのエクスポート：** `MarkdownEditorReact` は `./react` からエクスポートされる `forwardRef` コンポーネントです。ネイティブの `MarkdownEditor` インスタンスをラップし、制御・非制御の `value` に対応して、ref 経由で命令型の `MarkdownEditorHandle` を公開します。React 用の入り口は分離されているため、React を使わないプロジェクトに `react` と `react-dom` のインストールは不要です。

描画は、マインドマップ用のプレースホルダー HTML を生成する同期の markdown-it 処理と、`Renderer.hydrate` でプレースホルダーを対話可能な SVG に変換する非同期の初期化処理に分かれます。`renderMarkdown` が返すのは同期 HTML です。マインドマップの SVG が必要な場合は `Renderer.render` を使い、HTML を DOM に挿入してから `Renderer.hydrate` を呼び出してください。差分レンダラーはプレビューコンテナーを直接操作します。

## ブラウザー対応

DOM を備えたモダンブラウザーを対象としています。CodeMirror 6、KaTeX、markmap-view はブラウザーの機能ではなく、パッケージの依存関係です。対話可能なマインドマップは `ResizeObserver` を使用します。Clipboard API が利用できる場合はそれを使用し、HTTPS 以外の環境などで `navigator.clipboard` が使えない場合は、コードブロックのコピーに `document.execCommand('copy')` を使用します。マインドマップモジュールは、グローバルの `ResizeObserver` が未定義の場合に限り空の実装を登録し、未定義によるインポートエラーを防ぎます。この実装は実際のサイズ変更を通知しません。

## ライセンス

`@powerduck/md-editor` は **MIT** ライセンスで公開されています。

## 次のステップ

- [インストール](./installation.md) — パッケージの導入とインポートパスを確認します。
- [クイックスタート](./quickstart.md) — ネイティブ JavaScript または React で最初のエディターをマウントします。
- [設定](./configuration.md) — `MarkdownEditorOptions` の全オプションを確認します。
- [機能](./features.md) — 各組み込み機能を詳しく紹介します。
- [API リファレンス](./api-reference.md) — エクスポートされるすべてのクラス、関数、型を確認します。
- [使用例](./examples.md) — 完全な実行可能コードを掲載しています。

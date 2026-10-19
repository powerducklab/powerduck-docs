---
sidebar_position: 5
title: "使用例"
description: "自動変換のスキップ、React を使わないコアの利用、テーマのカスタマイズ、描画性能の制限を紹介します。"
---

# 使用例

## 有効な OAS 3.2 ドキュメントがある場合

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## コアのみを使う（React 不要）

独自の UI や Node.js ではコアエントリーを使用します。

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## スタイルのカスタマイズ

ルート要素には `data-theme="light"` または `data-theme="dark"` が設定されます。すべての色は `.pde-oas-root` 配下の CSS 変数から解決されます。

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## パフォーマンスについて

- コード例の読み込みは、ビューポートから 600px 以内に入るまで遅延されます（IntersectionObserver）
- 構文ハイライトには LRU キャッシュを使用します（64 エントリー / 1MB）
- スクロール位置の追跡にはパッシブリスナーを使用し、rAF で実行頻度を制限します
- サンプル生成はネスト 6 階層、1,000 ノードを上限とします

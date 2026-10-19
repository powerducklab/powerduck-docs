---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/md-editor paketini npm, yarn veya pnpm ile kurun; içe aktarma yollarını, eş bağımlılıkları ve TypeScript desteğini öğrenin."
---

# Kurulum

`@powerduck/md-editor` paketini tercih ettiğiniz paket yöneticisiyle kurun.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## İçe aktarma yolları

Paket, `package.json` içinde alt yol dışa aktarımlarını açıkça tanımlar:

| İçe aktarma yolu | İçerik |
|---|---|
| `@powerduck/md-editor` | Ana giriş: `MarkdownEditor` sınıfı ve tüm bağımsız yardımcılar, türler ve işlevler. |
| `@powerduck/md-editor/react` | React alt yolu: `MarkdownEditorReact` bileşeni ile `MarkdownEditorProps` ve `MarkdownEditorHandle` türleri. |
| `@powerduck/md-editor/dist/style.css` | Derlenmiş düzenleyici stil sayfası; bir kez içe aktarılmalıdır. |
| `@powerduck/md-editor/styles/tokens.css` | Tasarım belirteçlerinin ham CSS özel özellikleri. |

Paket, iki derlemesi olan bir ECMAScript modülüdür (`"type": "module"`): `dist/index.mjs` (ESM) ve `dist/index.cjs` (CommonJS). Tür bildirimleri `dist/index.d.ts` içinde sunulur.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## Eş bağımlılıklar

`react` ve `react-dom`, **isteğe bağlı** eş bağımlılıklardır (`>=17`). Yalnızca `./react` alt yolunu içe aktarırsanız gerekir:

```bash
npm install react react-dom
```

Framework’ten bağımsız `MarkdownEditor` sınıfı ve bağımsız `renderMarkdown` işlevi React’e bağlı değildir; React kurulmadan herhangi bir tarayıcı projesinde çalışırlar.

## TypeScript desteği

Paket kendi tür bildirimlerini içerir; ek `@types/*` paketleri gerekmez. Ana giriş `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` ve tüm yardımcı türleri sunar. `./react` alt yolu `MarkdownEditorProps` ve `MarkdownEditorHandle` türlerini sunar.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS yan etkileri

`package.json` içinde `*.css` dosyaları yan etkili olarak işaretlenir; böylece paketleyiciler bunları tree-shaking sırasında kaldırmaz. Uygulamanın giriş noktasında `dist/style.css` dosyasını bir kez içe aktarın. Bu dosya düzenleyici arayüzünü, `github-markdown-css` üzerinden önizleme stillerini, KaTeX’i ve tüm eklenti stillerini içerir.

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/md-editor/quickstart/) — ilk düzenleyicinizi bağlayın.
- [Yapılandırma](/docs/tr-TR/md-editor/configuration/) — `MarkdownEditorOptions` içindeki tüm seçenekler.

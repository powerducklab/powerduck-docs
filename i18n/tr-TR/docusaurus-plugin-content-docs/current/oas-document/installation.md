---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/oas-document paketini ve eş bağımlılıklarını yükleyin."
---

# Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Eş bağımlılıklar

```bash
npm install react react-dom
```

## CSS içe aktarma

```tsx
import "@powerduck/oas-document/react/index.css";
```

Bileşen kendi stil dosyalarını (tree CSS ve md-editor CSS) içerir. Paketin giriş noktası dışında başka CSS dosyaları içe aktarmanız gerekmez.

## Giriş noktaları

| İçe aktarma yolu | Açıklama |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` bileşeni ve `useOasDocument` hook'u |
| `@powerduck/oas-document` | Çekirdek: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |

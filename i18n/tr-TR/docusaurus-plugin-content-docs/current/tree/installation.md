---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/tree paketini ve eş bağımlılıklarını yükleyin."
---

# Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## Eş bağımlılıklar

```bash
npm install react react-dom react-icons
```

## CSS içe aktarma

```tsx
import "@powerduck/tree/react/index.css";
```

## Giriş noktaları

| İçe aktarma yolu | Açıklama |
|--------|-------------|
| `@powerduck/tree` | Temel türler, yardımcı işlevler ve tüm bağdaştırıcılar |
| `@powerduck/tree/react` | React Tree bileşeni ve hook'lar |
| `@powerduck/tree/adapters` | OpenAPI, JSON Schema ve belge bağdaştırıcıları |
| `@powerduck/tree/core` | Yalnızca temel türler ve yardımcı işlevler |

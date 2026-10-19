---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/oas-document beserta dependensi peer-nya."
---

# Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Dependensi peer

```bash
npm install react react-dom
```

## Impor CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

Komponen ini menyertakan stylesheet-nya sendiri (CSS tree dan md-editor). Tidak diperlukan impor CSS tambahan selain titik masuk paket.

## Titik masuk

| Impor | Deskripsi |
|--------|-------------|
| `@powerduck/oas-document/react` | Komponen `<OasDocument />` dan hook `useOasDocument` |
| `@powerduck/oas-document` | Inti: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |

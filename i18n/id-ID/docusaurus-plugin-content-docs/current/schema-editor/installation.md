---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/schema-editor beserta dependensi peer-nya."
---

# Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Dependensi peer

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Titik masuk

| Impor | Deskripsi |
|--------|-------------|
| `@powerduck/schema-editor` | API inti: resolusi skema, diagnostik, dan pembuatan contoh |
| `@powerduck/schema-editor/react` | Komponen React `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Inti yang dapat digunakan di browser tanpa React |

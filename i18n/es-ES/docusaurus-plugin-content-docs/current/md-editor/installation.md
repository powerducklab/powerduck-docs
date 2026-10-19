---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/md-editor con npm, yarn o pnpm y conoce sus rutas de importación, dependencias de pares y tipos TypeScript."
---

# Instalación

Instala `@powerduck/md-editor` con el gestor de paquetes que prefieras.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Rutas de importación

El paquete declara exportaciones de subrutas explícitas en `package.json`:

| Ruta de importación | Contenido |
|---|---|
| `@powerduck/md-editor` | Entrada principal: la clase `MarkdownEditor` y todas las utilidades, tipos y funciones independientes. |
| `@powerduck/md-editor/react` | Subruta de React: el componente `MarkdownEditorReact` y los tipos `MarkdownEditorProps` y `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Hoja de estilos compilada del editor; impórtala una sola vez. |
| `@powerduck/md-editor/styles/tokens.css` | Propiedades CSS personalizadas de los tokens de diseño, sin compilar. |

El paquete es un módulo ECMAScript (`"type": "module"`) con dos compilaciones: `dist/index.mjs` (ESM) y `dist/index.cjs` (CommonJS). Los tipos se publican en `dist/index.d.ts`.

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

## Dependencias de pares

`react` y `react-dom` son dependencias de pares **opcionales** (`>=17`). Solo hacen falta al importar la subruta `./react`:

```bash
npm install react react-dom
```

La clase `MarkdownEditor` sin framework y la función independiente `renderMarkdown` no dependen de React y funcionan en cualquier proyecto de navegador sin instalarlo.

## Compatibilidad con TypeScript

El paquete incluye sus propias declaraciones; no necesitas paquetes `@types/*`. La entrada principal exporta `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` y todos los tipos auxiliares. La subruta `./react` exporta `MarkdownEditorProps` y `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Efectos secundarios de CSS

En `package.json`, los archivos `*.css` están marcados como efectos secundarios para que el empaquetador no los elimine. Importa `dist/style.css` una vez en la entrada de la aplicación: incluye la interfaz del editor, el estilo de la vista previa mediante `github-markdown-css`, KaTeX y los estilos de todos los plugins.

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/md-editor/quickstart/) — monta tu primer editor.
- [Configuración](/docs/es-ES/md-editor/configuration/) — todas las opciones de `MarkdownEditorOptions`.

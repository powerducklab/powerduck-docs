---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/md-editor mit npm, yarn oder pnpm und lerne Importpfade, Peer-Abhängigkeiten und TypeScript-Typen kennen."
---

# Installation

Installiere `@powerduck/md-editor` mit dem Paketmanager deiner Wahl.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Importpfade

Das Paket definiert seine Unterpfad-Exporte ausdrücklich in `package.json`:

| Importpfad | Inhalt |
|---|---|
| `@powerduck/md-editor` | Haupteinstieg: die Klasse `MarkdownEditor` sowie alle eigenständigen Hilfsfunktionen, Typen und Funktionen. |
| `@powerduck/md-editor/react` | React-Unterpfad: die Komponente `MarkdownEditorReact` sowie `MarkdownEditorProps` und `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Kompiliertes Editor-Stylesheet; muss einmal importiert werden. |
| `@powerduck/md-editor/styles/tokens.css` | Unkompilierte CSS-Custom-Properties für Design-Tokens. |

Das Paket ist ein ECMAScript-Modul (`"type": "module"`) mit zwei Builds: `dist/index.mjs` (ESM) und `dist/index.cjs` (CommonJS). Typdeklarationen liegen in `dist/index.d.ts`.

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

## Peer-Abhängigkeiten

`react` und `react-dom` sind **optionale** Peer-Abhängigkeiten (`>=17`). Du brauchst sie nur beim Import des Unterpfads `./react`:

```bash
npm install react react-dom
```

Die frameworkunabhängige Klasse `MarkdownEditor` und die eigenständige Funktion `renderMarkdown` hängen nicht von React ab. Sie funktionieren in jedem Browserprojekt ohne React-Installation.

## TypeScript-Unterstützung

Das Paket enthält eigene Typdeklarationen; zusätzliche `@types/*`-Pakete sind nicht nötig. Der Haupteinstieg exportiert `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` und alle Hilfstypen. Der Unterpfad `./react` exportiert `MarkdownEditorProps` und `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS als Seiteneffekt

In `package.json` sind `*.css`-Dateien als Seiteneffekte markiert, damit Bundler sie beim Tree-Shaking nicht entfernen. Importiere `dist/style.css` einmal im Anwendungseinstieg. Darin sind die Editor-Oberfläche, die Vorschau über `github-markdown-css`, KaTeX und sämtliche Plugin-Stile enthalten.

## Nächste Schritte

- [Schnellstart](/docs/de-DE/md-editor/quickstart/) — binde deinen ersten Editor ein.
- [Konfiguration](/docs/de-DE/md-editor/configuration/) — alle Optionen von `MarkdownEditorOptions`.

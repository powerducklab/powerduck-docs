---
sidebar_position: 1
title: "Introduction"
description: "What @powerduck/md-editor is, its version, core capabilities, architecture, browser support, and MIT license."
keywords: ["markdown editor", "introduction", "powerduck", "overview", "features"]
---

# Introduction

`@powerduck/md-editor` is a high-performance, embeddable Markdown editor for the browser. It pairs a [CodeMirror 6](https://codemirror.net) editing surface with a live Markdown preview rendered through [markdown-it](https://github.com/markdown-it/markdown-it), and adds rich authoring features on top: KaTeX math, Markmap mindmaps, highlighted code blocks, admonition callouts, a configurable toolbar, keyboard shortcuts, image upload hooks, @mentions, and document-link inserters.

- **Package name:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **License:** MIT
- **Module format:** ECMAScript module (`type: "module"`), with dual ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) builds and bundled type declarations (`dist/index.d.ts`).

## Core features

The feature set below is derived directly from the implemented source modules:

- **Markdown editing** powered by CodeMirror 6, with Markdown syntax highlighting and light/dark highlight themes.
- **KaTeX math** via a self-contained markdown-it plugin: inline `$...$` and block `$$...$$`. Currency values such as `$5` are heuristically excluded from math parsing.
- **Markmap mindmaps** rendered from ```` ```mindmap ```` fenced blocks. markmap-lib and markmap-view are dynamically imported so they do not increase the initial bundle size when no mindmaps are present.
- **Code highlighting** via highlight.js with a macOS-style traffic-light header, language label, and a one-click copy button.
- **Admonition / callout blocks** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) with icons and colored styling.
- **GitHub-style preview** using `github-markdown-css`.
- **Rich toolbar** with 22 actions, popup dialogs for image/video/YouTube/table insertion, template pickers for math and mindmaps, and a help dialog listing all shortcuts.
- **Keyboard shortcuts** with a `Mod` key that maps to Ctrl on Windows/Linux and Cmd on macOS.
- **Configurable toolbar** via an include-list array or a per-item override record (`show`, `label`, `icon`).
- **Image upload hook** (`onImageUpload`) triggered on paste, drop, or file selection.
- **@mention dropdown** configured through `mention` options; selected mentions render as styled badges in the preview.
- **Document-link inserter** configured through `docLink` options; inserts plain links or `:::doc-link` preview cards with auto-fetched metadata.
- **Video rendering**: image syntax whose URL ends in `.mp4`, `.webm`, `.ogg`, and other known extensions renders as a `<video controls>` element.
- **Standalone renderer** (`renderMarkdown(source, options)`) that produces HTML with the same plugins and styling as the editor preview, without mounting an editor.
- **Block-level incremental rendering**: the source is split into blocks at ATX headings, and only changed blocks are re-rendered. Unchanged blocks reuse their existing DOM nodes (including already-hydrated mindmap SVGs), and render results are cached by content hash.
- **Adaptive debounce**: the preview render delay scales with document length (120 ms base, up to 600 ms).
- **Two editing modes**: `simple` (pure edit + preview, no toolbar) and `complex` (toolbar + status bar), switchable at runtime.
- **Two themes**: `light` and `dark`, applied via a `data-theme` attribute and CSS custom properties.

## Architecture overview

The library is distributed in two flavors:

1. **Vanilla JavaScript class** — the default export surface centers on the `MarkdownEditor` class, constructed against a container element. It composes a `CodeEditor` (CodeMirror wrapper), a `Renderer` (markdown-it wrapper), an `IncrementalRenderer` for the preview, and, in `complex` mode, a `Toolbar` and `StatusBar`. Popup dialogs, the @mention controller, and the document-link controller are pluggable units mounted on demand.

2. **React subpath export** — `MarkdownEditorReact` is a `forwardRef` component exported from the `./react` subpath. It wraps the vanilla `MarkdownEditor` instance, supports controlled and uncontrolled `value` usage, and exposes an imperative `MarkdownEditorHandle` via ref. The React subpath exists separately so that non-React consumers are not forced to install `react` and `react-dom`.

Rendering is split into a synchronous markdown-it pass (which produces placeholder HTML for mindmaps) and an asynchronous hydration step (`Renderer.hydrate`) that turns mindmap placeholders into live SVG diagrams. The incremental renderer operates on the preview container directly.

## Browser support

The library runs in modern evergreen browsers that ship CodeMirror 6, KaTeX, markmap-view (which requires `ResizeObserver`), and the Clipboard API. A `document.execCommand('copy')` fallback is used for code-block copying when `navigator.clipboard` is unavailable (for example, non-HTTPS contexts). The mindmap module installs a no-op `ResizeObserver` shim only when the global is undefined, so it never throws during import in restricted DOM environments.

## License

`@powerduck/md-editor` is released under the **MIT** license.

## Next steps

- [Installation](./installation.md) — install the package and know the import paths.
- [Quick start](./quickstart.md) — mount your first editor in vanilla JS or React.
- [Configuration](./configuration.md) — every option on `MarkdownEditorOptions`.
- [Features](./features.md) — deep dives into each built-in feature.
- [API reference](./api-reference.md) — every exported class, function, and type.
- [Examples](./examples.md) — complete, runnable snippets.

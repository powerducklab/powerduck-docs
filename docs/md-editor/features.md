---
sidebar_position: 5
title: "Features"
description: "Deep dive into incremental rendering, KaTeX math, Markmap mindmaps, code highlighting, the 22 toolbar actions, keyboard shortcuts, image upload, mentions, doc links, and callouts."
keywords: ["features", "incremental rendering", "katex", "markmap", "toolbar", "shortcuts", "mention", "doclink"]
---

# Features

This page documents each built-in feature as it is actually implemented in the source.

## Incremental rendering

The preview uses block-level incremental rendering to stay responsive on large documents:

- **Block splitting** (`splitIntoBlocks`): the source is split into blocks at ATX heading lines (`#` through `######`). Content inside code fences (```` ` or `~~~`) is never treated as a split point, and headings inside `:::` custom containers are also preserved. Documents with no headings degrade to a single block.
- **Per-block rendering**: only blocks whose content hash changed are re-run through markdown-it / KaTeX. Unchanged blocks reuse their existing DOM nodes directly, including already-hydrated mindmap SVGs.
- **Content-hash cache**: render results are cached by content hash (a fast djb2-style hash plus length), so undo/redo and copy-paste of identical paragraphs also hit the cache. The cache is capped at 800 entries and evicts hashes no longer present in the document.
- **Reordering**: reordered blocks are moved natively by appending existing nodes to a `DocumentFragment`.
- **Adaptive debounce** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): the pause before a render is `base + floor(docLength / 20000) * 60`, capped at `max`. Override with `renderDebounce`, or set `renderDebounce: false` to render synchronously.
- **`content-visibility: auto`**: each block is wrapped in a `.md-editor-block` element so off-screen blocks skip layout and paint.

A single block failing to render never blanks the whole preview; it falls back to an escaped `<pre>` of that block's source.

## KaTeX math

The self-contained markdown-it math plugin renders math with KaTeX (no `markdown-it-texmath` dependency):

- **Inline math**: `$E=mc^2$` — content must not contain `$`, newline, or be empty. Currency-like content such as `$5` or `$10.50` is heuristically excluded.
- **Block math**:
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Single-line (`$$ ... $$`) and multi-line forms are both supported. KaTeX CSS is bundled with the package. Disable with `math: false`.

## Markmap mindmaps

Write a ```` ```mindmap ```` fenced block whose body is a markdown outline:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

The block rule tracks fence nesting depth, so nested code fences inside a mindmap are preserved. The synchronous render pass emits a placeholder `<div>`; `Renderer.hydrate(container)` asynchronously imports `markmap-lib` and `markmap-view` and turns each placeholder into an interactive SVG. Hydration failures are non-fatal. Disable with `mindmap: false`.

## Code highlighting with copy button

Fenced code blocks are highlighted with highlight.js. The build registers a fixed set of languages: JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C, and C++ (with common aliases such as `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs`, `c++`). Unknown languages are auto-detected; detection failures fall back to escaped plain text.

Each highlighted block is wrapped in a macOS-style container with traffic-light dots, a language label, and a **Copy** button. The copy button uses event delegation on the preview pane and falls back to `document.execCommand('copy')` when the Clipboard API is unavailable. Disable with `codeHighlight: false`.

## Toolbar actions

In `complex` mode, the toolbar is built from the 22 actions below, in this default order:

| # | Action name | Default label |
|---|-------------|---------------|
| 1 | `heading` | Heading |
| 2 | `bold` | Bold (Ctrl+B) |
| 3 | `italic` | Italic (Ctrl+I) |
| 4 | `link` | Link (Ctrl+K) |
| 5 | `image` | Insert image |
| 6 | `video` | Insert video |
| 7 | `youtube` | Insert YouTube video |
| 8 | `quote` | Quote |
| 9 | `ul` | Unordered list |
| 10 | `ol` | Ordered list |
| 11 | `tasklist` | Task list |
| 12 | `mention` | Mention (@) |
| 13 | `doclink` | Insert document link |
| 14 | `code` | Code block |
| 15 | `table` | Table |
| 16 | `math` | Math formula |
| 17 | `mindmap` | Insert mindmap |
| 18 | `hr` | Horizontal rule |
| 19 | `tips` | Insert callout |
| 20 | `preview` | Toggle preview |
| 21 | `help` | Keyboard shortcuts |
| 22 | `theme` | Toggle theme |

Several actions open popup dialogs or template pickers: image, video, YouTube, table, math (templates), mindmap (templates), callout (type grid), and help. Configure the toolbar with the `toolbar` option as described in [Configuration](./configuration.md#toolbarconfig).

## Keyboard shortcuts

The built-in shortcuts are defined in `DEFAULT_SHORTCUTS`. `Mod` maps to Ctrl on Windows/Linux and Cmd on macOS.

| Key | Action | Description |
|-----|--------|-------------|
| `Mod-b` | `bold` | Bold |
| `Mod-i` | `italic` | Italic |
| `Mod-Alt-1` | `heading` | Heading |
| `Mod-k` | `link` | Insert link |
| `Mod-Alt-c` | `code` | Code block |
| `Mod-Shift-.` | `quote` | Blockquote |
| `Mod-Shift-8` | `ul` | Unordered list |
| `Mod-Shift-7` | `ol` | Ordered list |
| `Mod-Shift-9` | `tasklist` | Task list |
| `Mod-Alt-m` | `math` | Math formula |
| `Mod-Alt-p` | `preview` | Toggle preview |
| `Mod-Shift-l` | `theme` | Toggle theme |

The toolbar **Help** button opens a dialog that lists these shortcuts with styled key caps, plus a quick-reference section for task lists, mentions, doc links, math, mindmaps, and callouts.

## Image upload

Provide `onImageUpload: (file: File) => Promise<string>`. The hook is called when an image file is pasted, dropped onto the editor, or selected through the image popup. Resolve to the public image URL; the editor inserts `![alt](url)` at the cursor (using the file name, minus extension, as the alt text). Upload failures are swallowed silently so the user can retry.

## @mention

Pass a `mention` option to enable a searchable dropdown when the user types `@`:

- `onMentionSearch(query)` returns matching `MentionItem`s.
- `onMentionSelect(item)` returns the inserted text. The default is `[@label](mention:id)`, which the renderer turns into a styled badge.
- `minChars` (default `0`) and `maxItems` (default `8`) tune the dropdown.

The dropdown supports ArrowUp/ArrowDown, Enter/Tab, and Escape navigation, and closes on editor blur. Typing `@` in prose (such as `@media`) never triggers the dropdown because real mentions use the `mention:` link scheme.

## Document links

Pass a `docLink` option to enable a document search dropdown after the trigger character (default `/`):

- `onDocSearch(query)` returns matching `DocItem`s.
- `onFetchDocMeta(url)` fetches title, thumbnail, and description. The built-in implementation uses `fetch` + `DOMParser` to read Open Graph tags, but will fail on cross-origin URLs due to CORS — override it with a backend proxy in production.
- `insertStyle` controls insertion: `'auto'` (card when metadata is available), `'card'`, or `'link'`.

A selected document is inserted as either a plain link or a `:::doc-link` card that renders title, thumbnail, description, and hostname as a clickable preview card.

## Admonition / callout blocks

Write a `:::` container with one of six types. An optional title may follow the type on the opening line:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Supported types: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Each renders with an icon, a colored left border, and a header. The toolbar callout button opens a visual picker for all six types. Disable with `tips: false`.

## Task lists

List items matching `- [ ]` or `- [x]` (with arbitrary whitespace inside the brackets) render as disabled checkboxes. Note the project convention: **`- [ ]` renders as checked (green) and `- [x]` renders as unchecked** — the inverse of GitHub Flavored Markdown. The toolbar task-list button toggles markers on the current line or selected lines.

## Next steps

- [Configuration](./configuration.md) — tune these features through options.
- [API reference](./api-reference.md) — programmatically drive the editor.

---
sidebar_position: 4
title: "Configuration"
description: "Every field on MarkdownEditorOptions, plus ToolbarConfig, ToolbarItemOverride, MentionOptions, DocLinkOptions, RendererOptions, EditorMode, and EditorTheme."
keywords: ["configuration", "options", "toolbar", "mention", "doclink", "renderer", "theme"]
---

# Configuration

The `MarkdownEditor` constructor accepts a single `MarkdownEditorOptions` object. This page documents every field with its type, default, and behavior, plus the related option types.

## `MarkdownEditorOptions`

```ts
interface MarkdownEditorOptions {
  value?: string;
  mode?: EditorMode;
  theme?: EditorTheme;
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  preview?: boolean;
  onChange?: (value: string) => void;
  toolbar?: ToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
  mention?: MentionOptions;
  docLink?: DocLinkOptions;
  renderDebounce?: number | false;
  autoPreview?: boolean;
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Initial Markdown content. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` renders a pure edit + preview surface with no toolbar or status bar. `'complex'` adds the toolbar and status bar. |
| `theme` | `EditorTheme` | `'light'` | Color theme applied via the `data-theme` attribute: `'light'` or `'dark'`. |
| `math` | `boolean` | `true` | Enable KaTeX math rendering (`$...$` inline, `$$...$$` block). |
| `mindmap` | `boolean` | `true` | Enable Markmap mindmaps from ```` ```mindmap ```` fenced blocks. |
| `codeHighlight` | `boolean` | `true` | Enable highlight.js code blocks with the traffic-light header and copy button. |
| `tips` | `boolean` | `true` | Enable admonition/callout blocks (`:::notice`, `:::warning`, etc.). |
| `preview` | `boolean` | `true` | Show the preview pane. When `false`, only the editor pane is built. |
| `onChange` | `(value: string) => void` | — | Called with the full document string on every edit. |
| `toolbar` | `ToolbarConfig` | all actions | Configure which toolbar actions appear and override their labels/icons. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Hook invoked when an image file is pasted, dropped, or selected. Resolve to the image URL, which is inserted as `![alt](url)`. |
| `mention` | `MentionOptions` | — | @mention dropdown configuration. When omitted, typing `@` does not open a dropdown. |
| `docLink` | `DocLinkOptions` | — | Document-link inserter configuration. When omitted, typing the trigger character does not open a dropdown. |
| `renderDebounce` | `number \| false` | adaptive | Preview debounce in milliseconds. `false` renders synchronously on every edit; a number sets a fixed delay; when omitted, `adaptiveDebounceMs(value.length)` is used (120 ms base, up to 600 ms). |
| `autoPreview` | `boolean` | `true` | When `true`, the preview re-renders after edits (debounced). When `false`, call `renderNow()` or use the status-bar refresh button to update. |

## `EditorMode` and `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (default): no toolbar, no status bar, no line numbers.
- `'complex'`: toolbar, status bar, and line numbers are enabled.
- `'light'` (default) and `'dark'` control the syntax-highlight palette and CSS custom properties.

Both can be changed at runtime with `setMode(mode)` and `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` is either an **array of action names** (an include-list) or a **record of action name to override**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Array form (include-list)

Only the listed actions are shown, in the order you provide them:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Record form (per-item override)

Every action defaults to visible. Use the record form to hide items, relabel them, or swap their icons:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold', icon: '<b>B</b>' },
    image: { show: false },
    youtube: { show: false },
  },
});
```

### `ToolbarItemOverride`

```ts
interface ToolbarItemOverride {
  show?: boolean;  // Show this item. Default: true.
  label?: string;  // Custom tooltip / aria-label.
  icon?: string;   // Custom icon as an HTML string.
}
```

The full list of valid action names is documented in [Features](./features#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Search hook called with the text typed after `@`. Required to enable the dropdown. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Returns the text inserted at the cursor, replacing `@query`. Return the `[@label](mention:id)` wrapper so the preview renders a badge. |
| `minChars` | `number` | `0` | Minimum query length before the dropdown appears. |
| `maxItems` | `number` | `8` | Maximum items shown in the dropdown. |

`MentionItem` itself is documented in the [API reference](./api-reference).

## `DocLinkOptions`

```ts
interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto';
  triggerChar?: string;
  minChars?: number;
  maxItems?: number;
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Search hook called after the trigger character. Required to enable the dropdown. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | built-in fetch + DOMParser | Override to route metadata fetching through a backend proxy and avoid CORS. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` always inserts a `:::doc-link` card (falls back to a link without metadata); `'link'` always inserts a plain markdown link; `'auto'` inserts a card when metadata is available. |
| `triggerChar` | `string` | `'/'` | Character that opens the document search dropdown. |
| `minChars` | `number` | `0` | Minimum query length before searching. |
| `maxItems` | `number` | `8` | Maximum items shown in the dropdown. |

## `RendererOptions`

Used both by the `Renderer` constructor and by `renderMarkdown(source, options)`.

```ts
interface RendererOptions {
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  html?: boolean;
  breaks?: boolean;
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Enable KaTeX math rendering. |
| `mindmap` | `boolean` | `true` | Enable Markmap mindmap rendering. |
| `codeHighlight` | `boolean` | `true` | Enable highlight.js code blocks. |
| `tips` | `boolean` | `true` | Enable admonition/tip blocks. |
| `html` | `boolean` | `false` | Allow raw HTML in the markdown source. `false` is the safer default. |
| `breaks` | `boolean` | `false` | Convert soft line breaks to `<br>`. |

Task-list checkboxes, `:::doc-link` cards, and @mention badges are always enabled and are not toggleable via `RendererOptions`.

## Next steps

- [Features](./features) — how each option manifests at runtime.
- [API reference](./api-reference) — the full type surface.

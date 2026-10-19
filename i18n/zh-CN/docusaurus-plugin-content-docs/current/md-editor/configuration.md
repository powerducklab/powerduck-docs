---
sidebar_position: 4
title: "配置"
description: "MarkdownEditor 构造函数先接收容器元素或选择器，再接收 MarkdownEditorOptions 对象。本页说明各字段的类型、默认值、行为及相关选项类型。"
---

# 配置

`MarkdownEditor` 构造函数先接收容器元素或选择器，再接收 `MarkdownEditorOptions` 对象。本页说明各字段的类型、默认值、行为及相关选项类型。

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

| 选项 | 类型 | 默认值 | 说明 |
|--------|------|---------|-------------|
| `value` | `string` | `''` | 初始 Markdown 内容。 |
| `mode` | `EditorMode` | `'simple'` | `'simple'` 仅显示编辑区和预览，不含工具栏或状态栏；`'complex'` 会添加工具栏和状态栏。 |
| `theme` | `EditorTheme` | `'light'` | 通过 `data-theme` 属性应用配色主题：`'light'` 或 `'dark'`。 |
| `math` | `boolean` | `true` | 启用 KaTeX 公式渲染：行内 `$...$`，块级 `$$...$$`。 |
| `mindmap` | `boolean` | `true` | 启用 ```` ```mindmap ```` 围栏代码块的 Markmap 思维导图。 |
| `codeHighlight` | `boolean` | `true` | 启用 highlight.js 代码块，包含三色圆点标题栏和复制按钮。 |
| `tips` | `boolean` | `true` | 启用提示块，如 `:::notice`、`:::warning` 等。 |
| `preview` | `boolean` | `true` | 显示预览面板。为 `false` 时仅创建编辑面板。 |
| `onChange` | `(value: string) => void` | — | 每次编辑时调用，参数为完整文档字符串。 |
| `toolbar` | `ToolbarConfig` | 全部操作 | 设置工具栏显示哪些操作，并覆盖其标签或图标。 |
| `onImageUpload` | `(file: File) => Promise<string>` | — | 将图片文件粘贴或拖放到编辑器时调用此钩子。返回的 Promise 应解析为图片 URL，并以 `![alt](url)` 插入。图片弹窗接受 URL，不提供文件选择器。 |
| `mention` | `MentionOptions` | — | @提及下拉列表的配置。省略时，输入 `@` 不会打开下拉列表。 |
| `docLink` | `DocLinkOptions` | — | 文档链接插入器的配置。省略时，输入触发字符不会打开下拉列表。 |
| `renderDebounce` | `number \| false` | 自适应 | 预览防抖延迟，单位为毫秒。`false` 表示每次编辑后同步渲染；数字指定固定延迟；省略时使用 `adaptiveDebounceMs(value.length)`，基础值为 120 毫秒，上限为 600 毫秒。 |
| `autoPreview` | `boolean` | `true` | 为 `true` 时，编辑后经过防抖重新渲染预览；为 `false` 时，需调用 `renderNow()` 或使用状态栏刷新按钮更新。 |

## `EditorMode` 与 `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'`（默认）：不显示工具栏、状态栏和行号。
- `'complex'`：启用工具栏、状态栏和行号。
- `'light'`（默认）与 `'dark'` 控制语法高亮配色及 CSS 自定义属性。

两者均可在运行时通过 `setMode(mode)` 和 `setTheme(theme)` 修改。

## `ToolbarConfig`

`ToolbarConfig` 可以是**操作名称数组**（指定显示项），也可以是**操作名称到覆盖配置的映射**：

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### 数组形式（指定显示项）

仅显示列出的操作，但仍按内置工具栏顺序排列；数组用于筛选可见项，不用于排序：

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### 对象形式（逐项覆盖）

默认显示所有操作。使用对象形式可以隐藏项目、更改标签或替换图标：

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

完整的有效操作名称见[功能](./features.md#toolbar-actions)。

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| 字段 | 类型 | 默认值 | 说明 |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | 搜索钩子，接收 `@` 后输入的文本。必须提供此钩子才能启用下拉列表。 |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | 返回在光标处插入的文本，用于替换 `@query`。返回 `[@label](mention:id)` 格式，预览才能将其渲染为标签。 |
| `minChars` | `number` | `0` | 显示下拉列表所需的最短查询长度。 |
| `maxItems` | `number` | `8` | 下拉列表最多显示的项目数。 |

`MentionItem` 的说明见 [API 参考](./api-reference.md)。

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

| 字段 | 类型 | 默认值 | 说明 |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | 在输入触发字符后调用的搜索钩子。必须提供此钩子才能启用下拉列表。 |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | 内置 fetch + DOMParser | 覆盖此钩子，通过后端代理获取元数据，以避免浏览器 CORS 限制。 |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` 插入 `:::doc-link` 卡片，没有元数据时回退为链接；`'link'` 始终插入普通 Markdown 链接；`'auto'` 在有元数据时插入卡片。 |
| `triggerChar` | `string` | `'/'` | 打开文档搜索下拉列表的字符。 |
| `minChars` | `number` | `0` | 开始搜索所需的最短查询长度。 |
| `maxItems` | `number` | `8` | 下拉列表最多显示的项目数。 |

## `RendererOptions`

供 `Renderer` 构造函数和 `renderMarkdown(source, options)` 使用。

```ts
interface RendererOptions {
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  html?: boolean;
  breaks?: boolean;
  theme?: 'light' | 'dark';
}
```

| 选项 | 类型 | 默认值 | 说明 |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | 启用 KaTeX 公式渲染。 |
| `mindmap` | `boolean` | `true` | 启用 Markmap 思维导图渲染。 |
| `codeHighlight` | `boolean` | `true` | 启用 highlight.js 代码块。 |
| `tips` | `boolean` | `true` | 启用提示块。 |
| `html` | `boolean` | `false` | 允许 Markdown 源内容中的原始 HTML。默认的 `false` 更安全。 |
| `breaks` | `boolean` | `false` | 将软换行转换为 `<br>`。 |
| `theme` | `'light' \| 'dark'` | — | 使用 `renderMarkdown` 时，在 HTML 外包裹带主题的容器。`Renderer.render` 返回未包裹的 HTML，需自行为容器设置样式。 |

任务列表复选框、`:::doc-link` 卡片和 @提及标签始终启用，无法通过 `RendererOptions` 关闭。

## 后续阅读

- [功能](./features.md) — 各选项在运行时的表现。
- [API 参考](./api-reference.md) — 完整类型定义。

---
sidebar_position: 5
title: "功能"
description: "本页根据实际源码说明各项内置功能。"
---

# 功能

本页根据实际源码说明各项内置功能。

## 增量渲染

预览采用块级增量渲染，让较长文档的编辑保持响应：

- **分块**（`splitIntoBlocks`）：按 ATX 标题行（`#` 到 `######`）拆分源内容。反引号或波浪号代码围栏内的内容不会成为分割点，`:::` 自定义容器内的标题也会保留在原块中。没有标题的文档作为单个块处理。
- **逐块渲染：** 仅内容哈希发生变化的块重新经过 markdown-it / KaTeX 处理。未变更的块直接复用已有 DOM 节点，包括已初始化的思维导图 SVG。
- **内容哈希缓存：** 渲染结果按内容哈希缓存，哈希由快速的 djb2 风格算法与长度组合而成，因此撤销、重做及复制相同段落也能命中缓存。超过 800 项时，清理已不在当前文档中的哈希；当前块的缓存仍保留，所以超过 800 个不同块的文档可能突破这一阈值。
- **重新排序：** 将已有节点追加到 `DocumentFragment`，由浏览器原生移动节点。
- **自适应防抖**（`adaptiveDebounceMs(docLength, base = 120, max = 600)`）：渲染前的等待时间为 `base + floor(docLength / 20000) * 60`，最大为 `max`。可用 `renderDebounce` 覆盖，或设置 `renderDebounce: false` 同步渲染。
- **`content-visibility: auto`：** 每个块包裹在 `.md-editor-block` 元素中，使屏幕外的块可跳过布局和绘制。

单个块渲染失败不会清空整个预览，而是回退为经过转义的 `<pre>`，显示该块的源内容。

## KaTeX 公式

独立的 markdown-it 数学插件使用 KaTeX 渲染公式，不依赖 `markdown-it-texmath`：

- **行内公式：** `$E=mc^2$`。内容不能为空，也不能包含 `$` 或换行。`$5`、`$10.50` 等类似金额的内容通过启发式规则排除。
- **块级公式：**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  同时支持单行（`$$ ... $$`）和多行形式。包内已包含 KaTeX CSS。设置 `math: false` 可关闭。

## Markmap 思维导图

编写 ```` ```mindmap ```` 围栏代码块，块内使用 Markdown 大纲：

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

块解析规则会跟踪围栏的嵌套深度，保留思维导图内嵌套的代码围栏。同步渲染先输出占位 `<div>`；`Renderer.hydrate(container)` 异步导入 `markmap-lib` 和 `markmap-view`，将各占位元素转成可交互 SVG。初始化失败不会中断其他内容。设置 `mindmap: false` 可关闭。

## 代码高亮与复制按钮

围栏代码块使用 highlight.js 高亮。构建注册的语言包括 JavaScript、TypeScript、Python、JSON、Bash/Shell、CSS、XML/HTML/SVG、SQL、YAML、Markdown、Go、Rust、Java、C 和 C++，以及 `js`、`ts`、`py`、`sh`、`yml`、`md`、`rs`、`c++` 等常用别名。未知语言尝试自动检测；检测失败则回退为转义后的纯文本。

每个高亮块都带有 macOS 风格的容器、三色圆点、语言标签和**复制**按钮。复制按钮使用预览面板上的事件委托；Clipboard API 不可用时回退到 `document.execCommand('copy')`。设置 `codeHighlight: false` 可关闭。

## 工具栏操作 {#toolbar-actions}

在 `complex` 模式下，工具栏按以下默认顺序提供 22 种操作：

| # | 操作名称 | 用途 |
|---|-------------|---------------|
| 1 | `heading` | 标题 |
| 2 | `bold` | 加粗（Ctrl+B） |
| 3 | `italic` | 斜体（Ctrl+I） |
| 4 | `link` | 链接（Ctrl+K） |
| 5 | `image` | 插入图片 |
| 6 | `video` | 插入视频 |
| 7 | `youtube` | 插入 YouTube 视频 |
| 8 | `quote` | 引用 |
| 9 | `ul` | 无序列表 |
| 10 | `ol` | 有序列表 |
| 11 | `tasklist` | 任务列表 |
| 12 | `mention` | 提及（@） |
| 13 | `doclink` | 插入文档链接 |
| 14 | `code` | 代码块 |
| 15 | `table` | 表格 |
| 16 | `math` | 数学公式 |
| 17 | `mindmap` | 插入思维导图 |
| 18 | `hr` | 水平分隔线 |
| 19 | `tips` | 插入提示块 |
| 20 | `preview` | 切换预览 |
| 21 | `help` | 键盘快捷键 |
| 22 | `theme` | 切换主题 |

内置标签为英文，可逐项覆盖 `label` 来本地化工具提示和无障碍名称。图片、视频、YouTube、表格、公式模板、思维导图模板、提示类型选择和帮助操作会打开弹窗或选择器。通过 `toolbar` 选项配置工具栏，详见[配置](./configuration.md#toolbarconfig)。

## 键盘快捷键

内置快捷键定义在 `DEFAULT_SHORTCUTS` 中。`Mod` 在 Windows/Linux 上对应 Ctrl，在 macOS 上对应 Cmd。

| 按键 | 操作 | 说明 |
|-----|--------|-------------|
| `Mod-b` | `bold` | 加粗 |
| `Mod-i` | `italic` | 斜体 |
| `Mod-Alt-1` | `heading` | 标题 |
| `Mod-k` | `link` | 插入链接 |
| `Mod-Alt-c` | `code` | 代码块 |
| `Mod-Shift-.` | `quote` | 块引用 |
| `Mod-Shift-8` | `ul` | 无序列表 |
| `Mod-Shift-7` | `ol` | 有序列表 |
| `Mod-Shift-9` | `tasklist` | 任务列表 |
| `Mod-Alt-m` | `math` | 数学公式 |
| `Mod-Alt-p` | `preview` | 切换预览 |
| `Mod-Shift-l` | `theme` | 切换主题 |

工具栏的**帮助**按钮会打开对话框，以键帽样式显示快捷键，并提供任务列表、提及、文档链接、公式、思维导图和提示块的语法速查。

## 图片上传

提供 `onImageUpload: (file: File) => Promise<string>`。向编辑器粘贴或拖放图片文件时会调用此钩子；图片弹窗接受 URL，不提供文件选择功能。返回可访问的图片 URL 后，编辑器会在光标处插入 `![alt](url)`，替代文本使用去掉扩展名的文件名。上传失败会被静默捕获，用户可重试。

## @提及

通过 `mention` 配置，在输入 `@` 时启用可搜索的下拉列表：

- `onMentionSearch(query)` 返回匹配的 `MentionItem`。
- `onMentionSelect(item)` 返回插入文本，默认格式为 `[@label](mention:id)`，预览会将其渲染为带样式的标签。
- `minChars`（默认 `0`）和 `maxItems`（默认 `8`）用于调整下拉列表。

下拉列表支持上下方向键、Enter/Tab 和 Escape，并在编辑器失焦时关闭。预览中的普通 `@` 文本（例如 `@media`）不会显示为标签，只有使用 `mention:` 协议的链接才会。在编辑器中，如果配置了搜索钩子，这类文本仍可能触发搜索。

## 文档链接

通过 `docLink` 配置，在触发字符（默认 `/`）后启用文档搜索下拉列表：

- `onDocSearch(query)` 返回匹配的 `DocItem`。
- `onFetchDocMeta(url)` 获取标题、缩略图和描述。内置实现用 `fetch` 和 `DOMParser` 读取 Open Graph 标签；跨域服务器未允许 CORS 时可能失败。需要时可通过自定义后端代理获取。
- `insertStyle` 控制插入方式：`'auto'` 在有元数据时使用卡片，也可选择 `'card'` 或 `'link'`。

选中的文档会插入为普通链接或 `:::doc-link` 卡片；卡片包含可点击的标题、缩略图、描述和主机名。

## 提示块

编写 `:::` 容器并指定六种类型之一。起始行的类型后可以添加标题：

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

支持 `notice`、`info`、`tip`、`success`、`warning` 和 `danger`。每种类型都带有图标、彩色左边框和标题栏。工具栏中的提示按钮会打开六种类型的可视化选择器。设置 `tips: false` 可关闭。

## 任务列表

匹配 `- [ ]` 或 `- [x]` 的列表项会显示为禁用的复选框，方括号内允许任意空白。注意本项目的约定：**`- [ ]` 显示为选中（绿色），`- [x]` 显示为未选中**，与 GitHub Flavored Markdown 相反。工具栏的任务列表按钮可切换当前行或选中行的标记。

## 后续阅读

- [配置](./configuration.md) — 通过选项调整这些功能。
- [API 参考](./api-reference.md) — 以编程方式控制编辑器。

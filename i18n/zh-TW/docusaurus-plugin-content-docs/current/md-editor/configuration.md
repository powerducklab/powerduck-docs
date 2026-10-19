---
sidebar_position: 4
title: "設定"
description: "MarkdownEditor 建構函式先接收容器元素或選取器，再接收 MarkdownEditorOptions 物件。本頁說明各欄位的型別、預設值、行為及相關選項型別。"
---

# 設定

`MarkdownEditor` 建構函式先接收容器元素或選取器，再接收 `MarkdownEditorOptions` 物件。本頁說明各欄位的型別、預設值、行為及相關選項型別。

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

| 選項 | 型別 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `value` | `string` | `''` | 初始 Markdown 內容。 |
| `mode` | `EditorMode` | `'simple'` | `'simple'` 僅顯示編輯區與預覽，不含工具列或狀態列；`'complex'` 會加入工具列與狀態列。 |
| `theme` | `EditorTheme` | `'light'` | 透過 `data-theme` 屬性套用配色主題：`'light'` 或 `'dark'`。 |
| `math` | `boolean` | `true` | 啟用 KaTeX 公式算繪：行內 `$...$`、區塊 `$$...$$`。 |
| `mindmap` | `boolean` | `true` | 啟用 ```` ```mindmap ```` 圍欄程式碼區塊的 Markmap 心智圖。 |
| `codeHighlight` | `boolean` | `true` | 啟用 highlight.js 程式碼區塊，包含三色圓點標題列與複製按鈕。 |
| `tips` | `boolean` | `true` | 啟用提示區塊，例如 `:::notice`、`:::warning` 等。 |
| `preview` | `boolean` | `true` | 顯示預覽面板。設為 `false` 時僅建立編輯面板。 |
| `onChange` | `(value: string) => void` | — | 每次編輯時呼叫，參數為完整文件字串。 |
| `toolbar` | `ToolbarConfig` | 所有操作 | 設定工具列顯示的操作，並覆寫標籤或圖示。 |
| `onImageUpload` | `(file: File) => Promise<string>` | — | 將圖片檔案貼上或拖放至編輯器時呼叫此掛鉤。回傳的 Promise 應解析為圖片 URL，並以 `![alt](url)` 插入。圖片對話框接受 URL，不提供檔案選擇器。 |
| `mention` | `MentionOptions` | — | @提及下拉選單的設定。省略時，輸入 `@` 不會開啟下拉選單。 |
| `docLink` | `DocLinkOptions` | — | 文件連結插入器的設定。省略時，輸入觸發字元不會開啟下拉選單。 |
| `renderDebounce` | `number \| false` | 自適應 | 預覽防抖延遲，單位為毫秒。`false` 表示每次編輯後同步算繪；數字指定固定延遲；省略時使用 `adaptiveDebounceMs(value.length)`，基礎值為 120 毫秒，上限為 600 毫秒。 |
| `autoPreview` | `boolean` | `true` | 設為 `true` 時，編輯後經過防抖重新算繪預覽；設為 `false` 時，須呼叫 `renderNow()` 或使用狀態列的重新整理按鈕更新。 |

## `EditorMode` 與 `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'`（預設）：不顯示工具列、狀態列與行號。
- `'complex'`：啟用工具列、狀態列與行號。
- `'light'`（預設）與 `'dark'` 控制語法醒目提示的配色及 CSS 自訂屬性。

兩者均可在執行期間透過 `setMode(mode)` 與 `setTheme(theme)` 修改。

## `ToolbarConfig`

`ToolbarConfig` 可以是**操作名稱陣列**（指定顯示項目），或**操作名稱對應覆寫設定的物件**：

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### 陣列形式（指定顯示項目）

僅顯示列出的操作，但仍依內建工具列順序排列；陣列用來篩選可見項目，不用來排序：

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### 物件形式（逐項覆寫）

預設顯示所有操作。使用物件形式可以隱藏項目、更改標籤或替換圖示：

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

完整的有效操作名稱請參閱[功能](./features.md#toolbar-actions)。

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| 欄位 | 型別 | 預設值 | 說明 |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | 搜尋掛鉤，接收 `@` 後輸入的文字。必須提供此掛鉤才能啟用下拉選單。 |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | 回傳要在游標處插入的文字，以取代 `@query`。回傳 `[@label](mention:id)` 格式，預覽才會將它算繪為標籤。 |
| `minChars` | `number` | `0` | 顯示下拉選單所需的最短查詢長度。 |
| `maxItems` | `number` | `8` | 下拉選單最多顯示的項目數。 |

`MentionItem` 的說明請參閱 [API 參考](./api-reference.md)。

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

| 欄位 | 型別 | 預設值 | 說明 |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | 輸入觸發字元後呼叫的搜尋掛鉤。必須提供此掛鉤才能啟用下拉選單。 |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | 內建 fetch + DOMParser | 覆寫此掛鉤，透過後端代理取得中繼資料，以避免瀏覽器 CORS 限制。 |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` 插入 `:::doc-link` 卡片，沒有中繼資料時改用連結；`'link'` 一律插入一般 Markdown 連結；`'auto'` 在有中繼資料時插入卡片。 |
| `triggerChar` | `string` | `'/'` | 開啟文件搜尋下拉選單的字元。 |
| `minChars` | `number` | `0` | 開始搜尋所需的最短查詢長度。 |
| `maxItems` | `number` | `8` | 下拉選單最多顯示的項目數。 |

## `RendererOptions`

供 `Renderer` 建構函式與 `renderMarkdown(source, options)` 使用。

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

| 選項 | 型別 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | 啟用 KaTeX 公式算繪。 |
| `mindmap` | `boolean` | `true` | 啟用 Markmap 心智圖算繪。 |
| `codeHighlight` | `boolean` | `true` | 啟用 highlight.js 程式碼區塊。 |
| `tips` | `boolean` | `true` | 啟用提示區塊。 |
| `html` | `boolean` | `false` | 允許 Markdown 來源內容中的原始 HTML。預設的 `false` 較安全。 |
| `breaks` | `boolean` | `false` | 將軟換行轉換為 `<br>`。 |
| `theme` | `'light' \| 'dark'` | — | 使用 `renderMarkdown` 時，在 HTML 外包覆帶有主題的容器。`Renderer.render` 回傳未包覆的 HTML，須自行設定容器樣式。 |

工作清單核取方塊、`:::doc-link` 卡片及 @提及標籤一律啟用，無法透過 `RendererOptions` 關閉。

## 延伸閱讀

- [功能](./features.md) — 各選項在執行期間的表現。
- [API 參考](./api-reference.md) — 完整型別定義。

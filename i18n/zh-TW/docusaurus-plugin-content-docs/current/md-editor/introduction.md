---
sidebar_position: 1
title: "簡介"
description: "@powerduck/md-editor 是適用於瀏覽器的高效能可嵌入 Markdown 編輯器。它結合 CodeMirror 6 編輯區與 markdown-it 算繪的即時預覽，支援 KaTeX 公式、Markmap 心智圖、程式碼醒目提示、提示區塊、可設定工具列、鍵盤快捷鍵、圖片上傳掛鉤、@提及及文件連結插入。"
---

# 簡介

`@powerduck/md-editor` 是適用於瀏覽器的高效能可嵌入 Markdown 編輯器。它結合 [CodeMirror 6](https://codemirror.net) 編輯區與 [markdown-it](https://github.com/markdown-it/markdown-it) 算繪的即時預覽，支援 KaTeX 公式、Markmap 心智圖、程式碼醒目提示、提示區塊、可設定工具列、鍵盤快捷鍵、圖片上傳掛鉤、@提及及文件連結插入。

- **套件名稱：** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **授權條款：** MIT
- **模組格式：** ECMAScript 模組（`type: "module"`），同時提供 ESM（`dist/index.mjs`）與 CJS（`dist/index.cjs`）建置版本，以及型別宣告（`dist/index.d.ts`）。

## 核心功能

以下功能均對應已實作的原始碼模組：

- **Markdown 編輯：** 以 CodeMirror 6 為基礎，支援 Markdown 語法醒目提示及明暗主題。
- **KaTeX 公式：** 透過獨立的 markdown-it 外掛支援行內 `$...$` 與區塊 `$$...$$` 公式，並以啟發式規則排除 `$5` 等金額。
- **Markmap 心智圖：** 算繪 ```` ```mindmap ```` 圍欄程式碼區塊。markmap-lib 與 markmap-view 採動態匯入，沒有心智圖的頁面不必在初始載入時下載這些模組。
- **程式碼醒目提示：** 使用 highlight.js，搭配 macOS 風格的三色圓點標題列、語言標籤及一鍵複製按鈕。
- **提示區塊：** `:::notice`、`:::info`、`:::tip`、`:::success`、`:::warning` 與 `:::danger` 區塊具有圖示及對應配色。
- **GitHub 風格預覽：** 使用 `github-markdown-css`。
- **完整工具列：** 提供 22 種操作，包含圖片、影片、YouTube 與表格插入對話框、公式與心智圖範本選擇器，以及列出所有快捷鍵的說明對話框。
- **鍵盤快捷鍵：** `Mod` 在 Windows/Linux 上對應 Ctrl，在 macOS 上對應 Cmd。
- **可設定工具列：** 可用陣列指定顯示項目，或逐項覆寫 `show`、`label` 與 `icon`。
- **圖片上傳掛鉤：** 將圖片貼上或拖放至編輯器時觸發 `onImageUpload`。
- **@提及下拉選單：** 透過 `mention` 選項設定，選取的提及會在預覽中顯示為具有樣式的標籤。
- **文件連結插入：** 透過 `docLink` 設定，支援一般連結或 `:::doc-link` 預覽卡片。中繼資料由內建載入器或自訂掛鉤取得；跨來源請求受瀏覽器 CORS 規則限制。
- **影片算繪：** 圖片語法中的 URL 若以 `.mp4`、`.webm`、`.ogg` 等已知副檔名結尾，會算繪為 `<video controls>` 元素。
- **獨立算繪器：** `renderMarkdown(source, options)` 不需掛載編輯器，即可使用與編輯器預覽相同的外掛和樣式產生 HTML。
- **區塊層級增量算繪：** 依 ATX 標題將來源文件分割成區塊，只重新算繪有變更的區塊。未變更的區塊重複使用既有 DOM 節點，包括已完成初始化的心智圖 SVG；算繪結果依內容雜湊快取。
- **自適應防抖：** 預覽算繪延遲隨文件長度調整，基礎值為 120 毫秒，上限為 600 毫秒。
- **兩種編輯模式：** `simple` 僅提供編輯與預覽，不含工具列；`complex` 包含工具列與狀態列，可於執行期間切換。
- **兩種主題：** `light` 與 `dark`，透過 `data-theme` 屬性及 CSS 自訂屬性套用。

## 架構概觀

此函式庫提供兩種使用方式：

1. **原生 JavaScript 類別：** 主要 API 以 `MarkdownEditor` 類別為核心，建立時傳入容器元素。內部組合 `CodeEditor`（CodeMirror 封裝）、`Renderer`（markdown-it 封裝）與預覽用的 `IncrementalRenderer`；在 `complex` 模式下還包含 `Toolbar` 和 `StatusBar`。對話框、@提及控制器及文件連結控制器是按需掛載的可插拔模組。

2. **React 子路徑匯出：** `MarkdownEditorReact` 是從 `./react` 子路徑匯出的 `forwardRef` 元件。它封裝原生 `MarkdownEditor` 執行個體，支援受控與非受控的 `value` 用法，並透過 ref 提供命令式的 `MarkdownEditorHandle`。React 入口獨立提供，因此未使用 React 的專案不需安裝 `react` 與 `react-dom`。

算繪分成同步的 markdown-it 階段與非同步初始化階段。前者為心智圖產生佔位 HTML，後者透過 `Renderer.hydrate` 將佔位內容轉為可互動的 SVG。`renderMarkdown` 回傳同步 HTML；若要產生心智圖 SVG，應先呼叫 `Renderer.render`，將 HTML 插入 DOM 後再呼叫 `Renderer.hydrate`。增量算繪器直接操作預覽容器。

## 瀏覽器支援

此函式庫適用於具有 DOM 的現代瀏覽器。CodeMirror 6、KaTeX 與 markmap-view 是套件相依項目，並非瀏覽器內建功能；互動式心智圖使用 `ResizeObserver`。可用時會使用 Clipboard API；當 `navigator.clipboard` 不可用（例如非 HTTPS 環境）時，程式碼區塊複製會改用 `document.execCommand('copy')`。心智圖模組僅在全域未定義 `ResizeObserver` 時安裝空實作，以避免匯入時因缺少該 API 而出錯；空實作不會提供真正的尺寸變更通知。

## 授權條款

`@powerduck/md-editor` 採用 **MIT** 授權條款。

## 延伸閱讀

- [安裝](./installation.md) — 安裝套件並了解匯入路徑。
- [快速入門](./quickstart.md) — 在原生 JavaScript 或 React 中掛載第一個編輯器。
- [設定](./configuration.md) — 查看 `MarkdownEditorOptions` 的所有選項。
- [功能](./features.md) — 深入了解各項內建功能。
- [API 參考](./api-reference.md) — 查看所有匯出的類別、函式與型別。
- [範例](./examples.md) — 完整且可執行的程式碼片段。

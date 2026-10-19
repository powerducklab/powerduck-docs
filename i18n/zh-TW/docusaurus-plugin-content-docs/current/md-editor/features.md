---
sidebar_position: 5
title: "功能"
description: "本頁依實際原始碼說明各項內建功能。"
---

# 功能

本頁依實際原始碼說明各項內建功能。

## 增量算繪

預覽採用區塊層級的增量算繪，讓大型文件的編輯保持流暢：

- **分割區塊**（`splitIntoBlocks`）：依 ATX 標題行（`#` 到 `######`）分割來源內容。反引號或波浪號程式碼圍欄內的內容不會成為分割點，`:::` 自訂容器內的標題也會保留在原區塊中。沒有標題的文件會視為單一區塊。
- **逐區塊算繪：** 只有內容雜湊改變的區塊會重新經過 markdown-it / KaTeX 處理。未變更的區塊直接重複使用既有 DOM 節點，包括已初始化的心智圖 SVG。
- **內容雜湊快取：** 算繪結果依內容雜湊快取，雜湊由快速的 djb2 風格演算法與長度組成，因此復原、重做及複製相同段落也能命中快取。超過 800 筆時，會清除已不在目前文件中的雜湊；目前區塊的快取仍保留，所以具有超過 800 個不同區塊的文件可能超過此門檻。
- **重新排序：** 將既有節點附加至 `DocumentFragment`，由瀏覽器原生移動節點。
- **自適應防抖**（`adaptiveDebounceMs(docLength, base = 120, max = 600)`）：算繪前的等待時間為 `base + floor(docLength / 20000) * 60`，上限為 `max`。可用 `renderDebounce` 覆寫，或設為 `renderDebounce: false` 以同步算繪。
- **`content-visibility: auto`：** 每個區塊包覆在 `.md-editor-block` 元素中，讓畫面外的區塊可略過版面配置與繪製。

單一區塊算繪失敗不會清空整個預覽，而會改用經過跳脫的 `<pre>` 顯示該區塊的來源內容。

## KaTeX 公式

獨立的 markdown-it 數學外掛使用 KaTeX 算繪公式，不依賴 `markdown-it-texmath`：

- **行內公式：** `$E=mc^2$`。內容不可為空，也不能包含 `$` 或換行。`$5`、`$10.50` 等金額形式會以啟發式規則排除。
- **區塊公式：**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  同時支援單行（`$$ ... $$`）與多行形式。套件已包含 KaTeX CSS。設定 `math: false` 可關閉。

## Markmap 心智圖

撰寫 ```` ```mindmap ```` 圍欄程式碼區塊，區塊內使用 Markdown 大綱：

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

區塊解析規則會追蹤圍欄的巢狀深度，保留心智圖內的巢狀程式碼圍欄。同步算繪先輸出佔位 `<div>`；`Renderer.hydrate(container)` 非同步匯入 `markmap-lib` 與 `markmap-view`，將佔位元素轉成可互動的 SVG。初始化失敗不會中斷其他內容。設定 `mindmap: false` 可關閉。

## 程式碼醒目提示與複製按鈕

圍欄程式碼區塊使用 highlight.js。建置註冊的語言包括 JavaScript、TypeScript、Python、JSON、Bash/Shell、CSS、XML/HTML/SVG、SQL、YAML、Markdown、Go、Rust、Java、C 和 C++，以及 `js`、`ts`、`py`、`sh`、`yml`、`md`、`rs`、`c++` 等常用別名。未知語言會嘗試自動偵測；失敗時改用經過跳脫的純文字。

每個區塊都具有 macOS 風格的容器、三色圓點、語言標籤與**複製**按鈕。複製按鈕使用預覽面板上的事件委派；Clipboard API 不可用時改用 `document.execCommand('copy')`。設定 `codeHighlight: false` 可關閉。

## 工具列操作 {#toolbar-actions}

在 `complex` 模式下，工具列依下列預設順序提供 22 種操作：

| # | 操作名稱 | 用途 |
|---|-------------|---------------|
| 1 | `heading` | 標題 |
| 2 | `bold` | 粗體（Ctrl+B） |
| 3 | `italic` | 斜體（Ctrl+I） |
| 4 | `link` | 連結（Ctrl+K） |
| 5 | `image` | 插入圖片 |
| 6 | `video` | 插入影片 |
| 7 | `youtube` | 插入 YouTube 影片 |
| 8 | `quote` | 引用 |
| 9 | `ul` | 無序清單 |
| 10 | `ol` | 有序清單 |
| 11 | `tasklist` | 工作清單 |
| 12 | `mention` | 提及（@） |
| 13 | `doclink` | 插入文件連結 |
| 14 | `code` | 程式碼區塊 |
| 15 | `table` | 表格 |
| 16 | `math` | 數學公式 |
| 17 | `mindmap` | 插入心智圖 |
| 18 | `hr` | 水平分隔線 |
| 19 | `tips` | 插入提示區塊 |
| 20 | `preview` | 切換預覽 |
| 21 | `help` | 鍵盤快捷鍵 |
| 22 | `theme` | 切換主題 |

內建標籤為英文，可逐項覆寫 `label` 以在地化工具提示與無障礙名稱。圖片、影片、YouTube、表格、公式範本、心智圖範本、提示類型與說明操作會開啟對話框或選擇器。透過 `toolbar` 選項設定工具列，詳見[設定](./configuration.md#toolbarconfig)。

## 鍵盤快捷鍵

內建快捷鍵定義於 `DEFAULT_SHORTCUTS`。`Mod` 在 Windows/Linux 上對應 Ctrl，在 macOS 上對應 Cmd。

| 按鍵 | 操作 | 說明 |
|-----|--------|-------------|
| `Mod-b` | `bold` | 粗體 |
| `Mod-i` | `italic` | 斜體 |
| `Mod-Alt-1` | `heading` | 標題 |
| `Mod-k` | `link` | 插入連結 |
| `Mod-Alt-c` | `code` | 程式碼區塊 |
| `Mod-Shift-.` | `quote` | 區塊引用 |
| `Mod-Shift-8` | `ul` | 無序清單 |
| `Mod-Shift-7` | `ol` | 有序清單 |
| `Mod-Shift-9` | `tasklist` | 工作清單 |
| `Mod-Alt-m` | `math` | 數學公式 |
| `Mod-Alt-p` | `preview` | 切換預覽 |
| `Mod-Shift-l` | `theme` | 切換主題 |

工具列的**說明**按鈕會開啟對話框，以鍵帽樣式列出快捷鍵，並提供工作清單、提及、文件連結、公式、心智圖及提示區塊的語法速查。

## 圖片上傳

提供 `onImageUpload: (file: File) => Promise<string>`。將圖片檔案貼上或拖放至編輯器時會呼叫此掛鉤；圖片對話框接受 URL，不提供檔案選擇功能。回傳可存取的圖片 URL 後，編輯器會在游標處插入 `![alt](url)`，替代文字使用去除副檔名的檔名。上傳失敗會被靜默捕捉，使用者可重試。

## @提及

透過 `mention` 設定，在輸入 `@` 時啟用可搜尋的下拉選單：

- `onMentionSearch(query)` 回傳符合條件的 `MentionItem`。
- `onMentionSelect(item)` 回傳插入文字，預設為 `[@label](mention:id)`，預覽會將它算繪為帶有樣式的標籤。
- `minChars`（預設 `0`）與 `maxItems`（預設 `8`）用來調整下拉選單。

下拉選單支援上下方向鍵、Enter/Tab 與 Escape，並在編輯器失去焦點時關閉。預覽中的一般 `@` 文字（例如 `@media`）不會顯示為標籤，只有使用 `mention:` 通訊協定的連結才會。在編輯器中，若已設定搜尋掛鉤，這類文字仍可能觸發搜尋。

## 文件連結

透過 `docLink` 設定，在觸發字元（預設 `/`）後啟用文件搜尋下拉選單：

- `onDocSearch(query)` 回傳符合條件的 `DocItem`。
- `onFetchDocMeta(url)` 取得標題、縮圖與描述。內建實作以 `fetch` 與 `DOMParser` 讀取 Open Graph 標籤；跨來源伺服器未允許 CORS 時可能失敗。需要時可使用自訂後端代理。
- `insertStyle` 控制插入方式：`'auto'` 在有中繼資料時使用卡片，也可選擇 `'card'` 或 `'link'`。

選取的文件會插入為一般連結或 `:::doc-link` 卡片；卡片顯示可點擊的標題、縮圖、描述與主機名稱。

## 提示區塊

撰寫 `:::` 容器並指定六種類型之一。起始行的類型後可加入標題：

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

支援 `notice`、`info`、`tip`、`success`、`warning` 與 `danger`。每種類型都有圖示、彩色左框線與標題列。工具列的提示按鈕會開啟六種類型的視覺化選擇器。設定 `tips: false` 可關閉。

## 工作清單

符合 `- [ ]` 或 `- [x]` 的清單項目會顯示為停用的核取方塊，方括號內允許任意空白。請注意此專案的慣例：**`- [ ]` 顯示為已勾選（綠色），`- [x]` 顯示為未勾選**，與 GitHub Flavored Markdown 相反。工具列的工作清單按鈕可切換目前行或選取行的標記。

## 延伸閱讀

- [設定](./configuration.md) — 透過選項調整這些功能。
- [API 參考](./api-reference.md) — 以程式方式控制編輯器。

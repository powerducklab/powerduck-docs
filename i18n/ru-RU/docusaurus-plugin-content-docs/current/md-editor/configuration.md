---
sidebar_position: 4
title: "Конфигурация"
description: "Конструктор MarkdownEditor принимает элемент-контейнер или селектор, а затем объект MarkdownEditorOptions. Здесь описаны тип, значение по умолчанию и поведение каждого поля, а также связанные типы параметров."
---

# Конфигурация

Конструктор `MarkdownEditor` принимает элемент-контейнер или селектор, а затем объект `MarkdownEditorOptions`. Здесь описаны тип, значение по умолчанию и поведение каждого поля, а также связанные типы параметров.

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

| Параметр | Тип | По умолчанию | Описание |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Начальное содержимое Markdown. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` показывает редактор и предпросмотр без панели инструментов и строки состояния. `'complex'` добавляет обе панели. |
| `theme` | `EditorTheme` | `'light'` | Цветовая тема через атрибут `data-theme`: `'light'` или `'dark'`. |
| `math` | `boolean` | `true` | Включает формулы KaTeX: `$...$` внутри строки, `$$...$$` отдельным блоком. |
| `mindmap` | `boolean` | `true` | Включает интеллект-карты Markmap из ограждённых блоков ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Включает блоки кода highlight.js с трёхцветным заголовком и кнопкой копирования. |
| `tips` | `boolean` | `true` | Включает информационные блоки, например `:::notice` и `:::warning`. |
| `preview` | `boolean` | `true` | Показывает область предпросмотра. При `false` создаётся только область редактора. |
| `onChange` | `(value: string) => void` | — | Вызывается при каждом редактировании с полным текстом документа. |
| `toolbar` | `ToolbarConfig` | все действия | Выбирает видимые действия панели инструментов и заменяет их подписи или значки. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Обработчик вставки или перетаскивания файла изображения в редактор. Promise должен вернуть URL изображения, вставляемого как `![alt](url)`. Диалог изображения принимает URL и не содержит выбора файла. |
| `mention` | `MentionOptions` | — | Настройки списка @упоминаний. Если не указаны, ввод `@` не открывает список. |
| `docLink` | `DocLinkOptions` | — | Настройки вставки ссылок на документы. Если не указаны, ввод символа активации не открывает список. |
| `renderDebounce` | `number \| false` | адаптивная | Задержка обновления предпросмотра в миллисекундах. `false` запускает синхронный рендеринг при каждом изменении; число задаёт фиксированную задержку. Без значения используется `adaptiveDebounceMs(value.length)` — от 120 до 600 мс. |
| `autoPreview` | `boolean` | `true` | При `true` предпросмотр обновляется после изменений с задержкой. При `false` вызывайте `renderNow()` или используйте кнопку обновления строки состояния. |

## `EditorMode` и `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (по умолчанию): без панели инструментов, строки состояния и номеров строк.
- `'complex'`: включает панель инструментов, строку состояния и номера строк.
- `'light'` (по умолчанию) и `'dark'` управляют палитрой подсветки синтаксиса и пользовательскими свойствами CSS.

Оба параметра можно менять во время работы через `setMode(mode)` и `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` — это **массив имён включаемых действий** либо **объект, сопоставляющий имена действий с индивидуальными настройками**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Массив включаемых действий

Отображаются только перечисленные действия. Сохраняется встроенный порядок панели: массив фильтрует видимость, но не меняет порядок.

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Объект с настройками отдельных действий

По умолчанию видны все действия. Объект позволяет скрывать элементы и менять их подписи или значки:

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

Полный список допустимых имён действий приведён в разделе [Возможности](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Поле | Тип | По умолчанию | Описание |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Обработчик поиска, получающий текст после `@`. Необходим для включения списка. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Возвращает текст для вставки у курсора вместо `@query`. Используйте форму `[@label](mention:id)`, чтобы предпросмотр показывал метку. |
| `minChars` | `number` | `0` | Минимальная длина запроса для показа списка. |
| `maxItems` | `number` | `8` | Максимальное число элементов в списке. |

`MentionItem` описан в [справочнике API](./api-reference.md).

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

| Поле | Тип | По умолчанию | Описание |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Обработчик поиска после символа активации. Необходим для включения списка. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | встроенные fetch + DOMParser | Замените обработчик, чтобы получать метаданные через серверный прокси и избегать ограничений CORS браузера. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` вставляет карточку `:::doc-link`, а без метаданных — ссылку; `'link'` всегда вставляет обычную Markdown-ссылку; `'auto'` вставляет карточку при наличии метаданных. |
| `triggerChar` | `string` | `'/'` | Символ, открывающий поиск документов. |
| `minChars` | `number` | `0` | Минимальная длина запроса перед поиском. |
| `maxItems` | `number` | `8` | Максимальное число элементов в списке. |

## `RendererOptions`

Используется конструктором `Renderer` и функцией `renderMarkdown(source, options)`.

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

| Параметр | Тип | По умолчанию | Описание |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Включает формулы KaTeX. |
| `mindmap` | `boolean` | `true` | Включает интеллект-карты Markmap. |
| `codeHighlight` | `boolean` | `true` | Включает блоки кода highlight.js. |
| `tips` | `boolean` | `true` | Включает информационные блоки. |
| `html` | `boolean` | `false` | Разрешает необработанный HTML в Markdown. Значение по умолчанию `false` безопаснее. |
| `breaks` | `boolean` | `false` | Преобразует мягкие переносы строк в `<br>`. |
| `theme` | `'light' \| 'dark'` | — | В `renderMarkdown` оборачивает HTML в контейнер с темой. `Renderer.render` возвращает HTML без обёртки; задайте стиль контейнера самостоятельно. |

Флажки списков задач, карточки `:::doc-link` и метки @упоминаний всегда включены и не отключаются через `RendererOptions`.

## Дальнейшие шаги

- [Возможности](./features.md) — поведение параметров во время работы.
- [Справочник API](./api-reference.md) — все доступные типы.

---
sidebar_position: 4
title: "الإعدادات"
description: "يستقبل مُنشئ MarkdownEditor عنصر حاوية أو محدِّدًا، ثم كائن MarkdownEditorOptions. توضح هذه الصفحة نوع كل حقل وقيمته الافتراضية وسلوكه، إلى جانب أنواع الخيارات المرتبطة به."
---

# الإعدادات

يستقبل مُنشئ `MarkdownEditor` عنصر حاوية أو محدِّدًا، ثم كائن `MarkdownEditorOptions`. توضح هذه الصفحة نوع كل حقل وقيمته الافتراضية وسلوكه، إلى جانب أنواع الخيارات المرتبطة به.

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

| الخيار | النوع | القيمة الافتراضية | الوصف |
|--------|------|---------|-------------|
| `value` | `string` | `''` | محتوى Markdown الأولي. |
| `mode` | `EditorMode` | `'simple'` | يعرض `'simple'` المحرّر والمعاينة دون شريط أدوات أو حالة. ويضيف `'complex'` الشريطين. |
| `theme` | `EditorTheme` | `'light'` | سمة الألوان المطبّقة عبر الخاصية `data-theme`: إما `'light'` أو `'dark'`. |
| `math` | `boolean` | `true` | تفعيل معادلات KaTeX: ضمن السطر `$...$` وفي كتلة `$$...$$`. |
| `mindmap` | `boolean` | `true` | تفعيل خرائط Markmap الذهنية من الكتل المحددة بـ ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | تفعيل كتل شيفرة highlight.js مع الترويسة ذات النقاط الثلاث وزر النسخ. |
| `tips` | `boolean` | `true` | تفعيل كتل التنبيه مثل `:::notice` و`:::warning`. |
| `preview` | `boolean` | `true` | إظهار لوحة المعاينة. عند `false` تُنشأ لوحة المحرّر فقط. |
| `onChange` | `(value: string) => void` | — | تُستدعى عند كل تعديل مع النص الكامل للمستند. |
| `toolbar` | `ToolbarConfig` | جميع الإجراءات | تحديد إجراءات شريط الأدوات الظاهرة واستبدال تسمياتها أو أيقوناتها. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | خطاف يُستدعى عند لصق ملف صورة في المحرّر أو سحبه وإفلاته فيه. يجب أن يعيد الوعد URL الصورة لإدراجها بصيغة `![alt](url)`. تقبل نافذة الصورة عنوان URL ولا توفّر منتقي ملفات. |
| `mention` | `MentionOptions` | — | إعدادات قائمة @الإشارات. عند إغفالها، لا تفتح كتابة `@` القائمة. |
| `docLink` | `DocLinkOptions` | — | إعدادات إدراج روابط المستندات. عند إغفالها، لا تفتح كتابة حرف التفعيل القائمة. |
| `renderDebounce` | `number \| false` | تكيفي | تأخير تحديث المعاينة بالمللي ثانية. تُجري `false` العرض تزامنيًا بعد كل تعديل؛ ويحدد الرقم تأخيرًا ثابتًا. عند الإغفال، تُستخدم `adaptiveDebounceMs(value.length)`، من 120 إلى 600 مللي ثانية. |
| `autoPreview` | `boolean` | `true` | عند `true` تُحدَّث المعاينة بعد التعديلات مع تأخير. وعند `false` استدعِ `renderNow()` أو استخدم زر التحديث في شريط الحالة. |

## `EditorMode` و`EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (الافتراضي): دون شريط أدوات أو حالة أو أرقام أسطر.
- `'complex'`: تفعيل شريطي الأدوات والحالة وأرقام الأسطر.
- تتحكم `'light'` (الافتراضية) و`'dark'` في ألوان تلوين الصياغة وخصائص CSS المخصّصة.

يمكن تغيير كليهما أثناء التشغيل باستخدام `setMode(mode)` و`setTheme(theme)`.

## `ToolbarConfig`

تكون `ToolbarConfig` إما **مصفوفة بأسماء الإجراءات المطلوب إظهارها** أو **كائنًا يربط أسماء الإجراءات بالإعدادات البديلة**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### صيغة المصفوفة (الإجراءات الظاهرة)

تظهر الإجراءات المذكورة فقط، مع الحفاظ على ترتيب شريط الأدوات المضمّن؛ فالمصفوفة ترشّح الظهور ولا تغيّر الترتيب:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### صيغة الكائن (إعدادات كل عنصر)

تظهر جميع الإجراءات افتراضيًا. تتيح صيغة الكائن إخفاء العناصر أو تغيير تسمياتها وأيقوناتها:

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

ترد القائمة الكاملة لأسماء الإجراءات الصالحة في [الميزات](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| الحقل | النوع | القيمة الافتراضية | الوصف |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | خطاف بحث يتلقى النص المكتوب بعد `@`. مطلوب لتفعيل القائمة المنسدلة. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | يُرجع النص الذي يُدرج عند المؤشر بدلًا من `@query`. استخدم صيغة `[@label](mention:id)` لعرضه كشارة في المعاينة. |
| `minChars` | `number` | `0` | أدنى طول للاستعلام قبل إظهار القائمة. |
| `maxItems` | `number` | `8` | أقصى عدد من العناصر الظاهرة في القائمة. |

تجد شرح `MentionItem` في [مرجع API](./api-reference.md).

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

| الحقل | النوع | القيمة الافتراضية | الوصف |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | خطاف بحث يُستدعى بعد حرف التفعيل. مطلوب لتفعيل القائمة المنسدلة. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser المضمّنان | استبدل هذا الخطاف لجلب البيانات الوصفية عبر وكيل خلفي وتجنب قيود CORS في المتصفح. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | تدرج `'card'` بطاقة `:::doc-link`، أو رابطًا عند غياب البيانات الوصفية؛ وتدرج `'link'` دائمًا رابط Markdown عاديًا؛ وتدرج `'auto'` بطاقة عند توفر البيانات الوصفية. |
| `triggerChar` | `string` | `'/'` | الحرف الذي يفتح قائمة البحث عن المستندات. |
| `minChars` | `number` | `0` | أدنى طول للاستعلام قبل البحث. |
| `maxItems` | `number` | `8` | أقصى عدد من العناصر الظاهرة في القائمة. |

## `RendererOptions`

يستخدمه مُنشئ `Renderer` والدالة `renderMarkdown(source, options)`.

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

| الخيار | النوع | القيمة الافتراضية | الوصف |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | تفعيل عرض معادلات KaTeX. |
| `mindmap` | `boolean` | `true` | تفعيل عرض خرائط Markmap الذهنية. |
| `codeHighlight` | `boolean` | `true` | تفعيل كتل شيفرة highlight.js. |
| `tips` | `boolean` | `true` | تفعيل كتل التنبيه. |
| `html` | `boolean` | `false` | السماح بـ HTML الخام في مصدر Markdown. القيمة الافتراضية `false` أكثر أمانًا. |
| `breaks` | `boolean` | `false` | تحويل فواصل الأسطر المرنة إلى `<br>`. |
| `theme` | `'light' \| 'dark'` | — | مع `renderMarkdown`، تغليف HTML بحاوية ذات سمة. تُرجع `Renderer.render` نص HTML دون غلاف؛ اضبط نمط الحاوية بنفسك. |

خانات قوائم المهام وبطاقات `:::doc-link` وشارات @الإشارات مفعّلة دائمًا ولا يمكن تعطيلها عبر `RendererOptions`.

## الخطوات التالية

- [الميزات](./features.md) — أثر كل خيار أثناء التشغيل.
- [مرجع API](./api-reference.md) — جميع الأنواع المتاحة.

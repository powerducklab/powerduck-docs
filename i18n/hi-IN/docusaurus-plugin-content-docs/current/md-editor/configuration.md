---
sidebar_position: 4
title: "कॉन्फ़िगरेशन"
description: "MarkdownEditor कंस्ट्रक्टर पहले कंटेनर एलिमेंट या सेलेक्टर और फिर MarkdownEditorOptions ऑब्जेक्ट लेता है। यह पृष्ठ हर फ़ील्ड का टाइप, डिफ़ॉल्ट मान, व्यवहार और संबंधित विकल्पों के टाइप बताता है।"
---

# कॉन्फ़िगरेशन

`MarkdownEditor` कंस्ट्रक्टर पहले कंटेनर एलिमेंट या सेलेक्टर और फिर `MarkdownEditorOptions` ऑब्जेक्ट लेता है। यह पृष्ठ हर फ़ील्ड का टाइप, डिफ़ॉल्ट मान, व्यवहार और संबंधित विकल्पों के टाइप बताता है।

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

| विकल्प | टाइप | डिफ़ॉल्ट | विवरण |
|--------|------|---------|-------------|
| `value` | `string` | `''` | शुरुआती Markdown सामग्री। |
| `mode` | `EditorMode` | `'simple'` | `'simple'` टूलबार और स्टेटस बार के बिना एडिटर तथा प्रीव्यू दिखाता है। `'complex'` दोनों बार जोड़ता है। |
| `theme` | `EditorTheme` | `'light'` | `data-theme` एट्रिब्यूट से लागू रंग थीम: `'light'` या `'dark'`। |
| `math` | `boolean` | `true` | KaTeX सूत्र सक्षम करें: इनलाइन `$...$` और ब्लॉक `$$...$$`। |
| `mindmap` | `boolean` | `true` | ```` ```mindmap ```` फ़ेंस वाले ब्लॉक से Markmap माइंड मैप सक्षम करें। |
| `codeHighlight` | `boolean` | `true` | तीन रंगीन बिंदुओं वाले हेडर और कॉपी बटन सहित highlight.js कोड ब्लॉक सक्षम करें। |
| `tips` | `boolean` | `true` | `:::notice`, `:::warning` जैसे सूचना ब्लॉक सक्षम करें। |
| `preview` | `boolean` | `true` | प्रीव्यू पैनल दिखाएँ। `false` होने पर केवल एडिटर पैनल बनता है। |
| `onChange` | `(value: string) => void` | — | हर संपादन पर पूरे दस्तावेज़ की स्ट्रिंग के साथ कॉल होता है। |
| `toolbar` | `ToolbarConfig` | सभी क्रियाएँ | टूलबार में दिखने वाली क्रियाएँ चुनें और उनके लेबल या आइकन बदलें। |
| `onImageUpload` | `(file: File) => Promise<string>` | — | एडिटर में इमेज फ़ाइल पेस्ट या ड्रैग-ड्रॉप होने पर कॉल होने वाला हुक। Promise को इमेज URL लौटाना चाहिए, जिसे `![alt](url)` के रूप में डाला जाता है। इमेज डायलॉग URL लेता है; इसमें फ़ाइल चुनने की सुविधा नहीं है। |
| `mention` | `MentionOptions` | — | @मेंशन ड्रॉपडाउन का कॉन्फ़िगरेशन। न देने पर `@` टाइप करने से ड्रॉपडाउन नहीं खुलता। |
| `docLink` | `DocLinkOptions` | — | दस्तावेज़ लिंक डालने का कॉन्फ़िगरेशन। न देने पर ट्रिगर वर्ण टाइप करने से ड्रॉपडाउन नहीं खुलता। |
| `renderDebounce` | `number \| false` | अनुकूली | प्रीव्यू डिबाउंस का विलंब, मिलीसेकंड में। `false` हर संपादन पर सिंक्रोनस रेंडर करता है; संख्या निश्चित विलंब तय करती है। न देने पर `adaptiveDebounceMs(value.length)` इस्तेमाल होता है, 120 से अधिकतम 600 मिलीसेकंड तक। |
| `autoPreview` | `boolean` | `true` | `true` होने पर संपादन के बाद प्रीव्यू डिबाउंस के साथ दोबारा रेंडर होता है। `false` होने पर `renderNow()` कॉल करें या स्टेटस बार का रिफ़्रेश बटन इस्तेमाल करें। |

## `EditorMode` और `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (डिफ़ॉल्ट): टूलबार, स्टेटस बार और लाइन नंबर नहीं दिखते।
- `'complex'`: टूलबार, स्टेटस बार और लाइन नंबर सक्षम होते हैं।
- `'light'` (डिफ़ॉल्ट) और `'dark'` सिंटैक्स हाइलाइट के रंग तथा CSS कस्टम प्रॉपर्टी नियंत्रित करते हैं।

दोनों को रनटाइम पर `setMode(mode)` और `setTheme(theme)` से बदला जा सकता है।

## `ToolbarConfig`

`ToolbarConfig` या तो दिखाने वाली **क्रियाओं के नामों की ऐरे** है, या **क्रिया के नाम को उसकी कस्टम सेटिंग से जोड़ने वाला ऑब्जेक्ट**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### ऐरे प्रारूप (दिखाई जाने वाली क्रियाएँ)

केवल सूचीबद्ध क्रियाएँ दिखती हैं। उनका क्रम टूलबार के अंतर्निहित क्रम जैसा रहता है; ऐरे दृश्यता फ़िल्टर करती है, क्रम नहीं बदलती:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### ऑब्जेक्ट प्रारूप (हर आइटम की सेटिंग)

डिफ़ॉल्ट रूप से सभी क्रियाएँ दिखाई देती हैं। ऑब्जेक्ट प्रारूप से आइटम छिपाएँ या उनके लेबल और आइकन बदलें:

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

मान्य क्रिया नामों की पूरी सूची [सुविधाएँ](./features.md#toolbar-actions) में है।

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| फ़ील्ड | टाइप | डिफ़ॉल्ट | विवरण |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | `@` के बाद टाइप किए गए टेक्स्ट के साथ कॉल होने वाला खोज हुक। ड्रॉपडाउन सक्षम करने के लिए आवश्यक है। |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | कर्सर पर `@query` की जगह डाला जाने वाला टेक्स्ट लौटाता है। प्रीव्यू में बैज दिखाने के लिए `[@label](mention:id)` प्रारूप लौटाएँ। |
| `minChars` | `number` | `0` | ड्रॉपडाउन दिखने से पहले आवश्यक न्यूनतम क्वेरी लंबाई। |
| `maxItems` | `number` | `8` | ड्रॉपडाउन में दिखने वाले आइटम की अधिकतम संख्या। |

`MentionItem` का विवरण [API संदर्भ](./api-reference.md) में है।

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

| फ़ील्ड | टाइप | डिफ़ॉल्ट | विवरण |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | ट्रिगर वर्ण के बाद कॉल होने वाला खोज हुक। ड्रॉपडाउन सक्षम करने के लिए आवश्यक है। |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | अंतर्निहित fetch + DOMParser | बैकएंड प्रॉक्सी से मेटाडेटा लाने और ब्राउज़र के CORS प्रतिबंधों से बचने के लिए इस हुक को बदलें। |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` एक `:::doc-link` कार्ड डालता है और मेटाडेटा न होने पर लिंक डालता है; `'link'` हमेशा साधारण Markdown लिंक डालता है; `'auto'` मेटाडेटा उपलब्ध होने पर कार्ड डालता है। |
| `triggerChar` | `string` | `'/'` | दस्तावेज़ खोज ड्रॉपडाउन खोलने वाला वर्ण। |
| `minChars` | `number` | `0` | खोज से पहले आवश्यक न्यूनतम क्वेरी लंबाई। |
| `maxItems` | `number` | `8` | ड्रॉपडाउन में दिखने वाले आइटम की अधिकतम संख्या। |

## `RendererOptions`

`Renderer` कंस्ट्रक्टर और `renderMarkdown(source, options)` दोनों में उपयोग होता है।

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

| विकल्प | टाइप | डिफ़ॉल्ट | विवरण |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | KaTeX सूत्र रेंडरिंग सक्षम करें। |
| `mindmap` | `boolean` | `true` | Markmap माइंड मैप रेंडरिंग सक्षम करें। |
| `codeHighlight` | `boolean` | `true` | highlight.js कोड ब्लॉक सक्षम करें। |
| `tips` | `boolean` | `true` | सूचना ब्लॉक सक्षम करें। |
| `html` | `boolean` | `false` | Markdown सोर्स में रॉ HTML की अनुमति दें। डिफ़ॉल्ट `false` अधिक सुरक्षित है। |
| `breaks` | `boolean` | `false` | साधारण लाइन ब्रेक को `<br>` में बदलें। |
| `theme` | `'light' \| 'dark'` | — | `renderMarkdown` में HTML को थीम वाले कंटेनर में लपेटता है। `Renderer.render` बिना रैपर का HTML लौटाता है; उसके कंटेनर की स्टाइल स्वयं तय करें। |

कार्य-सूची के चेकबॉक्स, `:::doc-link` कार्ड और @मेंशन बैज हमेशा सक्षम रहते हैं और `RendererOptions` से बंद नहीं किए जा सकते।

## अगले चरण

- [सुविधाएँ](./features.md) — रनटाइम पर हर विकल्प का प्रभाव।
- [API संदर्भ](./api-reference.md) — सभी उपलब्ध टाइप।

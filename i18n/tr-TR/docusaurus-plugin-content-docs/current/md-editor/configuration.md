---
sidebar_position: 4
title: "Yapılandırma"
description: "MarkdownEditor oluşturucusu önce bir kapsayıcı öğe veya seçici, ardından MarkdownEditorOptions nesnesi alır. Bu sayfa her alanın türünü, varsayılanını ve davranışını, ayrıca ilgili seçenek türlerini açıklar."
---

# Yapılandırma

`MarkdownEditor` oluşturucusu önce bir kapsayıcı öğe veya seçici, ardından `MarkdownEditorOptions` nesnesi alır. Bu sayfa her alanın türünü, varsayılanını ve davranışını, ayrıca ilgili seçenek türlerini açıklar.

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

| Seçenek | Tür | Varsayılan | Açıklama |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Başlangıç Markdown içeriği. |
| `mode` | `EditorMode` | `'simple'` | `'simple'`, araç ve durum çubukları olmadan düzenleyici ile önizlemeyi gösterir. `'complex'` her iki çubuğu da ekler. |
| `theme` | `EditorTheme` | `'light'` | `data-theme` özniteliğiyle uygulanan renk teması: `'light'` veya `'dark'`. |
| `math` | `boolean` | `true` | KaTeX formüllerini etkinleştirir: satır içinde `$...$`, blok olarak `$$...$$`. |
| `mindmap` | `boolean` | `true` | ```` ```mindmap ```` kod bloklarından Markmap zihin haritalarını etkinleştirir. |
| `codeHighlight` | `boolean` | `true` | Üç renkli nokta başlığı ve kopyalama düğmesi olan highlight.js kod bloklarını etkinleştirir. |
| `tips` | `boolean` | `true` | `:::notice`, `:::warning` gibi bilgi kutularını etkinleştirir. |
| `preview` | `boolean` | `true` | Önizleme panelini gösterir. `false` olduğunda yalnızca düzenleyici paneli oluşturulur. |
| `onChange` | `(value: string) => void` | — | Her düzenlemede belgenin tam metniyle çağrılır. |
| `toolbar` | `ToolbarConfig` | tüm eylemler | Görünecek araç çubuğu eylemlerini seçer ve etiketlerini veya simgelerini değiştirir. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Düzenleyiciye bir görsel dosyası yapıştırıldığında veya sürüklenip bırakıldığında çağrılan kanca. Promise, `![alt](url)` olarak eklenecek görselin URL'sini döndürmelidir. Görsel penceresi URL kabul eder; dosya seçici sunmaz. |
| `mention` | `MentionOptions` | — | @Bahsetme açılır listesinin yapılandırması. Atlanırsa `@` yazmak listeyi açmaz. |
| `docLink` | `DocLinkOptions` | — | Belge bağlantısı ekleme yapılandırması. Atlanırsa tetikleyici karakteri yazmak listeyi açmaz. |
| `renderDebounce` | `number \| false` | uyarlanabilir | Önizleme gecikmesi, milisaniye cinsinden. `false` her düzenlemede senkron oluşturur; sayı sabit gecikme belirler. Atlanırsa 120–600 ms aralığında `adaptiveDebounceMs(value.length)` kullanılır. |
| `autoPreview` | `boolean` | `true` | `true` olduğunda düzenlemelerden sonra önizleme gecikmeli yenilenir. `false` olduğunda `renderNow()` çağırın veya durum çubuğundaki yenileme düğmesini kullanın. |

## `EditorMode` ve `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (varsayılan): araç çubuğu, durum çubuğu ve satır numarası yoktur.
- `'complex'`: araç çubuğu, durum çubuğu ve satır numaraları etkindir.
- `'light'` (varsayılan) ve `'dark'`, söz dizimi renklerini ve özel CSS özelliklerini denetler.

Her ikisi de çalışma sırasında `setMode(mode)` ve `setTheme(theme)` ile değiştirilebilir.

## `ToolbarConfig`

`ToolbarConfig`, gösterilecek **eylem adlarının dizisi** veya **eylem adlarını özel ayarlara eşleyen bir nesne** olabilir:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Dizi biçimi (gösterilecek eylemler)

Yalnızca listelenen eylemler gösterilir. Yerleşik araç çubuğu sırası korunur; dizi görünürlüğü filtreler, sıralamayı değiştirmez:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Nesne biçimi (öğe bazında ayar)

Varsayılan olarak tüm eylemler görünürdür. Nesne biçimiyle öğeleri gizleyebilir, etiketlerini veya simgelerini değiştirebilirsiniz:

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

Geçerli eylem adlarının tam listesi [Özellikler](./features.md#toolbar-actions) bölümündedir.

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Alan | Tür | Varsayılan | Açıklama |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | `@` sonrasında yazılan metinle çağrılan arama kancası. Açılır listeyi etkinleştirmek için gereklidir. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | İmleçte `@query` yerine eklenecek metni döndürür. Önizlemede rozet oluşturmak için `[@label](mention:id)` biçimini kullanın. |
| `minChars` | `number` | `0` | Açılır liste gösterilmeden önce gereken en kısa sorgu uzunluğu. |
| `maxItems` | `number` | `8` | Açılır listede gösterilecek en fazla öğe sayısı. |

`MentionItem`, [API başvurusunda](./api-reference.md) açıklanır.

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

| Alan | Tür | Varsayılan | Açıklama |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Tetikleyici karakterden sonra çağrılan arama kancası. Açılır listeyi etkinleştirmek için gereklidir. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | yerleşik fetch + DOMParser | Meta verileri bir arka uç proxy'si üzerinden almak ve tarayıcı CORS kısıtlarını aşmak için bu kancayı değiştirin. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'`, `:::doc-link` kartı ekler; meta veri yoksa bağlantıya döner. `'link'` her zaman düz Markdown bağlantısı ekler; `'auto'` meta veri varsa kart ekler. |
| `triggerChar` | `string` | `'/'` | Belge arama listesini açan karakter. |
| `minChars` | `number` | `0` | Aramadan önce gereken en kısa sorgu uzunluğu. |
| `maxItems` | `number` | `8` | Açılır listede gösterilecek en fazla öğe sayısı. |

## `RendererOptions`

Hem `Renderer` oluşturucusu hem de `renderMarkdown(source, options)` tarafından kullanılır.

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

| Seçenek | Tür | Varsayılan | Açıklama |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | KaTeX formüllerini etkinleştirir. |
| `mindmap` | `boolean` | `true` | Markmap zihin haritalarını etkinleştirir. |
| `codeHighlight` | `boolean` | `true` | highlight.js kod bloklarını etkinleştirir. |
| `tips` | `boolean` | `true` | Bilgi kutularını etkinleştirir. |
| `html` | `boolean` | `false` | Markdown kaynağında ham HTML'ye izin verir. Varsayılan `false` daha güvenlidir. |
| `breaks` | `boolean` | `false` | Yumuşak satır sonlarını `<br>` öğesine dönüştürür. |
| `theme` | `'light' \| 'dark'` | — | `renderMarkdown` ile HTML'yi temalı bir kapsayıcıya sarar. `Renderer.render` sarmalanmamış HTML döndürür; kapsayıcının stilini kendiniz ayarlayın. |

Görev listesi onay kutuları, `:::doc-link` kartları ve @bahsetme rozetleri her zaman etkindir; `RendererOptions` ile kapatılamaz.

## Sonraki adımlar

- [Özellikler](./features.md) — seçeneklerin çalışma sırasındaki etkileri.
- [API başvurusu](./api-reference.md) — tüm türler.

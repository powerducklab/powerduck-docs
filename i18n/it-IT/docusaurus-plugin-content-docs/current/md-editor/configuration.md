---
sidebar_position: 4
title: "Configurazione"
description: "Il costruttore di MarkdownEditor riceve un elemento contenitore o un selettore, seguito da un oggetto MarkdownEditorOptions. Questa pagina descrive tipo, valore predefinito e comportamento di ogni campo, oltre ai tipi di opzioni correlati."
---

# Configurazione

Il costruttore di `MarkdownEditor` riceve un elemento contenitore o un selettore, seguito da un oggetto `MarkdownEditorOptions`. Questa pagina descrive tipo, valore predefinito e comportamento di ogni campo, oltre ai tipi di opzioni correlati.

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

| Opzione | Tipo | Valore predefinito | Descrizione |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Contenuto Markdown iniziale. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` mostra editor e anteprima senza barre degli strumenti o di stato. `'complex'` aggiunge entrambe le barre. |
| `theme` | `EditorTheme` | `'light'` | Tema applicato tramite l'attributo `data-theme`: `'light'` o `'dark'`. |
| `math` | `boolean` | `true` | Attiva le formule KaTeX: `$...$` in linea e `$$...$$` a blocchi. |
| `mindmap` | `boolean` | `true` | Attiva le mappe mentali Markmap dai blocchi delimitati ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Attiva i blocchi di codice highlight.js con intestazione a tre indicatori e pulsante di copia. |
| `tips` | `boolean` | `true` | Attiva i riquadri informativi, come `:::notice` e `:::warning`. |
| `preview` | `boolean` | `true` | Mostra il pannello di anteprima. Con `false`, viene creato solo il pannello dell'editor. |
| `onChange` | `(value: string) => void` | — | Richiamata a ogni modifica con il testo completo del documento. |
| `toolbar` | `ToolbarConfig` | tutte le azioni | Configura le azioni visibili nella barra degli strumenti e ne sostituisce etichette o icone. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Hook richiamato quando si incolla o si trascina un file immagine nell'editor. La promessa deve restituire l'URL dell'immagine, inserita come `![alt](url)`. La finestra delle immagini accetta un URL e non offre un selettore di file. |
| `mention` | `MentionOptions` | — | Configurazione dell'elenco delle @menzioni. Se omessa, digitare `@` non apre l'elenco. |
| `docLink` | `DocLinkOptions` | — | Configurazione dell'inserimento di collegamenti ai documenti. Se omessa, digitare il carattere di attivazione non apre l'elenco. |
| `renderDebounce` | `number \| false` | adattivo | Debounce dell'anteprima in millisecondi. `false` esegue il rendering sincrono a ogni modifica; un numero imposta un ritardo fisso. Se omesso, viene usato `adaptiveDebounceMs(value.length)`, da 120 ms a 600 ms. |
| `autoPreview` | `boolean` | `true` | Con `true`, l'anteprima viene aggiornata dopo le modifiche, con debounce. Con `false`, chiama `renderNow()` oppure usa il pulsante di aggiornamento della barra di stato. |

## `EditorMode` ed `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (predefinito): nessuna barra degli strumenti, barra di stato o numero di riga.
- `'complex'`: attiva entrambe le barre e i numeri di riga.
- `'light'` (predefinito) e `'dark'` controllano la tavolozza della sintassi e le proprietà CSS personalizzate.

Entrambi si possono modificare durante l'esecuzione con `setMode(mode)` e `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` è un **array di nomi di azioni** da includere oppure un **oggetto che associa ogni azione alle impostazioni da sostituire**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Array di azioni incluse

Sono mostrate solo le azioni elencate. L'ordine resta quello predefinito della barra: l'array filtra la visibilità, senza cambiare l'ordine.

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Oggetto con impostazioni per azione

Tutte le azioni sono visibili per impostazione predefinita. L'oggetto permette di nascondere elementi o sostituirne etichette e icone:

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

L'elenco completo dei nomi validi è in [Funzionalità](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Campo | Tipo | Valore predefinito | Descrizione |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Hook di ricerca richiamato con il testo digitato dopo `@`. Necessario per attivare l'elenco. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Restituisce il testo da inserire al cursore in sostituzione di `@query`. Usa il formato `[@label](mention:id)` per visualizzare un'etichetta nell'anteprima. |
| `minChars` | `number` | `0` | Lunghezza minima della ricerca prima di mostrare l'elenco. |
| `maxItems` | `number` | `8` | Numero massimo di elementi mostrati nell'elenco. |

`MentionItem` è descritto nel [riferimento API](./api-reference.md).

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

| Campo | Tipo | Valore predefinito | Descrizione |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Hook di ricerca richiamato dopo il carattere di attivazione. Necessario per attivare l'elenco. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser integrati | Sostituisci questo hook per recuperare i metadati tramite un proxy backend ed evitare le restrizioni CORS del browser. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` inserisce una scheda `:::doc-link`, oppure un collegamento senza metadati; `'link'` inserisce sempre un collegamento Markdown semplice; `'auto'` inserisce una scheda quando sono disponibili metadati. |
| `triggerChar` | `string` | `'/'` | Carattere che apre la ricerca dei documenti. |
| `minChars` | `number` | `0` | Lunghezza minima della query prima della ricerca. |
| `maxItems` | `number` | `8` | Numero massimo di elementi mostrati nell'elenco. |

## `RendererOptions`

Usato dal costruttore `Renderer` e da `renderMarkdown(source, options)`.

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

| Opzione | Tipo | Valore predefinito | Descrizione |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Attiva le formule KaTeX. |
| `mindmap` | `boolean` | `true` | Attiva le mappe mentali Markmap. |
| `codeHighlight` | `boolean` | `true` | Attiva i blocchi di codice highlight.js. |
| `tips` | `boolean` | `true` | Attiva i riquadri informativi. |
| `html` | `boolean` | `false` | Consente HTML grezzo nel Markdown. Il valore predefinito `false` è più sicuro. |
| `breaks` | `boolean` | `false` | Converte i ritorni a capo semplici in `<br>`. |
| `theme` | `'light' \| 'dark'` | — | Con `renderMarkdown`, racchiude l'HTML in un contenitore con tema. `Renderer.render` restituisce HTML senza contenitore: applica tu lo stile al contenitore. |

Le caselle degli elenchi di attività, le schede `:::doc-link` e le etichette delle @menzioni sono sempre attive e non si possono disattivare con `RendererOptions`.

## Passaggi successivi

- [Funzionalità](./features.md) — effetto delle opzioni durante l'esecuzione.
- [Riferimento API](./api-reference.md) — tutti i tipi disponibili.

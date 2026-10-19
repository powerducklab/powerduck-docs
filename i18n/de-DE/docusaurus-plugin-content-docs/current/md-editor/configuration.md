---
sidebar_position: 4
title: "Konfiguration"
description: "Der Konstruktor von MarkdownEditor erhält ein Containerelement oder einen Selektor und anschließend ein MarkdownEditorOptions-Objekt. Diese Seite beschreibt Typ, Standardwert und Verhalten jedes Feldes sowie die zugehörigen Optionstypen."
---

# Konfiguration

Der Konstruktor von `MarkdownEditor` erhält ein Containerelement oder einen Selektor und anschließend ein `MarkdownEditorOptions`-Objekt. Diese Seite beschreibt Typ, Standardwert und Verhalten jedes Feldes sowie die zugehörigen Optionstypen.

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

| Option | Typ | Standardwert | Beschreibung |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Anfänglicher Markdown-Inhalt. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` zeigt Editor und Vorschau ohne Werkzeug- oder Statusleiste. `'complex'` ergänzt beide Leisten. |
| `theme` | `EditorTheme` | `'light'` | Farbthema über das Attribut `data-theme`: `'light'` oder `'dark'`. |
| `math` | `boolean` | `true` | KaTeX-Formeln aktivieren: `$...$` inline und `$$...$$` als Block. |
| `mindmap` | `boolean` | `true` | Markmap-Mindmaps aus Codeblöcken mit ```` ```mindmap ```` aktivieren. |
| `codeHighlight` | `boolean` | `true` | highlight.js-Codeblöcke mit Dreipunkt-Kopfzeile und Kopierschaltfläche aktivieren. |
| `tips` | `boolean` | `true` | Hinweisblöcke wie `:::notice` und `:::warning` aktivieren. |
| `preview` | `boolean` | `true` | Vorschaubereich anzeigen. Bei `false` wird nur der Editorbereich erstellt. |
| `onChange` | `(value: string) => void` | — | Wird bei jeder Bearbeitung mit dem vollständigen Dokumenttext aufgerufen. |
| `toolbar` | `ToolbarConfig` | alle Aktionen | Sichtbare Werkzeugleistenaktionen festlegen und deren Beschriftungen oder Symbole ersetzen. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Hook, der beim Einfügen oder Ablegen einer Bilddatei im Editor aufgerufen wird. Das Promise muss die Bild-URL liefern, die als `![alt](url)` eingefügt wird. Der Bilddialog akzeptiert eine URL und bietet keine Dateiauswahl. |
| `mention` | `MentionOptions` | — | Konfiguration des Dropdowns für @Erwähnungen. Ohne diese Option öffnet die Eingabe von `@` kein Dropdown. |
| `docLink` | `DocLinkOptions` | — | Konfiguration zum Einfügen von Dokumentlinks. Ohne diese Option öffnet das Auslösezeichen kein Dropdown. |
| `renderDebounce` | `number \| false` | adaptiv | Verzögerung der Vorschau in Millisekunden. `false` rendert bei jeder Bearbeitung synchron; eine Zahl legt eine feste Verzögerung fest. Ohne Angabe wird `adaptiveDebounceMs(value.length)` verwendet, von 120 ms bis 600 ms. |
| `autoPreview` | `boolean` | `true` | Bei `true` wird die Vorschau nach Änderungen verzögert neu gerendert. Bei `false` verwenden Sie `renderNow()` oder die Aktualisierungsschaltfläche der Statusleiste. |

## `EditorMode` und `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (Standard): keine Werkzeugleiste, Statusleiste oder Zeilennummern.
- `'complex'`: Werkzeugleiste, Statusleiste und Zeilennummern sind aktiviert.
- `'light'` (Standard) und `'dark'` steuern die Syntaxfarben und benutzerdefinierten CSS-Eigenschaften.

Beide Einstellungen lassen sich zur Laufzeit mit `setMode(mode)` und `setTheme(theme)` ändern.

## `ToolbarConfig`

`ToolbarConfig` ist entweder ein **Array mit einzublendenden Aktionsnamen** oder eine **Zuordnung von Aktionsnamen zu individuellen Einstellungen**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Array mit einzublendenden Aktionen

Nur die angegebenen Aktionen werden angezeigt. Die integrierte Reihenfolge bleibt erhalten; das Array steuert die Sichtbarkeit, nicht die Sortierung:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Objekt mit Einstellungen pro Aktion

Standardmäßig sind alle Aktionen sichtbar. Mit der Objektform können Sie Elemente ausblenden oder ihre Beschriftungen und Symbole ersetzen:

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

Alle gültigen Aktionsnamen sind unter [Funktionen](./features.md#toolbar-actions) aufgeführt.

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Feld | Typ | Standardwert | Beschreibung |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Such-Hook, der den nach `@` eingegebenen Text erhält. Für das Dropdown erforderlich. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Liefert den Text, der an der Cursorposition `@query` ersetzt. Verwenden Sie die Form `[@label](mention:id)`, damit die Vorschau ein Badge darstellt. |
| `minChars` | `number` | `0` | Mindestlänge der Suchanfrage, bevor das Dropdown erscheint. |
| `maxItems` | `number` | `8` | Maximale Anzahl angezeigter Dropdown-Einträge. |

`MentionItem` wird in der [API-Referenz](./api-reference.md) beschrieben.

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

| Feld | Typ | Standardwert | Beschreibung |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Such-Hook nach Eingabe des Auslösezeichens. Für das Dropdown erforderlich. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | integriertes fetch + DOMParser | Ersetzen Sie diesen Hook, um Metadaten über einen Backend-Proxy abzurufen und die CORS-Beschränkungen des Browsers zu umgehen. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` fügt eine `:::doc-link`-Karte ein, ohne Metadaten ersatzweise einen Link; `'link'` fügt immer einen einfachen Markdown-Link ein; `'auto'` verwendet bei vorhandenen Metadaten eine Karte. |
| `triggerChar` | `string` | `'/'` | Zeichen zum Öffnen der Dokumentsuche. |
| `minChars` | `number` | `0` | Mindestlänge der Eingabe vor Beginn der Suche. |
| `maxItems` | `number` | `8` | Maximale Anzahl angezeigter Dropdown-Einträge. |

## `RendererOptions`

Wird vom Konstruktor `Renderer` und von `renderMarkdown(source, options)` verwendet.

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

| Option | Typ | Standardwert | Beschreibung |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | KaTeX-Formeln aktivieren. |
| `mindmap` | `boolean` | `true` | Markmap-Mindmaps aktivieren. |
| `codeHighlight` | `boolean` | `true` | highlight.js-Codeblöcke aktivieren. |
| `tips` | `boolean` | `true` | Hinweisblöcke aktivieren. |
| `html` | `boolean` | `false` | Unverarbeitetes HTML im Markdown erlauben. `false` ist der sicherere Standardwert. |
| `breaks` | `boolean` | `false` | Einfache Zeilenumbrüche in `<br>` umwandeln. |
| `theme` | `'light' \| 'dark'` | — | Bei `renderMarkdown` das HTML in einen Container mit Theme einbetten. `Renderer.render` liefert HTML ohne diesen Wrapper; gestalten Sie dessen Container selbst. |

Aufgabenlisten-Kontrollkästchen, `:::doc-link`-Karten und @Erwähnungs-Badges sind immer aktiviert und lassen sich nicht über `RendererOptions` abschalten.

## Nächste Schritte

- [Funktionen](./features.md) — Auswirkungen der Optionen zur Laufzeit.
- [API-Referenz](./api-reference.md) — sämtliche verfügbaren Typen.

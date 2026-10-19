---
sidebar_position: 6
title: "Referencia de la API"
description: "Esta página documenta todas las exportaciones de la entrada principal @powerduck/md-editor y del subpath ./react. Las firmas se han tomado directamente del código fuente."
---

# Referencia de la API

Esta página documenta todas las exportaciones de la entrada principal `@powerduck/md-editor` y del subpath `./react`. Las firmas se han tomado directamente del código fuente.

## `MarkdownEditor`

La clase principal del editor. Se construye con un contenedor y opciones.

```ts
class MarkdownEditor {
  constructor(container: HTMLElement | string, options?: MarkdownEditorOptions);

  getValue(): string;
  setValue(value: string): void;
  getHtml(): string;
  renderNow(): void;
  setAutoPreview(auto: boolean): void;
  setMode(mode: EditorMode): void;
  setTheme(theme: EditorTheme): void;
  focus(): void;
  destroy(): void;
}
```

### `constructor(container, options?)`

- `container: HTMLElement | string` — elemento DOM o selector CSS. Si no hay coincidencias, lanza `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — consulte [Configuración](./configuration.md).

Construye la estructura, crea el `CodeEditor`, conecta los atajos de teclado y, en modo `complex`, crea las barras de herramientas y de estado. Al construirse realiza un renderizado inicial y actualiza la barra de estado.

### `getValue(): string`

Devuelve el código Markdown actual.

### `setValue(value: string): void`

Sustituye el documento completo, cancela cualquier renderizado diferido pendiente, vuelve a renderizar la vista previa de forma síncrona y actualiza la barra de estado.

### `getHtml(): string`

Renderiza el contenido actual a HTML mediante el `Renderer` interno y devuelve la cadena.

### `renderNow(): void`

Cancela cualquier renderizado diferido pendiente y fuerza inmediatamente el renderizado de la vista previa. Útil cuando `autoPreview` es `false`.

### `setAutoPreview(auto: boolean): void`

Activa o desactiva el renderizado automático de la vista previa al editar. Al activarlo, renderiza inmediatamente el valor actual.

### `setMode(mode: EditorMode): void`

Alterna entre `'simple'` y `'complex'`. Destruye y recrea las barras de herramientas y de estado según sea necesario, y alterna los números de línea. No hace nada si el modo no cambia.

### `setTheme(theme: EditorTheme): void`

Establece `data-theme` en el elemento raíz y reconfigura el compartimento de resaltado de CodeMirror. También cambia el icono del selector de tema entre sol y luna.

### `focus(): void`

Mueve el foco al editor CodeMirror.

### `destroy(): void`

Cancela los renderizados pendientes, destruye el editor de código, las barras de herramientas y de estado, el popup activo y el renderizador incremental, vacía el contenedor y elimina clases y atributos. Llámelo al desmontar el editor.

## `CodeEditor`

Una capa ligera sobre `EditorView` de CodeMirror 6, exportada para integraciones avanzadas. La mayoría de las aplicaciones deberían utilizar `MarkdownEditor`.

```ts
class CodeEditor {
  readonly view: EditorView;
  constructor(container: HTMLElement, options: CodeEditorOptions);

  setKeymap(bindings: Array<{ key: string; run: (view: EditorView) => boolean }>): void;
  getValue(): string;
  setValue(value: string): void;
  setLineNumbers(enabled: boolean): void;
  setTheme(theme: EditorTheme): void;
  insertAtCursor(text: string): void;
  wrapSelection(prefix: string, suffix: string, placeholder: string): void;
  getSelection(): string;
  wrapLines(prefix: string, placeholder: string): void;
  focus(): void;
  insertMention(): void;
  insertDocLink(): void;
  toggleTaskList(): void;
  destroy(): void;
}
```

`CodeEditorOptions` (no reexportado desde la entrada principal) acepta `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` y `theme`.

Métodos principales:

- **`setKeymap(bindings)`** — sustituye el compartimento de atajos personalizado por las asignaciones de CodeMirror indicadas.
- **`insertAtCursor(text)`** — inserta texto en la selección principal y desplaza el cursor al final del texto insertado.
- **`wrapSelection(prefix, suffix, placeholder)`** — envuelve la selección; si no hay ninguna, inserta `prefix + placeholder + suffix` y selecciona el texto de relleno.
- **`wrapLines(prefix, placeholder)`** — añade `prefix` al principio de cada línea seleccionada o de la línea actual.
- **`toggleTaskList()`** — alterna los marcadores `- [ ]` / `- [x]` en la línea actual o en las seleccionadas.

## `Renderer` y `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — crea una instancia markdown-it con `linkify: true` y `typographer: true`; activa condicionalmente fórmulas, mapas mentales, resaltado de código y avisos, y registra siempre los plugins de listas de tareas, enlaces a documentos, menciones y vídeo.
- **`render(source)`** — renderiza la fuente de forma síncrona a una cadena HTML.
- **`hydrate(container)`** — después de insertar el HTML en el DOM, convierte los marcadores de mapas mentales en diagramas SVG. No hace nada si los mapas mentales están desactivados; los errores se ignoran.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Crea un `Renderer` temporal y renderiza la fuente. Cuando se define `theme`, envuelve el resultado en un contenedor con tema; `Renderer.render` no añade esa envoltura. Permite renderizar Markdown sin montar un editor.

### `interface RendererOptions`

```ts
interface RendererOptions {
  math?: boolean;       // default true
  mindmap?: boolean;    // default true
  codeHighlight?: boolean; // default true
  tips?: boolean;       // default true
  html?: boolean;       // default false
  breaks?: boolean;     // default false
  theme?: 'light' | 'dark'; // wrapper added by renderMarkdown only
}
```

## `Toolbar`

```ts
class Toolbar {
  readonly el: HTMLDivElement;
  constructor(actions: readonly ToolbarAction[]);
  setActive(name: string, active: boolean): void;
  setIcon(name: string, icon: string): void;
  destroy(): void;
}
```

### `interface ToolbarAction`

```ts
interface ToolbarAction {
  name: string;
  title: string;
  icon: string;
  handler: (button: HTMLButtonElement) => void;
  groupEnd?: boolean;
  toggle?: boolean;
  active?: boolean;
}
```

Los botones utilizan `mousedown` + `preventDefault` para evitar que el editor pierda el foco y se contraiga la selección antes de ejecutar el controlador.

## `StatusBar` y `countText`

```ts
class StatusBar {
  readonly el: HTMLDivElement;
  constructor(callbacks: StatusBarCallbacks);
  update(state: StatusBarState): void;
  destroy(): void;
}

interface StatusBarState {
  charCount: number;
  wordCount: number;
  blockCount: number;
  mode: 'simple' | 'complex';
  autoPreview: boolean;
}
interface StatusBarCallbacks {
  onRefreshPreview: () => void;
}

function countText(value: string): { charCount: number; wordCount: number };
```

`StatusBarState` y `StatusBarCallbacks` describen las estructuras aceptadas, pero no se reexportan desde la entrada principal.

- **`countText(value)`** — devuelve `charCount` (longitud de la cadena original) y `wordCount` (elementos separados por espacios en blanco tras recortar los extremos).
- **`StatusBar.update(state)`** — muestra `chars · words`, el número de bloques renderizados y el botón «Refresh preview» (actualizar vista previa), que solo aparece si `autoPreview` está desactivado.

## `IncrementalRenderer`

```ts
class IncrementalRenderer {
  constructor(
    container: HTMLElement,
    renderBlock: (source: string) => string,
    maxCacheEntries?: number, // default 800
  );
  update(source: string): IncrementalRenderResult;
  getBlockCount(): number;
  destroy(): void;
}
```

- **`update(source)`** — divide la fuente en bloques, reutiliza nodos DOM en caché según la clave de cada bloque y añade los nodos a un `DocumentFragment`. Devuelve `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — devuelve el número de bloques de la última actualización.

## División en bloques

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Divide la fuente en los encabezados ATX, respetando los bloques de código delimitados y los contenedores `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Utilidades de planificación

```ts
interface DebouncedFn<A extends unknown[]> {
  (...args: A): void;
  cancel(): void;
  flush(): void;
}

function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
): DebouncedFn<A>;

function adaptiveDebounceMs(docLength: number, base?: number, max?: number): number;

function scheduleIdle(callback: () => void, timeout?: number): number;
function cancelIdle(handle: number): void;
```

`DebouncedFn` describe el valor devuelto, pero no se reexporta desde la entrada principal.

- **`debounce(fn, wait)`** — aplaza la ejecución hasta después de la última llamada. La función devuelta también dispone de `.cancel()` y `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — devuelve `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — utiliza `requestIdleCallback` si está disponible; en caso contrario, `setTimeout(0)`.
- **`cancelIdle(handle)`** — cancela el callback programado para un periodo de inactividad.

## Iconos

```ts
const icons: {
  bold: string; italic: string; heading: string; link: string; code: string;
  image: string; video: string; youtube: string;
  quote: string; list: string; listOrdered: string; taskList: string;
  mention: string; fileText: string; table: string; hr: string; alert: string;
  sigma: string; mindmap: string; eye: string; help: string;
  moon: string; sun: string; refresh: string;
};
type IconName = keyof typeof icons;
```

Cada icono es una cadena SVG en línea de 16×16 que utiliza `currentColor`. Use `icons.<name>` para sustituir `icon` en `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Panel flotante anclado a un botón de la barra de herramientas, utilizado internamente en los diálogos de inserción y disponible para extensiones personalizadas.

```ts
class Popup {
  readonly el: HTMLDivElement;
  constructor(anchor: HTMLElement, config: PopupConfig);
  show(): void;
  hide(): void;
  destroy(): void;
}

interface PopupConfig {
  title: string;
  fields: readonly PopupField[];
  submitLabel?: string;
  theme?: 'light' | 'dark';
  onSubmit: (values: Record<string, string>) => void;
}

interface PopupField {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
  required?: boolean;
}
```

El popup se cierra al hacer clic fuera, pulsar Escape o enviar correctamente el formulario.

## Utilidades multimedia

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — acepta URL `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` o un ID de 11 caracteres sin formato; devuelve `null` si no lo reconoce.
- **`youTubeEmbedMarkdown`** — devuelve `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — comprueba si la extensión de la URL es `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi` o `.mkv`, tras quitar la cadena de consulta.

## Utilidades de teclado

```ts
const DEFAULT_SHORTCUTS: readonly ShortcutDef[];

interface ShortcutDef {
  action: string;
  key: string;        // e.g. 'Mod-b'
  description: string;
}

function matchShortcut(shortcut: string, e: KeyboardEvent): boolean;
function formatShortcut(shortcut: string): string;
function formatShortcutHtml(shortcut: string): string;
```

- **`matchShortcut`** — analiza una combinación `Mod`/`Ctrl`/`Alt`/`Shift`/tecla y la compara con un `KeyboardEvent`. `Mod` se interpreta como Meta en macOS y como Ctrl en los demás sistemas.
- **`formatShortcut`** — representa un atajo como texto; por ejemplo, `Mod-b` → `Ctrl+B` (Windows) o `Cmd+B` (macOS).
- **`formatShortcutHtml`** — genera elementos `<kbd>` con estilo y símbolos de las teclas modificadoras.

## Tipos de menciones

```ts
interface MentionItem {
  id: string;
  label: string;
  avatar?: string;
  description?: string;
  [key: string]: unknown;
}

interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;  // default 0
  maxItems?: number;  // default 8
}
```

## Tipos de enlaces a documentos

```ts
interface DocItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  [key: string]: unknown;
}

interface DocMeta {
  title?: string;
  thumbnail?: string;
  description?: string;
}

interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto'; // default 'auto'
  triggerChar?: string;                    // default '/'
  minChars?: number;                       // default 0
  maxItems?: number;                       // default 8
}
```

## Tipos de opciones compartidas

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';

interface ToolbarItemOverride {
  show?: boolean;
  label?: string;
  icon?: string;
}

type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;

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

Los valores predeterminados de cada campo se detallan en [Configuración](./configuration.md).

## Subpath de React

Se importa desde `@powerduck/md-editor/react`:

```tsx
import {
  MarkdownEditorReact,
  type MarkdownEditorProps,
  type MarkdownEditorHandle,
} from '@powerduck/md-editor/react';
```

### `MarkdownEditorProps`

```ts
interface MarkdownEditorProps extends Omit<MarkdownEditorOptions, 'value' | 'onChange'> {
  value?: string;        // controlled value
  defaultValue?: string; // uncontrolled initial value (mount only)
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}
```

### `MarkdownEditorHandle`

```ts
interface MarkdownEditorHandle {
  getValue: () => string;
  setValue: (value: string) => void;
  getHtml: () => string;
  focus: () => void;
  setMode: (mode: EditorMode) => void;
  setTheme: (theme: EditorTheme) => void;
  renderNow: () => void;
}
```

## Siguientes pasos

- [Ejemplos](./examples.md) — estas API en la práctica.
- [Funciones](./features.md) — detalles del comportamiento en ejecución.

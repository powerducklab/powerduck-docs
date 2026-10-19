---
sidebar_position: 6
title: "Referência da API"
description: "Esta página documenta todas as exportações da entrada principal @powerduck/md-editor e do subcaminho ./react. As assinaturas foram extraídas diretamente do código-fonte."
---

# Referência da API

Esta página documenta todas as exportações da entrada principal `@powerduck/md-editor` e do subcaminho `./react`. As assinaturas foram extraídas diretamente do código-fonte.

## `MarkdownEditor`

A classe principal do editor. O construtor recebe um contêiner e opções.

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

- `container: HTMLElement | string` — elemento DOM ou seletor CSS. Se nenhum elemento corresponder, lança `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — consulte [Configuração](./configuration.md).

Monta o layout, cria o `CodeEditor`, conecta os atalhos de teclado e, no modo `complex`, cria as barras de ferramentas e de status. A construção executa a renderização inicial e atualiza a barra de status.

### `getValue(): string`

Retorna o código Markdown atual.

### `setValue(value: string): void`

Substitui o documento inteiro, cancela qualquer renderização adiada pendente, renderiza a prévia de forma síncrona e atualiza a barra de status.

### `getHtml(): string`

Renderiza o conteúdo atual como HTML pelo `Renderer` interno e retorna a string.

### `renderNow(): void`

Cancela qualquer renderização adiada pendente e força a renderização imediata da prévia. Útil quando `autoPreview` é `false`.

### `setAutoPreview(auto: boolean): void`

Ativa ou desativa a renderização automática da prévia ao editar. Ao ativar, renderiza imediatamente o valor atual.

### `setMode(mode: EditorMode): void`

Alterna entre `'simple'` e `'complex'`. Destrói e recria as barras de ferramentas e de status conforme necessário e alterna os números de linha. Não faz nada se o modo não mudar.

### `setTheme(theme: EditorTheme): void`

Define `data-theme` no elemento raiz e reconfigura o compartimento de realce do CodeMirror. Também alterna o ícone do seletor de tema entre sol e lua.

### `focus(): void`

Move o foco para o editor CodeMirror.

### `destroy(): void`

Cancela renderizações pendentes, destrói o editor de código, as barras de ferramentas e de status, o popup ativo e o renderizador incremental, esvazia o contêiner e remove classes e atributos. Chame ao desmontar o editor.

## `CodeEditor`

Uma camada fina sobre o `EditorView` do CodeMirror 6, exportada para integrações avançadas. Na maioria dos casos, use `MarkdownEditor`.

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

`CodeEditorOptions` (não reexportado pela entrada principal) aceita `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` e `theme`.

Métodos principais:

- **`setKeymap(bindings)`** — substitui o compartimento de atalhos personalizado pelos vínculos de teclas do CodeMirror fornecidos.
- **`insertAtCursor(text)`** — insere texto na seleção principal e move o cursor para depois dele.
- **`wrapSelection(prefix, suffix, placeholder)`** — envolve a seleção; se nada estiver selecionado, insere `prefix + placeholder + suffix` e seleciona o texto provisório.
- **`wrapLines(prefix, placeholder)`** — adiciona `prefix` no início de cada linha selecionada ou da linha atual.
- **`toggleTaskList()`** — alterna os marcadores `- [ ]` / `- [x]` na linha atual ou nas linhas selecionadas.

## `Renderer` e `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — cria uma instância markdown-it com `linkify: true` e `typographer: true`, ativa condicionalmente fórmulas, mapas mentais, realce de código e avisos, e sempre registra os plugins de listas de tarefas, links de documentos, menções e vídeo.
- **`render(source)`** — renderiza o conteúdo de forma síncrona como uma string HTML.
- **`hydrate(container)`** — após inserir o HTML no DOM, transforma os placeholders de mapas mentais em diagramas SVG. Não faz nada se os mapas mentais estiverem desativados; os erros são ignorados.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Cria um `Renderer` temporário e renderiza o conteúdo. Quando `theme` está definido, envolve o resultado em um contêiner com tema; `Renderer.render` não adiciona esse contêiner por conta própria. Use para renderizar Markdown sem montar um editor.

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

Os botões usam `mousedown` + `preventDefault` para impedir que o editor perca o foco e recolha a seleção antes da execução do manipulador.

## `StatusBar` e `countText`

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

`StatusBarState` e `StatusBarCallbacks` descrevem as estruturas aceitas, mas não são reexportados pela entrada principal.

- **`countText(value)`** — retorna `charCount` (comprimento original da string) e `wordCount` (itens separados por espaços em branco após remover os espaços das extremidades).
- **`StatusBar.update(state)`** — exibe `chars · words`, a contagem de blocos renderizados e o botão “Refresh preview” (atualizar prévia), que aparece apenas quando `autoPreview` está desativado.

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

- **`update(source)`** — divide o conteúdo em blocos, reutiliza nós DOM em cache pela chave do bloco e adiciona os nós a um `DocumentFragment`. Retorna `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — retorna o número de blocos da última atualização.

## Divisão em blocos

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Divide o conteúdo nos títulos ATX, respeitando os blocos de código delimitados e os contêineres `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Utilitários de agendamento

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

`DebouncedFn` descreve o valor retornado, mas não é reexportado pela entrada principal.

- **`debounce(fn, wait)`** — adia a execução até depois da última chamada. A função retornada também oferece `.cancel()` e `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — retorna `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — usa `requestIdleCallback` quando disponível; caso contrário, `setTimeout(0)`.
- **`cancelIdle(handle)`** — cancela o callback agendado para um período ocioso.

## Ícones

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

Cada ícone é uma string SVG inline de 16×16 que usa `currentColor`. Use `icons.<name>` para substituir `icon` em `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Painel flutuante ancorado a um botão da barra de ferramentas, usado internamente em diálogos de inserção e disponível para extensões personalizadas.

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

O popup fecha ao clicar fora, pressionar Escape ou enviar o formulário com sucesso.

## Utilitários de mídia

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — aceita URLs `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` ou um ID simples de 11 caracteres; retorna `null` se não reconhecer o formato.
- **`youTubeEmbedMarkdown`** — retorna `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — verifica se a extensão da URL é `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi` ou `.mkv`, após remover a query string.

## Utilitários de teclado

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

- **`matchShortcut`** — interpreta uma combinação `Mod`/`Ctrl`/`Alt`/`Shift`/tecla e a compara com um `KeyboardEvent`. `Mod` corresponde a Meta no macOS e a Ctrl nos demais sistemas.
- **`formatShortcut`** — formata um atalho como texto, por exemplo `Mod-b` → `Ctrl+B` (Windows) ou `Cmd+B` (macOS).
- **`formatShortcutHtml`** — gera elementos `<kbd>` estilizados com símbolos das teclas modificadoras.

## Tipos de menções

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

## Tipos de links de documentos

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

## Tipos de opções compartilhadas

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

Os valores padrão de cada campo estão em [Configuração](./configuration.md).

## Subcaminho React

Importação de `@powerduck/md-editor/react`:

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

## Próximos passos

- [Exemplos](./examples.md) — veja essas APIs na prática.
- [Recursos](./features.md) — detalhes do comportamento em execução.

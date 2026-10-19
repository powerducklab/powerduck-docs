---
sidebar_position: 4
title: "Configuração"
description: "O construtor de MarkdownEditor recebe um elemento contêiner ou seletor, seguido de um objeto MarkdownEditorOptions. Esta página descreve o tipo, o valor padrão e o comportamento de cada campo, além dos tipos de opções relacionados."
---

# Configuração

O construtor de `MarkdownEditor` recebe um elemento contêiner ou seletor, seguido de um objeto `MarkdownEditorOptions`. Esta página descreve o tipo, o valor padrão e o comportamento de cada campo, além dos tipos de opções relacionados.

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

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Conteúdo Markdown inicial. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` mostra o editor e a prévia sem barras de ferramentas ou de status. `'complex'` adiciona as duas barras. |
| `theme` | `EditorTheme` | `'light'` | Tema aplicado pelo atributo `data-theme`: `'light'` ou `'dark'`. |
| `math` | `boolean` | `true` | Ativa fórmulas KaTeX: `$...$` em linha e `$$...$$` em bloco. |
| `mindmap` | `boolean` | `true` | Ativa mapas mentais Markmap dos blocos delimitados ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Ativa blocos de código highlight.js com cabeçalho de três indicadores e botão de cópia. |
| `tips` | `boolean` | `true` | Ativa blocos de aviso, como `:::notice` e `:::warning`. |
| `preview` | `boolean` | `true` | Mostra o painel de prévia. Com `false`, apenas o painel do editor é criado. |
| `onChange` | `(value: string) => void` | — | Chamada a cada edição com o texto completo do documento. |
| `toolbar` | `ToolbarConfig` | todas as ações | Configura as ações visíveis da barra de ferramentas e substitui seus rótulos ou ícones. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Hook chamado ao colar ou arrastar um arquivo de imagem para o editor. A promessa deve retornar a URL da imagem, inserida como `![alt](url)`. O diálogo de imagem aceita uma URL e não oferece um seletor de arquivos. |
| `mention` | `MentionOptions` | — | Configuração da lista de @menções. Quando omitida, digitar `@` não abre a lista. |
| `docLink` | `DocLinkOptions` | — | Configuração da inserção de links para documentos. Quando omitida, digitar o caractere de acionamento não abre a lista. |
| `renderDebounce` | `number \| false` | adaptativo | Debounce da prévia em milissegundos. `false` renderiza de forma síncrona a cada edição; um número define um atraso fixo. Quando omitido, usa `adaptiveDebounceMs(value.length)`, de 120 ms até 600 ms. |
| `autoPreview` | `boolean` | `true` | Com `true`, a prévia é renderizada após as edições, com debounce. Com `false`, chame `renderNow()` ou use o botão de atualização da barra de status. |

## `EditorMode` e `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (padrão): sem barra de ferramentas, barra de status ou números de linha.
- `'complex'`: ativa as duas barras e os números de linha.
- `'light'` (padrão) e `'dark'` controlam a paleta de realce de sintaxe e as propriedades CSS personalizadas.

Ambos podem ser alterados durante a execução com `setMode(mode)` e `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` é um **array de nomes de ações** a incluir ou um **objeto que associa cada ação às suas configurações**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Array de ações incluídas

Somente as ações listadas são mostradas. Elas mantêm a ordem integrada da barra; o array filtra a visibilidade, sem alterar a ordem:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Objeto de configurações por ação

Todas as ações são visíveis por padrão. O objeto permite ocultar itens ou substituir seus rótulos e ícones:

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

A lista completa de nomes válidos está em [Recursos](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Campo | Tipo | Padrão | Descrição |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Hook de busca chamado com o texto digitado após `@`. Necessário para ativar a lista. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Retorna o texto inserido no cursor, substituindo `@query`. Use o formato `[@label](mention:id)` para exibir uma etiqueta na prévia. |
| `minChars` | `number` | `0` | Comprimento mínimo da consulta para mostrar a lista. |
| `maxItems` | `number` | `8` | Número máximo de itens mostrados na lista. |

`MentionItem` é descrito na [referência da API](./api-reference.md).

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

| Campo | Tipo | Padrão | Descrição |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Hook de busca chamado após o caractere de acionamento. Necessário para ativar a lista. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser integrados | Substitua este hook para buscar metadados por um proxy de backend e evitar as restrições CORS do navegador. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` insere um cartão `:::doc-link`, ou um link se não houver metadados; `'link'` sempre insere um link Markdown simples; `'auto'` insere um cartão quando há metadados. |
| `triggerChar` | `string` | `'/'` | Caractere que abre a busca de documentos. |
| `minChars` | `number` | `0` | Comprimento mínimo da consulta antes da busca. |
| `maxItems` | `number` | `8` | Número máximo de itens mostrados na lista. |

## `RendererOptions`

Usado tanto pelo construtor `Renderer` quanto por `renderMarkdown(source, options)`.

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

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Ativa fórmulas KaTeX. |
| `mindmap` | `boolean` | `true` | Ativa mapas mentais Markmap. |
| `codeHighlight` | `boolean` | `true` | Ativa blocos de código highlight.js. |
| `tips` | `boolean` | `true` | Ativa blocos de aviso. |
| `html` | `boolean` | `false` | Permite HTML bruto no Markdown. O padrão `false` é mais seguro. |
| `breaks` | `boolean` | `false` | Converte quebras de linha simples em `<br>`. |
| `theme` | `'light' \| 'dark'` | — | Com `renderMarkdown`, envolve o HTML em um contêiner com tema. `Renderer.render` retorna HTML sem esse contêiner; aplique o estilo ao contêiner por conta própria. |

As caixas de seleção das listas de tarefas, os cartões `:::doc-link` e as etiquetas de @menções ficam sempre ativos e não podem ser desativados por `RendererOptions`.

## Próximos passos

- [Recursos](./features.md) — efeito de cada opção durante a execução.
- [Referência da API](./api-reference.md) — todos os tipos disponíveis.

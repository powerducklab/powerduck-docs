---
sidebar_position: 4
title: "Configuración"
description: "El constructor de MarkdownEditor recibe un elemento contenedor o un selector, seguido de un objeto MarkdownEditorOptions. Esta página describe el tipo, el valor predeterminado y el comportamiento de cada campo, además de los tipos de opciones relacionados."
---

# Configuración

El constructor de `MarkdownEditor` recibe un elemento contenedor o un selector, seguido de un objeto `MarkdownEditorOptions`. Esta página describe el tipo, el valor predeterminado y el comportamiento de cada campo, además de los tipos de opciones relacionados.

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

| Opción | Tipo | Valor predeterminado | Descripción |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Contenido Markdown inicial. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` muestra el editor y la vista previa sin barras de herramientas ni de estado. `'complex'` añade ambas barras. |
| `theme` | `EditorTheme` | `'light'` | Tema aplicado mediante el atributo `data-theme`: `'light'` o `'dark'`. |
| `math` | `boolean` | `true` | Activa las fórmulas KaTeX: `$...$` en línea y `$$...$$` en bloque. |
| `mindmap` | `boolean` | `true` | Activa los mapas mentales Markmap de los bloques delimitados ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Activa los bloques de código highlight.js con cabecera de tres indicadores y botón de copia. |
| `tips` | `boolean` | `true` | Activa los bloques de aviso, como `:::notice` y `:::warning`. |
| `preview` | `boolean` | `true` | Muestra el panel de vista previa. Con `false`, solo se crea el panel del editor. |
| `onChange` | `(value: string) => void` | — | Se llama en cada edición con el texto completo del documento. |
| `toolbar` | `ToolbarConfig` | todas las acciones | Configura las acciones visibles de la barra de herramientas y sustituye sus etiquetas o iconos. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Función llamada al pegar o arrastrar un archivo de imagen al editor. La promesa debe devolver la URL de la imagen, que se inserta como `![alt](url)`. El diálogo de imagen acepta una URL y no incluye un selector de archivos. |
| `mention` | `MentionOptions` | — | Configuración de la lista de @menciones. Si se omite, escribir `@` no abre la lista. |
| `docLink` | `DocLinkOptions` | — | Configuración de la inserción de enlaces a documentos. Si se omite, escribir el carácter activador no abre la lista. |
| `renderDebounce` | `number \| false` | adaptativo | Retardo de la vista previa en milisegundos. `false` genera la vista de forma síncrona en cada edición; un número fija el retardo. Si se omite, se usa `adaptiveDebounceMs(value.length)`, desde 120 ms hasta 600 ms. |
| `autoPreview` | `boolean` | `true` | Con `true`, la vista previa se actualiza tras las ediciones, con retardo. Con `false`, llama a `renderNow()` o usa el botón de actualización de la barra de estado. |

## `EditorMode` y `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (predeterminado): sin barra de herramientas, barra de estado ni números de línea.
- `'complex'`: activa ambas barras y los números de línea.
- `'light'` (predeterminado) y `'dark'` controlan la paleta de resaltado de sintaxis y las propiedades CSS personalizadas.

Ambos ajustes se pueden cambiar durante la ejecución con `setMode(mode)` y `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` es un **array de nombres de acciones** que se deben incluir o un **objeto que asocia cada acción con sus ajustes**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Array de acciones incluidas

Solo se muestran las acciones indicadas. Conservan el orden integrado de la barra; el array filtra la visibilidad y no modifica el orden:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Objeto de ajustes por acción

Todas las acciones son visibles de forma predeterminada. El objeto permite ocultar elementos o cambiar sus etiquetas e iconos:

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

La lista completa de nombres de acciones válidos está en [Funciones](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Campo | Tipo | Valor predeterminado | Descripción |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Función de búsqueda que recibe el texto escrito después de `@`. Es necesaria para activar la lista. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Devuelve el texto que se insertará en el cursor para sustituir `@query`. Usa el formato `[@label](mention:id)` para mostrar una etiqueta en la vista previa. |
| `minChars` | `number` | `0` | Longitud mínima de la consulta para mostrar la lista. |
| `maxItems` | `number` | `8` | Número máximo de elementos mostrados en la lista. |

`MentionItem` se describe en la [referencia de la API](./api-reference.md).

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

| Campo | Tipo | Valor predeterminado | Descripción |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Función de búsqueda llamada después del carácter activador. Es necesaria para activar la lista. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser integrados | Sustituye esta función para obtener los metadatos mediante un proxy de backend y evitar las restricciones CORS del navegador. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` inserta una tarjeta `:::doc-link`, o un enlace si no hay metadatos; `'link'` siempre inserta un enlace Markdown sencillo; `'auto'` inserta una tarjeta cuando hay metadatos. |
| `triggerChar` | `string` | `'/'` | Carácter que abre la búsqueda de documentos. |
| `minChars` | `number` | `0` | Longitud mínima de la consulta antes de buscar. |
| `maxItems` | `number` | `8` | Número máximo de elementos mostrados en la lista. |

## `RendererOptions`

Se usa tanto en el constructor `Renderer` como en `renderMarkdown(source, options)`.

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

| Opción | Tipo | Valor predeterminado | Descripción |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Activa las fórmulas KaTeX. |
| `mindmap` | `boolean` | `true` | Activa los mapas mentales Markmap. |
| `codeHighlight` | `boolean` | `true` | Activa los bloques de código highlight.js. |
| `tips` | `boolean` | `true` | Activa los bloques de aviso. |
| `html` | `boolean` | `false` | Permite HTML sin procesar en el Markdown. `false` es el valor predeterminado más seguro. |
| `breaks` | `boolean` | `false` | Convierte los saltos de línea simples en `<br>`. |
| `theme` | `'light' \| 'dark'` | — | Con `renderMarkdown`, envuelve el HTML en un contenedor con tema. `Renderer.render` devuelve HTML sin contenedor; aplica tú los estilos al contenedor. |

Las casillas de listas de tareas, las tarjetas `:::doc-link` y las etiquetas de @menciones siempre están activadas y no pueden desactivarse mediante `RendererOptions`.

## Siguientes pasos

- [Funciones](./features.md) — efecto de cada opción durante la ejecución.
- [Referencia de la API](./api-reference.md) — todos los tipos disponibles.

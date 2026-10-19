---
sidebar_position: 1
title: "Introducción"
description: "@powerduck/md-editor es un editor Markdown de alto rendimiento que se puede integrar en el navegador. Combina un área de edición CodeMirror 6 con una vista previa en directo generada por markdown-it, y añade fórmulas KaTeX, mapas mentales Markmap, resaltado de código, avisos, una barra de herramientas configurable, atajos de teclado, funciones de carga de imágenes, @menciones e inserción de enlaces a documentos."
---

# Introducción

`@powerduck/md-editor` es un editor Markdown de alto rendimiento que se puede integrar en el navegador. Combina un área de edición [CodeMirror 6](https://codemirror.net) con una vista previa en directo generada por [markdown-it](https://github.com/markdown-it/markdown-it), y añade fórmulas KaTeX, mapas mentales Markmap, resaltado de código, avisos, una barra de herramientas configurable, atajos de teclado, funciones de carga de imágenes, @menciones e inserción de enlaces a documentos.

- **Nombre del paquete:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Licencia:** MIT
- **Formato de módulo:** módulo ECMAScript (`type: "module"`), con versiones ESM (`dist/index.mjs`) y CJS (`dist/index.cjs`) y declaraciones de tipos incluidas (`dist/index.d.ts`).

## Funciones principales

Las siguientes funciones se corresponden con los módulos implementados:

- **Edición Markdown** con CodeMirror 6, resaltado de sintaxis Markdown y temas de resaltado claro y oscuro.
- **Fórmulas KaTeX** mediante un plugin independiente de markdown-it: en línea con `$...$` y en bloque con `$$...$$`. Se aplican heurísticas para excluir importes como `$5` del análisis de fórmulas.
- **Mapas mentales Markmap** generados a partir de bloques delimitados ```` ```mindmap ````. markmap-lib y markmap-view se importan dinámicamente, por lo que no aumentan el tamaño del código cargado inicialmente cuando no hay mapas mentales.
- **Resaltado de código** con highlight.js, cabecera con tres indicadores de color al estilo de macOS, etiqueta de lenguaje y botón para copiar con un clic.
- **Bloques de aviso** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) con iconos y colores propios.
- **Vista previa de estilo GitHub** con `github-markdown-css`.
- **Barra de herramientas completa** con 22 acciones, diálogos para insertar imágenes, vídeos, vídeos de YouTube y tablas, selectores de plantillas para fórmulas y mapas mentales, y un diálogo de ayuda con todos los atajos.
- **Atajos de teclado** con `Mod`, que corresponde a Ctrl en Windows/Linux y a Cmd en macOS.
- **Barra de herramientas configurable** mediante un array de elementos que se deben incluir o ajustes por elemento (`show`, `label`, `icon`).
- **Función de carga de imágenes** (`onImageUpload`) que se activa al pegar o arrastrar una imagen al editor.
- **Lista desplegable de @menciones** configurada con las opciones `mention`; las menciones seleccionadas aparecen como etiquetas en la vista previa.
- **Inserción de enlaces a documentos** configurada mediante `docLink`: enlaces sencillos o tarjetas de vista previa `:::doc-link`. Los metadatos se obtienen con el cargador integrado o una función personalizada; las solicitudes entre orígenes están sujetas a las reglas CORS del navegador.
- **Reproducción de vídeo:** la sintaxis de imagen con una URL terminada en `.mp4`, `.webm`, `.ogg` u otra extensión reconocida genera un elemento `<video controls>`.
- **Renderizador independiente** (`renderMarkdown(source, options)`) que produce HTML con los mismos plugins y estilos que la vista previa, sin montar un editor.
- **Renderizado incremental por bloques:** el texto fuente se divide por los encabezados ATX y solo se vuelven a generar los bloques modificados. Los demás reutilizan sus nodos DOM, incluidos los SVG de mapas mentales ya inicializados. Los resultados se almacenan en caché según el hash del contenido.
- **Retardo adaptativo:** el tiempo de espera para actualizar la vista previa depende de la longitud del documento, desde 120 ms hasta 600 ms.
- **Dos modos de edición:** `simple` (edición y vista previa sin barra de herramientas) y `complex` (barra de herramientas y barra de estado), intercambiables durante la ejecución.
- **Dos temas:** `light` y `dark`, aplicados mediante el atributo `data-theme` y propiedades CSS personalizadas.

## Arquitectura

La biblioteca ofrece dos interfaces:

1. **Clase de JavaScript nativo:** la API principal gira en torno a `MarkdownEditor`, que se instancia con un elemento contenedor. Combina `CodeEditor` (envoltorio de CodeMirror), `Renderer` (envoltorio de markdown-it), `IncrementalRenderer` para la vista previa y, en modo `complex`, `Toolbar` y `StatusBar`. Los diálogos, el controlador de @menciones y el de enlaces a documentos son módulos que se montan bajo demanda.

2. **Exportación de React mediante subruta:** `MarkdownEditorReact` es un componente `forwardRef` exportado desde `./react`. Encapsula una instancia nativa de `MarkdownEditor`, admite el uso controlado y no controlado de `value` y expone un `MarkdownEditorHandle` imperativo mediante una ref. La entrada de React está separada para que los proyectos que no lo usan no tengan que instalar `react` y `react-dom`.

El renderizado consta de una fase síncrona de markdown-it, que genera marcadores HTML para los mapas mentales, y una inicialización asíncrona con `Renderer.hydrate`, que los convierte en diagramas SVG interactivos. `renderMarkdown` devuelve el HTML síncrono; para obtener los SVG, usa `Renderer.render`, inserta el HTML en el DOM y después llama a `Renderer.hydrate`. El renderizador incremental actúa directamente sobre el contenedor de la vista previa.

## Compatibilidad con navegadores

La biblioteca está orientada a navegadores modernos con DOM. CodeMirror 6, KaTeX y markmap-view son dependencias del paquete, no funciones del navegador; los mapas mentales interactivos usan `ResizeObserver`. Se utiliza la API Clipboard cuando está disponible. Si `navigator.clipboard` no está disponible, por ejemplo fuera de HTTPS, la copia de bloques de código recurre a `document.execCommand('copy')`. El módulo de mapas mentales instala una implementación vacía de `ResizeObserver` solo si el objeto global no existe, para evitar un error al importar; esta implementación no genera notificaciones reales de cambio de tamaño.

## Licencia

`@powerduck/md-editor` se distribuye bajo la licencia **MIT**.

## Siguientes pasos

- [Instalación](./installation.md) — instala el paquete y conoce las rutas de importación.
- [Inicio rápido](./quickstart.md) — monta tu primer editor en JavaScript nativo o React.
- [Configuración](./configuration.md) — todas las opciones de `MarkdownEditorOptions`.
- [Funciones](./features.md) — descubre en detalle cada función integrada.
- [Referencia de la API](./api-reference.md) — todas las clases, funciones y tipos exportados.
- [Ejemplos](./examples.md) — fragmentos completos y ejecutables.

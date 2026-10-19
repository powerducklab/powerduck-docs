---
sidebar_position: 5
title: "Funciones"
description: "Esta página describe cada función integrada según su implementación real."
---

# Funciones

Esta página describe cada función integrada según su implementación real.

## Renderizado incremental

La vista previa utiliza renderizado incremental por bloques para responder con fluidez en documentos grandes:

- **División en bloques** (`splitIntoBlocks`): el texto se divide en los encabezados ATX (`#` a `######`). El contenido de los bloques de código delimitados por acentos graves o tildes no se usa como punto de división; también se conservan los encabezados dentro de contenedores `:::`. Un documento sin encabezados forma un solo bloque.
- **Renderizado por bloque:** solo los bloques cuyo hash ha cambiado vuelven a pasar por markdown-it / KaTeX. Los demás reutilizan directamente sus nodos DOM, incluidos los SVG de mapas mentales ya inicializados.
- **Caché por hash del contenido:** los resultados se guardan con un hash rápido de tipo djb2 combinado con la longitud. Deshacer, rehacer y pegar párrafos idénticos también pueden reutilizar la caché. Al superar 800 entradas, se eliminan los hashes que ya no están en el documento actual. Los bloques actuales se conservan, por lo que un documento con más de 800 bloques distintos puede superar ese umbral.
- **Reordenación:** los nodos existentes se añaden a un `DocumentFragment` y el navegador los mueve de forma nativa.
- **Retardo adaptativo** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): la espera es `base + floor(docLength / 20000) * 60`, limitada a `max`. Usa `renderDebounce` para cambiarla o `renderDebounce: false` para generar la vista de forma síncrona.
- **`content-visibility: auto`:** cada bloque se envuelve en un elemento `.md-editor-block` para omitir el cálculo del diseño y el dibujo de bloques fuera de pantalla.

Si falla un bloque, no se vacía toda la vista previa: se muestra su texto fuente escapado en un `<pre>`.

## Fórmulas KaTeX

El plugin matemático independiente de markdown-it usa KaTeX, sin depender de `markdown-it-texmath`:

- **Fórmulas en línea:** `$E=mc^2$`. El contenido no puede estar vacío ni contener `$` o saltos de línea. Las heurísticas excluyen importes como `$5` o `$10.50`.
- **Fórmulas en bloque:**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Se admiten formas de una línea (`$$ ... $$`) y de varias líneas. El CSS de KaTeX se incluye en el paquete. Desactiva la función con `math: false`.

## Mapas mentales Markmap

Escribe un bloque delimitado ```` ```mindmap ```` con un esquema Markdown en su interior:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

La regla del bloque sigue la profundidad de anidamiento de los delimitadores para conservar los bloques de código internos. La fase síncrona genera un `<div>` temporal; `Renderer.hydrate(container)` importa `markmap-lib` y `markmap-view` de forma asíncrona y convierte los marcadores en SVG interactivos. Los fallos de inicialización no son fatales. Desactiva la función con `mindmap: false`.

## Resaltado de código y botón de copia

Los bloques de código se resaltan con highlight.js. La distribución registra JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C y C++, junto con alias como `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs` y `c++`. Los lenguajes desconocidos se detectan automáticamente; si falla la detección, se muestra texto plano escapado.

Cada bloque usa un contenedor al estilo de macOS con tres puntos de color, etiqueta de lenguaje y botón **Copiar**. El botón usa delegación de eventos en la vista previa y recurre a `document.execCommand('copy')` si no está disponible la API Clipboard. Desactiva la función con `codeHighlight: false`.

## Acciones de la barra de herramientas {#toolbar-actions}

En modo `complex`, la barra incluye estas 22 acciones en el orden indicado:

| # | Nombre de la acción | Función |
|---|-------------|---------------|
| 1 | `heading` | Encabezado |
| 2 | `bold` | Negrita (Ctrl+B) |
| 3 | `italic` | Cursiva (Ctrl+I) |
| 4 | `link` | Enlace (Ctrl+K) |
| 5 | `image` | Insertar imagen |
| 6 | `video` | Insertar vídeo |
| 7 | `youtube` | Insertar vídeo de YouTube |
| 8 | `quote` | Cita |
| 9 | `ul` | Lista sin ordenar |
| 10 | `ol` | Lista numerada |
| 11 | `tasklist` | Lista de tareas |
| 12 | `mention` | Mención (@) |
| 13 | `doclink` | Insertar enlace a documento |
| 14 | `code` | Bloque de código |
| 15 | `table` | Tabla |
| 16 | `math` | Fórmula matemática |
| 17 | `mindmap` | Insertar mapa mental |
| 18 | `hr` | Separador horizontal |
| 19 | `tips` | Insertar aviso |
| 20 | `preview` | Alternar vista previa |
| 21 | `help` | Atajos de teclado |
| 22 | `theme` | Cambiar tema |

Las etiquetas integradas están en inglés. Sustituye `label` en cada elemento para traducir las ayudas y los nombres accesibles. Varias acciones abren diálogos o selectores: imagen, vídeo, YouTube, tabla, plantillas de fórmulas y mapas mentales, tipos de aviso y ayuda. Configura la barra mediante `toolbar`, como se explica en [Configuración](./configuration.md#toolbarconfig).

## Atajos de teclado

Los atajos integrados se definen en `DEFAULT_SHORTCUTS`. `Mod` corresponde a Ctrl en Windows/Linux y a Cmd en macOS.

| Tecla | Acción | Descripción |
|-----|--------|-------------|
| `Mod-b` | `bold` | Negrita |
| `Mod-i` | `italic` | Cursiva |
| `Mod-Alt-1` | `heading` | Encabezado |
| `Mod-k` | `link` | Insertar enlace |
| `Mod-Alt-c` | `code` | Bloque de código |
| `Mod-Shift-.` | `quote` | Bloque de cita |
| `Mod-Shift-8` | `ul` | Lista sin ordenar |
| `Mod-Shift-7` | `ol` | Lista numerada |
| `Mod-Shift-9` | `tasklist` | Lista de tareas |
| `Mod-Alt-m` | `math` | Fórmula matemática |
| `Mod-Alt-p` | `preview` | Alternar vista previa |
| `Mod-Shift-l` | `theme` | Cambiar tema |

El botón **Ayuda** abre un diálogo que muestra los atajos con teclas estilizadas y una referencia rápida de listas de tareas, menciones, enlaces, fórmulas, mapas mentales y avisos.

## Carga de imágenes

Proporciona `onImageUpload: (file: File) => Promise<string>`. Se llama al pegar o arrastrar un archivo de imagen al editor. El diálogo de imagen acepta una URL y no ofrece selección de archivos. Devuelve la URL pública de la imagen; el editor inserta `![alt](url)` en el cursor y usa el nombre del archivo sin extensión como texto alternativo. Los fallos se capturan sin mostrar un error; el usuario puede volver a intentarlo.

## @menciones

Pasa la opción `mention` para activar una lista con búsqueda al escribir `@`:

- `onMentionSearch(query)` devuelve los `MentionItem` coincidentes.
- `onMentionSelect(item)` devuelve el texto que se insertará. El formato predeterminado es `[@label](mention:id)`, que se muestra como etiqueta en la vista previa.
- `minChars` (predeterminado `0`) y `maxItems` (predeterminado `8`) ajustan la lista.

La lista admite las flechas arriba/abajo, Intro/Tab y Escape, y se cierra cuando el editor pierde el foco. En la vista previa, el texto normal con `@`, como `@media`, no se convierte en etiqueta: solo se convierten los enlaces del esquema `mention:`. En el editor, ese texto sí puede activar una función de búsqueda configurada.

## Enlaces a documentos

Pasa la opción `docLink` para activar la búsqueda de documentos tras el carácter activador, `/` de forma predeterminada:

- `onDocSearch(query)` devuelve los `DocItem` coincidentes.
- `onFetchDocMeta(url)` obtiene el título, la miniatura y la descripción. La implementación integrada usa `fetch` y `DOMParser` para leer etiquetas Open Graph; puede fallar si un servidor de otro origen no permite CORS. Usa un proxy de backend personalizado cuando sea necesario.
- `insertStyle` controla el formato: `'auto'` (tarjeta si hay metadatos), `'card'` o `'link'`.

El documento seleccionado se inserta como enlace sencillo o tarjeta `:::doc-link` con título, miniatura, descripción y nombre de host, y se puede abrir haciendo clic.

## Bloques de aviso

Escribe un contenedor `:::` con uno de los seis tipos. En la línea inicial puedes añadir un título después del tipo:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Tipos admitidos: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Cada bloque incluye icono, borde izquierdo de color y cabecera. El botón de avisos abre un selector visual de los seis tipos. Desactiva la función con `tips: false`.

## Listas de tareas

Los elementos que coinciden con `- [ ]` o `- [x]`, con espacios opcionales dentro de los corchetes, generan casillas deshabilitadas. Ten en cuenta la convención del proyecto: **`- [ ]` aparece marcado en verde y `- [x]` aparece sin marcar**, al contrario que en GitHub Flavored Markdown. El botón de tareas alterna los marcadores de la línea actual o de las líneas seleccionadas.

## Siguientes pasos

- [Configuración](./configuration.md) — ajusta estas funciones mediante opciones.
- [Referencia de la API](./api-reference.md) — controla el editor mediante código.

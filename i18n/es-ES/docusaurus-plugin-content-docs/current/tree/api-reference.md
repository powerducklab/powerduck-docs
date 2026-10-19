---
sidebar_position: 4
title: "Referencia de la API"
description: "Propiedades de Tree, adaptadores, utilidades del núcleo y métodos del control imperativo."
---

# Referencia de la API

## Núcleo: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Adaptadores

### `buildOpenApiTree(document, options?)`

Crea un árbol de navegación OpenAPI.

| Opción | Tipo | Valor predeterminado | Descripción |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Muestra nodos marcados con `x-internal` o `x-scalar-ignore` cuando se activa |
| `showComponents` | `boolean` | `true` | Muestra la sección de componentes |
| `showWebhooks` | `boolean` | `true` | Muestra los webhooks |
| `defaultExpandDepth` | `number` | `2` | Profundidad de expansión predeterminada |

Prioridad de navegación: etiquetas anidadas nativas de OAS 3.2 → `x-tagGroups` → etiquetas planas.

### `buildSchemaTree(schema, options?)`

| Opción | Tipo | Valor predeterminado | Descripción |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Profundidad máxima de anidamiento |
| `showDeprecated` | `boolean` | `true` | Muestra propiedades obsoletas |
| `expandCombinators` | `boolean` | `true` | Expande oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Expande elementos de matrices |

### `buildDocTree(document, options?)`

Árbol de documentación al estilo Stripe: cada operación se expande para mostrar parámetros, cuerpo de la solicitud y respuestas.

## Componente React `<Tree />`

### Propiedades principales

| Propiedad | Tipo | Valor predeterminado | Descripción |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | obligatorio | Nodos raíz que se mostrarán |
| `onSelect` | `(node) => void` | — | Se invoca al seleccionar un nodo |
| `searchable` | `boolean` | `false` | Muestra el campo de búsqueda |
| `defaultExpandDepth` | `number` | `1` | Profundidad inicial de expansión |
| `showExpandAll` | `boolean` | `false` | Control para expandir o contraer todo |
| `draggable` | `boolean` | `false` | Activa la reordenación mediante arrastrar y soltar |
| `onReorder` | `(result: ReorderResult) => void` | — | Se invoca al reordenar dentro del mismo padre |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Se invoca al mover entre niveles |
| `canDrag` | `(node) => boolean` | — | Controla qué nodos se pueden arrastrar |
| `canDrop` | `(dragged, target, position) => boolean` | — | Controla los destinos de colocación permitidos |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Elementos del menú contextual |
| `onPatch` | `(ops, context) => void` | — | Operaciones de parche RFC 6902 al reordenar |
| `maxHeight` | `number \| string` | — | Altura máxima antes de activar el desplazamiento |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Variante de tamaño |

### Control imperativo (mediante ref)

| Método | Descripción |
|--------|-------------|
| `expandAll()` | Expande todos los nodos |
| `collapseAll()` | Contrae todos los nodos |
| `expandToDepth(depth)` | Expande hasta una profundidad determinada |
| `getExpandedIds()` | Obtiene los ID de los nodos expandidos |
| `getSelectedNode()` | Obtiene el nodo seleccionado |
| `scrollToNode(id)` | Desplaza un nodo hasta el área visible |
| `locateNode(predicate)` | Busca un nodo, expande sus antecesores, lo selecciona y lo desplaza al área visible |

## Utilidades del núcleo

| Función | Descripción |
|----------|-------------|
| `findNode(nodes, id)` | Busca un nodo por ID |
| `findPath(nodes, id)` | Busca la ruta completa desde la raíz |
| `getLeaves(nodes)` | Obtiene todos los nodos hoja |
| `countNodes(nodes)` | Cuenta todos los nodos |
| `filterTree(nodes, { query })` | Filtra por consulta de búsqueda |
| `flattenTree(nodes)` | Aplana el árbol en una lista en preorden |
| `updateNode(nodes, id, updater)` | Actualiza un nodo sin modificar el original |
| `removeNode(nodes, id)` | Elimina un nodo sin modificar el original |

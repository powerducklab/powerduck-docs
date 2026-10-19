---
sidebar_position: 4
title: "Riferimento API"
description: "Proprietà di Tree, adattatori, utilità principali e metodi del controllo imperativo."
---

# Riferimento API

## Nucleo: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Adattatori

### `buildOpenApiTree(document, options?)`

Crea un albero di navigazione OpenAPI.

| Opzione | Tipo | Valore predefinito | Descrizione |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Mostra i nodi marcati `x-internal` o `x-scalar-ignore` quando l’opzione è attiva |
| `showComponents` | `boolean` | `true` | Mostra la sezione dei componenti |
| `showWebhooks` | `boolean` | `true` | Mostra i webhook |
| `defaultExpandDepth` | `number` | `2` | Profondità di espansione predefinita |

Priorità di navigazione: tag annidati nativi OAS 3.2 → `x-tagGroups` → tag piatti.

### `buildSchemaTree(schema, options?)`

| Opzione | Tipo | Valore predefinito | Descrizione |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Profondità massima di annidamento |
| `showDeprecated` | `boolean` | `true` | Mostra proprietà deprecate |
| `expandCombinators` | `boolean` | `true` | Espande oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Espande gli elementi degli array |

### `buildDocTree(document, options?)`

Albero di documentazione in stile Stripe in cui ogni operazione si espande per mostrare parametri, corpo della richiesta e risposte.

## Componente React `<Tree />`

### Proprietà principali

| Proprietà | Tipo | Valore predefinito | Descrizione |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | obbligatorio | Nodi radice da visualizzare |
| `onSelect` | `(node) => void` | — | Richiamata quando viene selezionato un nodo |
| `searchable` | `boolean` | `false` | Mostra il campo di ricerca |
| `defaultExpandDepth` | `number` | `1` | Profondità iniziale di espansione |
| `showExpandAll` | `boolean` | `false` | Comando per espandere o comprimere tutto |
| `draggable` | `boolean` | `false` | Abilita il riordinamento tramite trascinamento |
| `onReorder` | `(result: ReorderResult) => void` | — | Richiamata al riordinamento sotto lo stesso genitore |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Richiamata allo spostamento tra livelli |
| `canDrag` | `(node) => boolean` | — | Controlla quali nodi possono essere trascinati |
| `canDrop` | `(dragged, target, position) => boolean` | — | Controlla le destinazioni di rilascio consentite |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Voci del menu contestuale |
| `onPatch` | `(ops, context) => void` | — | Operazioni di patch RFC 6902 al riordinamento |
| `maxHeight` | `number \| string` | — | Altezza massima prima dello scorrimento |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Variante di dimensione |

### Controllo imperativo (tramite ref)

| Metodo | Descrizione |
|--------|-------------|
| `expandAll()` | Espande tutti i nodi |
| `collapseAll()` | Comprime tutti i nodi |
| `expandToDepth(depth)` | Espande fino a una profondità specifica |
| `getExpandedIds()` | Ottiene gli ID dei nodi espansi |
| `getSelectedNode()` | Ottiene il nodo selezionato |
| `scrollToNode(id)` | Scorre fino a rendere visibile un nodo |
| `locateNode(predicate)` | Trova un nodo, espande gli antenati, lo seleziona e lo porta nell’area visibile |

## Utilità principali

| Funzione | Descrizione |
|----------|-------------|
| `findNode(nodes, id)` | Trova un nodo per ID |
| `findPath(nodes, id)` | Trova il percorso completo dalla radice |
| `getLeaves(nodes)` | Ottiene tutti i nodi foglia |
| `countNodes(nodes)` | Conta tutti i nodi |
| `filterTree(nodes, { query })` | Filtra in base alla ricerca |
| `flattenTree(nodes)` | Appiattisce in un elenco in preordine |
| `updateNode(nodes, id, updater)` | Aggiorna un nodo senza modificare l’originale |
| `removeNode(nodes, id)` | Rimuove un nodo senza modificare l’originale |

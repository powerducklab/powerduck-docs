---
sidebar_position: 4
title: "API-Referenz"
description: "Tree-Props, Adapter, Kernhilfsfunktionen und Methoden des imperativen Handles."
---

# API-Referenz

## Kern: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Adapter

### `buildOpenApiTree(document, options?)`

Erstellt einen OpenAPI-Navigationsbaum.

| Option | Typ | Standardwert | Beschreibung |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Zeigt bei Aktivierung mit `x-internal` oder `x-scalar-ignore` markierte Knoten |
| `showComponents` | `boolean` | `true` | Zeigt den Komponentenabschnitt |
| `showWebhooks` | `boolean` | `true` | Zeigt Webhooks |
| `defaultExpandDepth` | `number` | `2` | Standardmäßige Aufklapptiefe |

Navigationspriorität: native verschachtelte OAS-3.2-Tags → `x-tagGroups` → flache Tags.

### `buildSchemaTree(schema, options?)`

| Option | Typ | Standardwert | Beschreibung |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Maximale Verschachtelungstiefe |
| `showDeprecated` | `boolean` | `true` | Zeigt veraltete Eigenschaften |
| `expandCombinators` | `boolean` | `true` | Klappt oneOf/anyOf/allOf auf |
| `showArrayItems` | `boolean` | `true` | Klappt Array-Elemente auf |

### `buildDocTree(document, options?)`

Dokumentationsbaum im Stripe-Stil, in dem jede Operation Parameter, Anfragekörper und Antworten aufklappt.

## React-Komponente `<Tree />`

### Wichtige Props

| Prop | Typ | Standardwert | Beschreibung |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | erforderlich | Darzustellende Wurzelknoten |
| `onSelect` | `(node) => void` | — | Wird bei Knotenauswahl aufgerufen |
| `searchable` | `boolean` | `false` | Zeigt das Suchfeld |
| `defaultExpandDepth` | `number` | `1` | Anfängliche Aufklapptiefe |
| `showExpandAll` | `boolean` | `false` | Schalter zum Auf- und Zuklappen aller Knoten |
| `draggable` | `boolean` | `false` | Aktiviert Drag-and-drop-Umsortierung |
| `onReorder` | `(result: ReorderResult) => void` | — | Wird beim Umsortieren unter demselben Elternknoten aufgerufen |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Wird bei ebenenübergreifendem Verschieben aufgerufen |
| `canDrag` | `(node) => boolean` | — | Steuert, welche Knoten gezogen werden dürfen |
| `canDrop` | `(dragged, target, position) => boolean` | — | Steuert zulässige Ablageziele |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Einträge des Rechtsklickmenüs |
| `onPatch` | `(ops, context) => void` | — | RFC-6902-Patch-Operationen beim Umsortieren |
| `maxHeight` | `number \| string` | — | Maximale Höhe vor dem Scrollen |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Größenvariante |

### Imperativer Handle (über ref)

| Methode | Beschreibung |
|--------|-------------|
| `expandAll()` | Klappt alle Knoten auf |
| `collapseAll()` | Klappt alle Knoten zu |
| `expandToDepth(depth)` | Klappt bis zu einer bestimmten Tiefe auf |
| `getExpandedIds()` | Liefert IDs der aktuell aufgeklappten Knoten |
| `getSelectedNode()` | Liefert den aktuell ausgewählten Knoten |
| `scrollToNode(id)` | Scrollt einen Knoten in den sichtbaren Bereich |
| `locateNode(predicate)` | Findet einen Knoten, klappt Vorfahren auf, wählt ihn aus und scrollt ihn ins Sichtfeld |

## Kernhilfsfunktionen

| Funktion | Beschreibung |
|----------|-------------|
| `findNode(nodes, id)` | Findet einen Knoten anhand der ID |
| `findPath(nodes, id)` | Findet den vollständigen Pfad ab der Wurzel |
| `getLeaves(nodes)` | Liefert alle Blattknoten |
| `countNodes(nodes)` | Zählt alle Knoten |
| `filterTree(nodes, { query })` | Filtert anhand einer Suchanfrage |
| `flattenTree(nodes)` | Erzeugt eine flache Liste in Präorder |
| `updateNode(nodes, id, updater)` | Aktualisiert einen Knoten ohne Änderung des Originals |
| `removeNode(nodes, id)` | Entfernt einen Knoten ohne Änderung des Originals |

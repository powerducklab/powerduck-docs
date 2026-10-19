---
sidebar_position: 4
title: "Référence de l’API"
description: "Propriétés de Tree, adaptateurs, utilitaires du noyau et méthodes de contrôle impératif."
---

# Référence de l’API

## Noyau: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Adaptateurs

### `buildOpenApiTree(document, options?)`

Construit un arbre de navigation OpenAPI.

| Option | Type | Valeur par défaut | Description |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Affiche les nœuds marqués `x-internal` ou `x-scalar-ignore` lorsque l’option est activée |
| `showComponents` | `boolean` | `true` | Affiche la section des composants |
| `showWebhooks` | `boolean` | `true` | Affiche les webhooks |
| `defaultExpandDepth` | `number` | `2` | Profondeur de développement par défaut |

Priorité de navigation : étiquettes imbriquées natives d’OAS 3.2 → `x-tagGroups` → étiquettes à plat.

### `buildSchemaTree(schema, options?)`

| Option | Type | Valeur par défaut | Description |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Profondeur maximale d’imbrication |
| `showDeprecated` | `boolean` | `true` | Affiche les propriétés obsolètes |
| `expandCombinators` | `boolean` | `true` | Développe oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Développe les éléments des tableaux |

### `buildDocTree(document, options?)`

Arborescence inspirée de Stripe : chaque opération se développe pour afficher les paramètres, le corps de requête et les réponses.

## Composant React `<Tree />`

### Propriétés principales

| Propriété | Type | Valeur par défaut | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | obligatoire | Nœuds racines à afficher |
| `onSelect` | `(node) => void` | — | Appelé lors de la sélection d’un nœud |
| `searchable` | `boolean` | `false` | Affiche le champ de recherche |
| `defaultExpandDepth` | `number` | `1` | Profondeur initiale de développement |
| `showExpandAll` | `boolean` | `false` | Commande pour tout développer ou replier |
| `draggable` | `boolean` | `false` | Active la réorganisation par glisser-déposer |
| `onReorder` | `(result: ReorderResult) => void` | — | Appelé lors d’une réorganisation sous le même parent |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Appelé lors d’un déplacement entre niveaux |
| `canDrag` | `(node) => boolean` | — | Détermine les nœuds déplaçables |
| `canDrop` | `(dragged, target, position) => boolean` | — | Détermine les cibles de dépôt autorisées |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Éléments du menu contextuel |
| `onPatch` | `(ops, context) => void` | — | Opérations de correctif RFC 6902 lors d’une réorganisation |
| `maxHeight` | `number \| string` | — | Hauteur maximale avant défilement |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Variante de taille |

### Contrôle impératif (via ref)

| Méthode | Description |
|--------|-------------|
| `expandAll()` | Développe tous les nœuds |
| `collapseAll()` | Replie tous les nœuds |
| `expandToDepth(depth)` | Développe jusqu’à une profondeur donnée |
| `getExpandedIds()` | Obtient les ID des nœuds actuellement développés |
| `getSelectedNode()` | Obtient le nœud sélectionné |
| `scrollToNode(id)` | Fait défiler un nœud dans la zone visible |
| `locateNode(predicate)` | Trouve un nœud, développe ses ancêtres, le sélectionne et le rend visible |

## Utilitaires du noyau

| Fonction | Description |
|----------|-------------|
| `findNode(nodes, id)` | Trouve un nœud par ID |
| `findPath(nodes, id)` | Trouve le chemin complet depuis la racine |
| `getLeaves(nodes)` | Obtient tous les nœuds feuilles |
| `countNodes(nodes)` | Compte tous les nœuds |
| `filterTree(nodes, { query })` | Filtre selon la recherche |
| `flattenTree(nodes)` | Aplatit l’arbre en liste préordonnée |
| `updateNode(nodes, id, updater)` | Met à jour un nœud sans modifier l’original |
| `removeNode(nodes, id)` | Supprime un nœud sans modifier l’original |

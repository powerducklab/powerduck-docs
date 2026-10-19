---
sidebar_position: 4
title: "Referência da API"
description: "Propriedades de Tree, adaptadores, utilitários do núcleo e métodos do controle imperativo."
---

# Referência da API

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

Cria uma árvore de navegação OpenAPI.

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Mostra nós marcados com `x-internal` ou `x-scalar-ignore` quando ativado |
| `showComponents` | `boolean` | `true` | Mostra a seção de componentes |
| `showWebhooks` | `boolean` | `true` | Mostra webhooks |
| `defaultExpandDepth` | `number` | `2` | Profundidade de expansão padrão |

Prioridade de navegação: tags aninhadas nativas do OAS 3.2 → `x-tagGroups` → tags planas.

### `buildSchemaTree(schema, options?)`

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Profundidade máxima de aninhamento |
| `showDeprecated` | `boolean` | `true` | Mostra propriedades obsoletas |
| `expandCombinators` | `boolean` | `true` | Expande oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Expande itens de arrays |

### `buildDocTree(document, options?)`

Árvore de documentação no estilo Stripe em que cada operação se expande para mostrar parâmetros, corpo da requisição e respostas.

## Componente React `<Tree />`

### Propriedades principais

| Propriedade | Tipo | Padrão | Descrição |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | obrigatório | Nós raiz a renderizar |
| `onSelect` | `(node) => void` | — | Chamado quando um nó é selecionado |
| `searchable` | `boolean` | `false` | Mostra o campo de busca |
| `defaultExpandDepth` | `number` | `1` | Profundidade inicial de expansão |
| `showExpandAll` | `boolean` | `false` | Controle para expandir ou recolher tudo |
| `draggable` | `boolean` | `false` | Ativa a reordenação por arrastar e soltar |
| `onReorder` | `(result: ReorderResult) => void` | — | Chamado ao reordenar dentro do mesmo pai |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Chamado ao mover entre níveis |
| `canDrag` | `(node) => boolean` | — | Controla quais nós podem ser arrastados |
| `canDrop` | `(dragged, target, position) => boolean` | — | Controla os destinos de soltura permitidos |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Itens do menu de contexto |
| `onPatch` | `(ops, context) => void` | — | Operações de patch RFC 6902 ao reordenar |
| `maxHeight` | `number \| string` | — | Altura máxima antes de ativar a rolagem |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Variante de tamanho |

### Controle imperativo (via ref)

| Método | Descrição |
|--------|-------------|
| `expandAll()` | Expande todos os nós |
| `collapseAll()` | Recolhe todos os nós |
| `expandToDepth(depth)` | Expande até uma profundidade específica |
| `getExpandedIds()` | Obtém os IDs dos nós expandidos |
| `getSelectedNode()` | Obtém o nó selecionado |
| `scrollToNode(id)` | Rola até um nó ficar visível |
| `locateNode(predicate)` | Encontra um nó, expande seus ancestrais, seleciona-o e o leva à área visível |

## Utilitários do núcleo

| Função | Descrição |
|----------|-------------|
| `findNode(nodes, id)` | Encontra um nó pelo ID |
| `findPath(nodes, id)` | Encontra o caminho completo desde a raiz |
| `getLeaves(nodes)` | Obtém todos os nós folha |
| `countNodes(nodes)` | Conta todos os nós |
| `filterTree(nodes, { query })` | Filtra pela busca |
| `flattenTree(nodes)` | Converte em lista linear em pré-ordem |
| `updateNode(nodes, id, updater)` | Atualiza um nó sem modificar o original |
| `removeNode(nodes, id)` | Remove um nó sem modificar o original |

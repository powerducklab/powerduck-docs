---
sidebar_position: 4
title: "Referência da API"
description: "Propriedades de SchemaEditor, exportações do núcleo e tipos de linguagem do editor."
---

# Referência da API

## `<SchemaEditor />` — Propriedade

| Propriedade | Tipo | Padrão | Descrição |
|------|------|---------|-------------|
| `value` | `string` | obrigatório | Conteúdo do editor |
| `onChange` | `(value: string) => void` | — | Chamado quando o conteúdo muda |
| `language` | `"json" \| "yaml" \| "javascript"` | obrigatório | Linguagem do conteúdo |
| `schema` | `JsonSchema` | — | JSON Schema usado para preenchimento e diagnósticos (json/yaml) |
| `snippets` | `string[]` | — | Strings de trechos para preenchimento com texto fantasma em JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Tema visual |
| `readOnly` | `boolean` | `false` | Desativa a edição |
| `placeholder` | `string` | — | Texto indicativo quando o conteúdo está vazio |
| `showDiagnostics` | `boolean` | `true` | Mostra a barra de status dos diagnósticos |
| `enableInlineSuggestions` | `boolean` | `true` | Ativa o texto fantasma |
| `enableCompletion` | `boolean` | `true` | Ativa o preenchimento em pop-up |
| `diagnosticsDebounceMs` | `number` | `250` | Atraso de debounce dos diagnósticos |

## Exportações do núcleo (`@powerduck/schema-editor`)

| Função | Descrição |
|----------|-------------|
| `resolveSchemas(document)` | Resolve ponteiros `$ref` em um documento de esquema |
| `validateSchema(data, schema)` | Valida dados em relação a um esquema |
| `generateSample(schema)` | Gera dados de exemplo a partir de um JSON Schema |
| `getCompletionItems(model, position)` | Obtém sugestões de preenchimento na posição do cursor |

## Tipos

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```

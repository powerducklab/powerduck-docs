---
sidebar_position: 4
title: "API başvuru kaynağı"
description: "SchemaEditor özellikleri, çekirdek dışa aktarımları ve düzenleyici dil türleri."
---

# API başvuru kaynağı

## `<SchemaEditor />` — Özellik

| Özellik | Tür | Varsayılan | Açıklama |
|------|------|---------|-------------|
| `value` | `string` | gerekli | Düzenleyici içeriği |
| `onChange` | `(value: string) => void` | — | İçerik değiştiğinde çağrılır |
| `language` | `"json" \| "yaml" \| "javascript"` | gerekli | İçeriğin dili |
| `schema` | `JsonSchema` | — | Tamamlama ve tanılama için JSON Schema (json/yaml) |
| `snippets` | `string[]` | — | JavaScript hayalet tamamlama için kod parçacığı dizeleri |
| `theme` | `"light" \| "dark"` | `"light"` | Görsel tema |
| `readOnly` | `boolean` | `false` | Düzenlemeyi devre dışı bırakır |
| `placeholder` | `string` | — | İçerik boşken gösterilen yer tutucu metin |
| `showDiagnostics` | `boolean` | `true` | Tanılama durum çubuğunu gösterir |
| `enableInlineSuggestions` | `boolean` | `true` | Hayalet metni etkinleştirir |
| `enableCompletion` | `boolean` | `true` | Açılır tamamlamayı etkinleştirir |
| `diagnosticsDebounceMs` | `number` | `250` | Tanılama debounce gecikmesi |

## Çekirdek dışa aktarımları (`@powerduck/schema-editor`)

| İşlev | Açıklama |
|----------|-------------|
| `resolveSchemas(document)` | Şema belgesindeki `$ref` işaretçilerini çözümler |
| `validateSchema(data, schema)` | Verileri şemaya göre doğrular |
| `generateSample(schema)` | JSON Schema’dan örnek veri üretir |
| `getCompletionItems(model, position)` | İmleç konumundaki tamamlama öğelerini getirir |

## Türler

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```

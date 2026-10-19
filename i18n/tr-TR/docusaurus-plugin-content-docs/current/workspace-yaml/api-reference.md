---
sidebar_position: 4
title: "API başvuru kaynağı"
description: "Çekirdek ve dosya katmanı işlevleri, seçenekleri ve hata kodları."
---

# API başvuru kaynağı

## Çekirdek katmanı (`@powerduck/workspace-yaml/core`)

| İşlev | Açıklama |
|----------|-------------|
| `createWorkspaceYaml(options?)` | workspace.yaml içerik dizesi üretir |
| `createOpenApiYaml(options)` | OpenAPI 3.2 YAML içerik dizesi üretir |
| `createWorkspaceWithApi(options)` | Çalışma alanı ve OpenAPI içeriğini birlikte üretir |
| `parseWorkspaceYaml(content)` | workspace.yaml dizesini ayrıştırır ve doğrular |

### `createOpenApiYaml(options)` — Seçenek

| Seçenek | Tür | Gerekli | Açıklama |
|--------|------|----------|-------------|
| `title` | `string` | Evet | API başlığı |
| `version` | `string` | Hayır | Varsayılan `"1.0.0"` |
| `description` | `string` | Hayır | API açıklaması |
| `contact` | `{ name?, url?, email? }` | Hayır | İletişim bilgileri |
| `license` | `{ name, url? }` | Hayır | Lisans bilgileri |
| `servers` | `Array<{ url, description? }>` | Hayır | Sunucu listesi |

## Dosya katmanı (`@powerduck/workspace-yaml`)

| İşlev | Açıklama |
|----------|-------------|
| `initializeWorkspace(options)` | Diskte workspace.yaml dosyası oluşturur |
| `initializeOpenApi(options)` | Diskte OpenAPI YAML dosyası oluşturur |
| `createWorkspaceApi(options)` | İki dosyayı atomik olarak oluşturur (hata durumunda geri alır) |

### `createWorkspaceApi(options)` — Seçenek

| Seçenek | Tür | Gerekli | Açıklama |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Evet | Hedef dizin |
| `oasId` | `string` | Evet | Benzersiz API tanımlayıcısı |
| `name` | `string` | Evet | Görünen ad |
| `file` | `string` | Hayır | Göreli yol (varsayılan: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Hayır | API başlığı (varsayılan: `name`) |
| `version` | `string` | Hayır | API sürümü (varsayılan: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Hayır | Varsayılan `false` |

## Hatalar

Tüm hatalar, makine tarafından okunabilir `code` içeren `WorkspaceYamlError` örnekleridir:

| Kod | Açıklama |
|------|-------------|
| `INVALID_ARGUMENT` | Geçersiz girdi parametresi |
| `ALREADY_EXISTS` | Dosya zaten var ve üzerine yazma false |
| `NOT_FOUND` | Dosya bulunamadı |
| `IO_ERROR` | Dosya sistemi işlemi başarısız |
| `INVALID_WORKSPACE` | Geçersiz çalışma alanı yapılandırması |
| `INVALID_OPENAPI` | Geçersiz OpenAPI belgesi |
| `ROLLBACK_FAILED` | İşlemi geri alma başarısız |

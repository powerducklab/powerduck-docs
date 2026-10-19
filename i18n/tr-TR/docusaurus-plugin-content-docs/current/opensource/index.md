---
sidebar_position: 1
title: "Açık kaynak kitaplıkları"
description: "@powerduck/* npm paketleri masaüstü istemcisinin ve Cloud’un temelidir: ayrıştırma, yükseltme, çok protokollü CLI, kod üretimi, MCP, istek çalıştırma, dönüştürme ve gömülebilir düzenleyiciler."
---

# Açık kaynak kitaplıkları

Powerduck, küçük ve birleştirilebilir npm paketlerinden oluşur. Masaüstü istemcisi ve bulut hizmeti aynı kitaplıkları kullanır; böylece aynı bileşenler yerel olarak, ağ üzerinden veya kendi araçlarınızın içinde çalışır.

Her paket bağımsız yayımlanır; kendi kurulum açıklaması, API başvurusu ve örnekleri vardır. Bu sayfa paketlerin görevlerini ve birbirleriyle ilişkilerini açıklar.

## Katman yapısı

```text
Powerduck / Cloud
        ↓
Gömülebilir arayüzler
        ↓
İş akışları
        ↓
Temel
```

Ayrıştırıcı ve dönüştürücüler temeli oluşturur. İş akışları bunların üzerine kurulur; gömülebilir arayüzler en üstte yer alır. Her pakette ayrıştırmayı yeniden uygulamak yerine ortak temel kullanmak davranışı tutarlı kılar.

## Paketler

### Temel

| Paket | Amaç |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | OpenAPI/Swagger belgelerini ayrıştırma, doğrulama ve yükseltme |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Yapılandırılmış ve doğrulanmış yapılandırma yamalarını uygulama |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | cURL ve Postman gibi biçimleri OpenAPI’ye dönüştürme |

### İş akışları

| Paket | Amaç |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Senaryo çalıştırma dahil çok protokollü komut satırı iş akışları |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Belirtimden istemci kodu ve diğer çıktıları üretme |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | OpenAPI belirtimini MCP sunucusu olarak sunma |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Belirtimde açıklanan istekleri çalıştırma |

### Gömülebilir arayüzler

| Paket | Amaç |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | React giriş noktası dahil, OpenAPI’yi okunabilir belge olarak görüntüleme |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Gömülebilir Markdown düzenleyicisi |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Gömülebilir JSON Schema düzenleyicisi |
| [`@powerduck/tree`](../tree/introduction.md) | Yapılandırılmış veriler için ağaç bileşeni |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Çalışma alanı YAML entegrasyonu |

## Doğru paketi seçme

- **OpenAPI dosyasını okuma, doğrulama veya yükseltme:** `openapi-parser` ile başlayın.
- **cURL veya Postman koleksiyonunu OpenAPI’ye dönüştürme:** `x-to-openapi` kullanın.
- **Komut satırı veya CI üzerinden senaryo ya da çok protokollü iş akışı çalıştırma:** `openapi-cli` kullanın.
- **İstemci kodu üretme:** `openapi-codegen` kullanın.
- **API’yi yapay zekâ ajanına araç olarak sunma:** `openapi-mcp-server` kullanın.
- **Oluşturulan belgeleri React uygulamasına gömme:** `oas-document` paketinin React giriş noktasını ve CSS’ini kullanın.
- **Düzenleyici gömme:** `md-editor` veya `schema-editor` kullanın.

## Yetenekleri ajanlarla paylaşma

MCP sunucu paketi, harici yapay zekâ ajanlarının Powerduck yeteneklerini kullanmasını da sağlar. `openapi-mcp-server` üzerinden sunulan belirtim, işlemlerini MCP araçları olarak açar. Böylece belgeleri ve kod üretimini yönlendiren aynı sözleşme doğrudan ajan tarafından çağrılabilir. Masaüstü istemcisi, Cloud ve diğer MCP uyumlu araçlar aynı temel tanımı paylaşır.

## Örnekler hakkında

Kod örnekleri paketin gerçek API’sine göre yazılmıştır ve gösterildiği biçimde çalıştırılmak üzere hazırlanır. Paket yükseltildiğinde eski sürümlerin kodunu kopyalamak yerine güncel parametreler için sürüm notlarına bakın.

Her paketin kurulumu, yapılandırması ve tam API başvurusu için kenar çubuğunu kullanın.

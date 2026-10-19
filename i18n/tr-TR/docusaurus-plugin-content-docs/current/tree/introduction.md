---
sidebar_position: 1
title: "Giriş"
description: "API gezinmesi, şema inceleme ve belgelendirme için genişletilebilir ağaç bileşeni. OpenAPI, JSON Schema ve özel veri kaynakları için bağdaştırıcılar içeren genel amaçlı bir çekirdek üzerine kuruludur."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

API gezinmesi, şema inceleme ve belgelendirme için genişletilebilir ağaç bileşeni. OpenAPI, JSON Schema ve özel veri kaynakları için bağdaştırıcılar içeren genel amaçlı bir çekirdek üzerine kuruludur.

- **Paket adı:** `@powerduck/tree`
- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Lisans:** MIT

## Özellikler

- **Genel amaçlı çekirdek** — `TreeNode<TMetadata>` herhangi bir veri kaynağıyla çalışır
- **OpenAPI bağdaştırıcısı** — OAS 3.2 iç içe etiketleri, `x-tagGroups`, `x-order`, `x-displayName` ve `x-internal` ile etiket tabanlı gezinme
- **JSON Schema bağdaştırıcısı** — İç içe özellikleri, dizileri ve birleştiricileri `jsonPath` meta verisiyle derinlemesine genişletme
- **Belge bağdaştırıcısı** — İşlem sayısı rozetleriyle Stripe tarzı belge ağacı
- **React bileşeni** — Arama, genişletme/daraltma, klavye gezinmesi, yöntem rozetleri ve özel render props
- **Sürükle ve bırak** — Aynı üst öğe altında yeniden sıralama ve farklı düzeylerdeki klasörlere taşıma
- **Bağlam menüsü** — Sağ tıklama veya diğer seçenekler düğmesiyle düğüme özel işlemler
- **Komutla konum bulma** — `locateNode(predicate)` düğümü bulur, üst düğümlerini genişletir, seçer ve görünür alana kaydırır
- **JSON Patch entegrasyonu** — `onPatch` geri çağrısı RFC 6902 işlemleri üretir
- **CSS değişkenleriyle tema** — Powerduck `tokens.css` ile uyumlu, açık ve koyu mod desteği

## Sonraki adımlar

- [Kurulum](/docs/tr-TR/tree/installation/)
- [Hızlı başlangıç](/docs/tr-TR/tree/quickstart/)
- [API başvuru kaynağı](/docs/tr-TR/tree/api-reference/)
- [Örnekler](/docs/tr-TR/tree/examples/)

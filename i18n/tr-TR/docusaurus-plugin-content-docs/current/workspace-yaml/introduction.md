---
sidebar_position: 1
title: "Giriş"
description: "workspace.yaml ve OpenAPI 3.2 YAML dosyalarını güvenilir biçimde oluşturun. Tarayıcıda güvenle çalışır: saf işlevler dosya sistemine erişmeden YAML içeriği dizeleri üretir. Node.js / Electron ortamında çekirdek katmanına atomik yazma, dosya kilitleme ve yol normalleştirme ekler."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

workspace.yaml ve OpenAPI 3.2 YAML dosyalarını güvenilir biçimde oluşturun.

İki katmanlı mimari:
- **Çekirdek katmanı**: Tarayıcıda güvenle çalışır: saf işlevler dosya sistemine erişmeden YAML içeriği dizeleri üretir.
- **Dosya katmanı**: Node.js / Electron ortamında çekirdek katmanına atomik yazma, dosya kilitleme ve yol normalleştirme ekler.

- **Paket adı:** `@powerduck/workspace-yaml`
- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Lisans:** MIT

Bu kitaplık **yalnızca dosyaları ilk kez oluşturur**; yeni dosya oluşturma veya elle oluşturma senaryoları içindir. YAML dosyalarını okuma, yamalama ya da güncelleme işlevlerini yeniden **uygulamaz**. Bu işlemler için şu paketi kullanın: [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Sonraki adımlar

- [Kurulum](/docs/tr-TR/workspace-yaml/installation/)
- [Hızlı başlangıç](/docs/tr-TR/workspace-yaml/quickstart/)
- [API başvuru kaynağı](/docs/tr-TR/workspace-yaml/api-reference/)
- [Örnekler](/docs/tr-TR/workspace-yaml/examples/)

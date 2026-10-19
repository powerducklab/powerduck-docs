---
sidebar_position: 4
title: "Senaryo testleri ve raporlar"
description: "Tek istek, tek çağrıyı doğrular. **Senaryo testi** ise bir iş akışını sınar: bir yanıtın değerinin sonraki istekte kullanıldığı, her adımda doğrulamaların yapıldığı sıralı bir istek dizisi. Senaryolar, aksi hâlde yalnızca geliştiricinin zihninde kalabilecek uçtan uca akışları kayda geçirir."
---

# Senaryo testleri ve raporlar

Tek istek, tek çağrıyı doğrular. **Senaryo testi** ise bir iş akışını sınar: bir yanıtın değerinin sonraki istekte kullanıldığı, her adımda doğrulamaların yapıldığı sıralı bir istek dizisi. Senaryolar, aksi hâlde yalnızca geliştiricinin zihninde kalabilecek uçtan uca akışları kayda geçirir.

## Senaryonun içeriği

- Her biri belirtimdeki bir işleme başvuran **sıralı adımlar**;
- Adımlar arasında **veri aktarımı**; örneğin oluşturulan kaynağın `id` değerini sonraki istekte kullanma;
- Durum kodları, üstbilgiler veya yanıt alanları üzerinde **doğrulamalar**;
- Kullanıcının çalıştırmadan önce sağlaması gereken değerler.

Sıra ve doğrulamalar temel unsurlardır; yürütme sırasında sessizce atılmazlar.

## Senaryo çalıştırma

Senaryolar, ana süreçte `@powerduck/openapi-cli` paketinin `runScenario` motoruyla yürütülür:

- `scenario:run`, senaryo, belirtim ve istek yapılandırmasıyla çalıştırmayı başlatır;
- Adımlar yürütülürken ilerleme `scenario:event` üzerinden aktarılır;
- `scenario:cancel`, çalışan işi durdurur.

Her adımı izleyebilir, akışın nerede başarısız olduğunu görebilir ve uzun süren bir çalıştırmayı iptal edebilirsiniz.

## Asistan senaryoyu nasıl oluşturur?

Asistan belirtimin içine test tanımları uydurmaz. Senaryolar, uygulamanın ayrı bir iş akışıdır ve **OpenAPI belgesine hiçbir zaman kaydedilmez**; `x-scenarios` anahtarı veya gömülü adımlar bulunmaz.

Uç noktaları tasarlamayı ve test etmeyi birlikte istediğinizde iş sıralı yürütülür:

1. Asistan önce **yalnızca uç nokta yamalarını** önerir;
2. Yamaları uyguladıktan sonra akışı çalıştırmak için bir **eylem kartı** sunar:
   - Tek uç nokta için `test.single`;
   - Uygulamanın uçtan uca akışları keşfetmesi için `scenario.plan`;
   - Sıralı akışı hazırlayıp çalıştırmak için `scenario.run`.

Bir `scenario.run` kartı, iki ila sekiz işlemi yürütme sırasıyla listeler ve hedefi açıklar; hangi yanıt alanının, üstbilginin veya durumun sonraki isteğe aktarılacağını belirtir. Her başvuru geçerli belirtimden aynen alınır.

## Raporlar

Çalıştırmadan sonra **bağımsız bir HTML raporu** dışa aktarabilirsiniz. Bu, ham CLI çıktısı değil bir özet belgesidir: akışı, adım sonuçlarını, doğrulamaları ve genel sonucu okunabilir bir düzende sunar.

Dışa aktarırken dil seçin. On yerleşik dil vardır:

1. English (İngilizce)
2. 简体中文 (Basitleştirilmiş Çince)
3. 繁體中文 (Geleneksel Çince)
4. 日本語 (Japonca)
5. 한국어 (Korece)
6. Français (Fransızca)
7. Deutsch (Almanca)
8. Español (İspanyolca)
9. Português — Brasil (Brezilya Portekizcesi)
10. العربية (Arapça)

**Diğer/özel** seçeneği başka bir dil girmenizi sağlar; ancak çeviri yoksa raporun yerleşik etiketleri İngilizceye döner. Dil girmek raporu otomatik olarak çevirmez.

Dışa aktarılan raporu paylaşmadan önce inceleyin:

- **Bilinen kimlik bilgisi alanları otomatik olarak gizlenir.** Serbest içerikler, URL'ler ve özel alanlar yine de hassas veri içerebilir; paylaşmadan önce bunları inceleyip kaldırın;
- **Büyük içerikler katlanır** ve böylece okunabilirlik korunur. Bir bölümü kapatmak, verilerini dışa aktarılan HTML'den kaldırmaz.

HTML dosyası bağımsızdır; bir iş kaydına eklenebilir veya sürümle birlikte arşivlenebilir.

## Senaryolar ne zaman kullanılmalı?

- Oluşturma, okuma, güncelleme ve silme gibi çok adımlı iş akışlarını doğrularken;
- Kimlik doğrulama ve belirteç aktarımının çağrılar arasında çalıştığını kontrol ederken;
- Sürüm veya iş devri için API davranışına ilişkin kanıt üretirken;
- Sözleşme değişikliğinden sonra akışı regresyon testinden geçirirken.

İlgili: [İstek çalışma alanı](./debug.md), [Asistanla tasarım](./design.md), [Mock sunucusu](./mock-server.md).

---
sidebar_position: 5
title: "Özellikler"
description: "Bu sayfa, yerleşik özellikleri kaynak koddaki gerçek uygulamalarıyla açıklar."
---

# Özellikler

Bu sayfa, yerleşik özellikleri kaynak koddaki gerçek uygulamalarıyla açıklar.

## Artımlı oluşturma

Önizleme, büyük belgelerde hızlı yanıt verebilmek için blok düzeyinde artımlı oluşturma kullanır:

- **Bloklara ayırma** (`splitIntoBlocks`): kaynak, ATX başlık satırlarında (`#` ile `######` arasında) bloklara ayrılır. Ters tırnak veya tilde ile çevrili kod bloklarının içeriği bölme noktası sayılmaz; `:::` özel kapsayıcılarındaki başlıklar da korunur. Başlıksız belgeler tek blok olarak işlenir.
- **Blok bazında oluşturma**: yalnızca içerik özeti değişen bloklar markdown-it / KaTeX ile yeniden işlenir. Değişmeyen bloklar, etkileşimli hâle getirilmiş zihin haritası SVG'leri de dâhil olmak üzere mevcut DOM düğümlerini doğrudan kullanır.
- **İçerik özeti önbelleği**: oluşturma sonuçları içerik özetine göre (djb2 benzeri hızlı bir özet ve uzunluk) saklanır; böylece geri alma/yineleme ve aynı paragrafların kopyalanması da önbellekten yararlanır. Önbellek 800 girdiyi aşınca artık belgede bulunmayan özetler kaldırılır. Mevcut blokların girdileri korunduğundan 800'den fazla farklı blok içeren belgeler bu eşiği aşabilir.
- **Yeniden sıralama**: sırası değişen bloklar, mevcut düğümler bir `DocumentFragment` içine eklenerek taşınır.
- **Uyarlanabilir geciktirme** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): oluşturma öncesi bekleme süresi `base + floor(docLength / 20000) * 60` olup `max` ile sınırlanır. `renderDebounce` ile değiştirin veya eşzamanlı oluşturma için `renderDebounce: false` kullanın.
- **`content-visibility: auto`**: her blok bir `.md-editor-block` öğesiyle sarılır; böylece ekran dışındaki blokların yerleşim ve çizim işlemleri atlanır.

Bir bloğun oluşturulamaması tüm önizlemeyi boşaltmaz; bunun yerine o bloğun kaynağı kaçış uygulanmış bir `<pre>` içinde gösterilir.

## KaTeX formülleri

Bağımsız markdown-it matematik eklentisi formülleri KaTeX ile oluşturur (`markdown-it-texmath` bağımlılığı yoktur):

- **Satır içi formül**: `$E=mc^2$` — içerik boş olamaz, `$` veya satır sonu içeremez. `$5` ya da `$10.50` gibi para tutarına benzeyen ifadeler sezgisel olarak dışlanır.
- **Blok formül**:
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Tek satırlı (`$$ ... $$`) ve çok satırlı biçimler desteklenir. KaTeX CSS'i pakete dâhildir. `math: false` ile devre dışı bırakın.

## Markmap zihin haritaları

Gövdesi Markdown taslağı olan bir ```` ```mindmap ```` kod bloğu yazın:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

Blok kuralı, iç içe kod bloklarını korumak için sınırlayıcıların iç içe geçme derinliğini izler. Eşzamanlı oluşturma bir `<div>` yer tutucusu üretir; `Renderer.hydrate(container)`, `markmap-lib` ve `markmap-view` modüllerini asenkron yükleyerek her yer tutucuyu etkileşimli SVG'ye dönüştürür. Etkileşimli hâle getirme hataları işlemi durdurmaz. `mindmap: false` ile devre dışı bırakın.

## Kopyalama düğmeli kod vurgulama

Sınırlayıcılarla çevrili kod blokları highlight.js ile vurgulanır. Derleme sabit bir dil kümesi kaydeder: JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C ve C++ (`js`, `ts`, `py`, `sh`, `yml`, `md`, `rs`, `c++` gibi yaygın takma adlarıyla birlikte). Bilinmeyen diller otomatik algılanır; algılama başarısızsa kaçış uygulanmış düz metin kullanılır.

Vurgulanan her blok; trafik ışığı noktaları, dil etiketi ve **Kopyala** düğmesi bulunan macOS tarzı bir kapsayıcıya alınır. Kopyalama düğmesi, önizleme panelinde olay delegasyonu kullanır ve Clipboard API yoksa `document.execCommand('copy')` yöntemine başvurur. `codeHighlight: false` ile devre dışı bırakın.

## Araç çubuğu eylemleri {#toolbar-actions}

`complex` modunda araç çubuğu, aşağıdaki 22 eylemden varsayılan sırayla oluşturulur:

| # | Eylem adı | İşlev |
|---|-------------|---------------|
| 1 | `heading` | Başlık |
| 2 | `bold` | Kalın (Ctrl+B) |
| 3 | `italic` | İtalik (Ctrl+I) |
| 4 | `link` | Bağlantı (Ctrl+K) |
| 5 | `image` | Görsel ekle |
| 6 | `video` | Video ekle |
| 7 | `youtube` | YouTube videosu ekle |
| 8 | `quote` | Alıntı |
| 9 | `ul` | Sırasız liste |
| 10 | `ol` | Sıralı liste |
| 11 | `tasklist` | Görev listesi |
| 12 | `mention` | Bahsetme (@) |
| 13 | `doclink` | Belge bağlantısı ekle |
| 14 | `code` | Kod bloğu |
| 15 | `table` | Tablo |
| 16 | `math` | Matematik formülü |
| 17 | `mindmap` | Zihin haritası ekle |
| 18 | `hr` | Yatay çizgi |
| 19 | `tips` | Bilgi kutusu ekle |
| 20 | `preview` | Önizlemeyi aç/kapat |
| 21 | `help` | Klavye kısayolları |
| 22 | `theme` | Temayı değiştir |

Yerleşik etiketler İngilizcedir. Araç ipuçlarını ve erişilebilir adları yerelleştirmek için öğelerin `label` değerini değiştirin. Bazı eylemler iletişim kutusu veya şablon seçici açar: görsel, video, YouTube, tablo, formül (şablonlar), zihin haritası (şablonlar), bilgi kutusu (tür ızgarası) ve yardım. Araç çubuğunu [Yapılandırma](./configuration.md#toolbarconfig) bölümünde açıklandığı gibi `toolbar` seçeneğiyle ayarlayın.

## Klavye kısayolları

Yerleşik kısayollar `DEFAULT_SHORTCUTS` içinde tanımlıdır. `Mod`, Windows/Linux'ta Ctrl, macOS'ta Cmd anlamına gelir.

| Tuş | Eylem | Açıklama |
|-----|--------|-------------|
| `Mod-b` | `bold` | Kalın |
| `Mod-i` | `italic` | İtalik |
| `Mod-Alt-1` | `heading` | Başlık |
| `Mod-k` | `link` | Bağlantı ekle |
| `Mod-Alt-c` | `code` | Kod bloğu |
| `Mod-Shift-.` | `quote` | Blok alıntı |
| `Mod-Shift-8` | `ul` | Sırasız liste |
| `Mod-Shift-7` | `ol` | Sıralı liste |
| `Mod-Shift-9` | `tasklist` | Görev listesi |
| `Mod-Alt-m` | `math` | Matematik formülü |
| `Mod-Alt-p` | `preview` | Önizlemeyi aç/kapat |
| `Mod-Shift-l` | `theme` | Temayı değiştir |

Araç çubuğundaki **Yardım** düğmesi, kısayolları tuş görünümleriyle listeleyen bir iletişim kutusu açar. Burada görev listeleri, bahsetmeler, belge bağlantıları, formüller, zihin haritaları ve bilgi kutuları için kısa bir başvuru bölümü de bulunur.

## Görsel yükleme

`onImageUpload: (file: File) => Promise<string>` sağlayın. Bu kanca, bir görsel dosyası düzenleyiciye yapıştırıldığında veya sürüklendiğinde çağrılır. Görsel penceresi URL kabul eder; dosya seçimi sunmaz. Herkese açık görsel URL'sini döndürün; düzenleyici imleç konumuna `![alt](url)` ekler (alternatif metin olarak uzantısız dosya adını kullanır). Yükleme hataları sessizce yutulur; kullanıcı yeniden deneyebilir.

## @mention

Kullanıcı `@` yazdığında aranabilir açılır listeyi etkinleştirmek için `mention` seçeneği verin:

- `onMentionSearch(query)`, eşleşen `MentionItem` öğelerini döndürür.
- `onMentionSelect(item)`, eklenecek metni döndürür. Varsayılan değer, oluşturucunun biçimlendirilmiş bir rozete dönüştürdüğü `[@label](mention:id)` ifadesidir.
- `minChars` (varsayılan `0`) ve `maxItems` (varsayılan `8`) açılır listeyi ayarlar.

Açılır liste ArrowUp/ArrowDown, Enter/Tab ve Escape ile gezintiyi destekler; düzenleyici odağı kaybettiğinde kapanır. Önizlemede `@media` gibi düz `@` metinleri rozet olmaz; yalnızca `mention:` şemasını kullanan bağlantılar rozete dönüşür. Düzenleyicide ise yapılandırılmış arama kancası bu metinlerle de tetiklenebilir.

## Belge bağlantıları

Tetikleyici karakterden (varsayılan `/`) sonra belge arama listesini açmak için `docLink` seçeneği verin:

- `onDocSearch(query)`, eşleşen `DocItem` öğelerini döndürür.
- `onFetchDocMeta(url)`, başlığı, küçük resmi ve açıklamayı getirir. Yerleşik uygulama Open Graph etiketlerini okumak için `fetch` + `DOMParser` kullanır; farklı kökendeki sunucu CORS'a izin vermiyorsa başarısız olabilir. Gerektiğinde kendi arka uç vekilinizi kullanın.
- `insertStyle` ekleme biçimini belirler: `'auto'` (meta veri varsa kart), `'card'` veya `'link'`.

Seçilen belge, düz bağlantı ya da başlığı, küçük resmi, açıklamayı ve ana makine adını tıklanabilir bir önizlemede gösteren `:::doc-link` kartı olarak eklenir.

## Uyarı / bilgi kutusu blokları

Altı türden biriyle bir `:::` kapsayıcısı yazın. Açılış satırında türden sonra isteğe bağlı bir başlık gelebilir:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Desteklenen türler: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Her biri simge, renkli sol kenarlık ve başlıkla gösterilir. Araç çubuğundaki bilgi kutusu düğmesi altı tür için görsel seçici açar. `tips: false` ile devre dışı bırakın.

## Görev listeleri

`- [ ]` veya `- [x]` ile eşleşen liste öğeleri (köşeli parantezlerde serbest boşluk kullanılabilir) devre dışı onay kutuları olarak gösterilir. Projenin kuralına dikkat edin: **`- [ ]` işaretli (yeşil), `- [x]` ise işaretsiz gösterilir** — GitHub Flavored Markdown'ın tersidir. Araç çubuğundaki görev listesi düğmesi, geçerli veya seçili satırların işaretlerini değiştirir.

## Sonraki adımlar

- [Yapılandırma](./configuration.md) — özellikleri seçeneklerle ayarlayın.
- [API başvurusu](./api-reference.md) — düzenleyiciyi program aracılığıyla yönetin.

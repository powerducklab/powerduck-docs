---
sidebar_position: 1
title: "Giriş"
description: "@powerduck/md-editor, tarayıcıya gömülebilen yüksek performanslı bir Markdown düzenleyicisidir. CodeMirror 6 düzenleme alanını markdown-it ile oluşturulan canlı önizlemeyle birleştirir. KaTeX formülleri, Markmap zihin haritaları, kod vurgulama, bilgi kutuları, yapılandırılabilir araç çubuğu, klavye kısayolları, görsel yükleme kancaları, @bahsetmeler ve belge bağlantısı ekleme özellikleri sunar."
---

# Giriş

`@powerduck/md-editor`, tarayıcıya gömülebilen yüksek performanslı bir Markdown düzenleyicisidir. [CodeMirror 6](https://codemirror.net) düzenleme alanını [markdown-it](https://github.com/markdown-it/markdown-it) ile oluşturulan canlı önizlemeyle birleştirir. KaTeX formülleri, Markmap zihin haritaları, kod vurgulama, bilgi kutuları, yapılandırılabilir araç çubuğu, klavye kısayolları, görsel yükleme kancaları, @bahsetmeler ve belge bağlantısı ekleme özellikleri sunar.

- **Paket adı:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Lisans:** MIT
- **Modül biçimi:** ECMAScript modülü (`type: "module"`); ESM (`dist/index.mjs`) ve CJS (`dist/index.cjs`) derlemeleri ile tür bildirimleri (`dist/index.d.ts`) birlikte sunulur.

## Temel özellikler

Aşağıdaki özellikler, uygulanmış kaynak modüllerine dayanır:

- **Markdown düzenleme:** CodeMirror 6 ile Markdown söz dizimi vurgulama ve açık/koyu vurgulama temaları.
- **KaTeX formülleri:** bağımsız bir markdown-it eklentisiyle satır içinde `$...$`, blok olarak `$$...$$`. `$5` gibi para değerleri sezgisel kurallarla formül ayrıştırmasının dışında tutulur.
- **Markmap zihin haritaları:** ```` ```mindmap ```` kod bloklarından oluşturulur. markmap-lib ve markmap-view dinamik olarak içe aktarıldığından zihin haritası yoksa başlangıç paketini büyütmez.
- **Kod vurgulama:** highlight.js, macOS tarzı üç renkli nokta içeren başlık, dil etiketi ve tek tıklamayla kopyalama düğmesi.
- **Bilgi kutuları:** `:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger` için simgeler ve uygun renkler.
- **GitHub tarzı önizleme:** `github-markdown-css` kullanır.
- **Kapsamlı araç çubuğu:** 22 eylem; görsel, video, YouTube ve tablo ekleme pencereleri; formül ve zihin haritası şablon seçicileri; tüm kısayolları listeleyen yardım penceresi.
- **Klavye kısayolları:** `Mod`, Windows/Linux'ta Ctrl, macOS'te Cmd tuşuna karşılık gelir.
- **Yapılandırılabilir araç çubuğu:** gösterilecek öğelerin dizisi veya öğe bazında ayarlar (`show`, `label`, `icon`) ile düzenlenir.
- **Görsel yükleme kancası:** `onImageUpload`, düzenleyiciye görsel yapıştırıldığında veya sürüklenip bırakıldığında çağrılır.
- **@Bahsetme açılır listesi:** `mention` seçenekleriyle yapılandırılır; seçilen bahsetmeler önizlemede biçimlendirilmiş rozetler olarak görünür.
- **Belge bağlantısı ekleme:** `docLink` ile yapılandırılır; düz bağlantılar veya `:::doc-link` önizleme kartları ekler. Meta veriler yerleşik yükleyici ya da özel bir kancayla alınır; farklı kaynaklara yapılan istekler tarayıcının CORS kurallarına tabidir.
- **Video gösterimi:** URL'si `.mp4`, `.webm`, `.ogg` veya bilinen diğer uzantılarla biten görsel söz dizimi, `<video controls>` öğesi olarak oluşturulur.
- **Bağımsız oluşturucu:** `renderMarkdown(source, options)`, düzenleyici bağlamadan önizlemeyle aynı eklenti ve stilleri kullanarak HTML üretir.
- **Blok düzeyinde artımlı oluşturma:** kaynak ATX başlıklarında bloklara ayrılır ve yalnızca değişen bloklar yeniden oluşturulur. Diğer bloklar, önceden başlatılmış zihin haritası SVG'leri dahil mevcut DOM düğümlerini yeniden kullanır. Sonuçlar içerik karmasına göre önbelleğe alınır.
- **Uyarlanabilir geciktirme:** önizleme güncelleme gecikmesi belge uzunluğuna göre 120 ms'den en fazla 600 ms'ye kadar değişir.
- **İki düzenleme modu:** `simple` (araç çubuğu olmadan düzenleme ve önizleme) ve `complex` (araç ve durum çubukları); çalışma sırasında değiştirilebilir.
- **İki tema:** `light` ve `dark`, `data-theme` özniteliği ve özel CSS özellikleriyle uygulanır.

## Mimariye genel bakış

Kitaplık iki arayüz sunar:

1. **Saf JavaScript sınıfı** — ana API, bir kapsayıcı öğeyle oluşturulan `MarkdownEditor` sınıfını temel alır. `CodeEditor` (CodeMirror sarmalayıcısı), `Renderer` (markdown-it sarmalayıcısı), önizleme için `IncrementalRenderer` ve `complex` modunda `Toolbar` ile `StatusBar` bileşenlerini birleştirir. Açılır pencereler, @bahsetme denetleyicisi ve belge bağlantısı denetleyicisi gerektiğinde bağlanan modüllerdir.

2. **Alt yol üzerinden React dışa aktarımı** — `MarkdownEditorReact`, `./react` yolundan dışa aktarılan bir `forwardRef` bileşenidir. Saf `MarkdownEditor` örneğini sarar, kontrollü ve kontrolsüz `value` kullanımını destekler ve ref üzerinden komut tabanlı bir `MarkdownEditorHandle` sunar. React giriş noktası ayrıdır; React kullanmayan projeler `react` ve `react-dom` kurmak zorunda kalmaz.

Oluşturma, zihin haritaları için yer tutucu HTML üreten senkron markdown-it aşaması ile bunları etkileşimli SVG diyagramlarına dönüştüren asenkron `Renderer.hydrate` aşamasından oluşur. `renderMarkdown` senkron HTML döndürür. Zihin haritası SVG'leri için `Renderer.render` kullanın, HTML'yi DOM'a ekleyin ve ardından `Renderer.hydrate` çağırın. Artımlı oluşturucu doğrudan önizleme kapsayıcısında çalışır.

## Tarayıcı desteği

Kitaplık, DOM içeren modern tarayıcıları hedefler. CodeMirror 6, KaTeX ve markmap-view tarayıcı özellikleri değil, paket bağımlılıklarıdır; etkileşimli zihin haritaları `ResizeObserver` kullanır. Kullanılabiliyorsa Clipboard API tercih edilir. Örneğin HTTPS dışındaki ortamlarda `navigator.clipboard` yoksa kod bloklarını kopyalamak için `document.execCommand('copy')` kullanılır. Zihin haritası modülü, yalnızca genel `ResizeObserver` tanımsız olduğunda boş bir uygulama ekleyerek içe aktarma hatasını önler; bu uygulama gerçek boyut değişikliği bildirimleri sağlamaz.

## Lisans

`@powerduck/md-editor`, **MIT** lisansıyla yayımlanır.

## Sonraki adımlar

- [Kurulum](./installation.md) — paketi kurun ve içe aktarma yollarını öğrenin.
- [Hızlı başlangıç](./quickstart.md) — ilk düzenleyicinizi saf JavaScript veya React ile bağlayın.
- [Yapılandırma](./configuration.md) — tüm `MarkdownEditorOptions` seçenekleri.
- [Özellikler](./features.md) — yerleşik özelliklerin ayrıntıları.
- [API başvurusu](./api-reference.md) — dışa aktarılan tüm sınıflar, işlevler ve türler.
- [Örnekler](./examples.md) — eksiksiz, çalıştırılabilir kod örnekleri.

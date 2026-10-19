---
sidebar_position: 9
title: "Ayarlar"
description: "Masaüstü ayarları, uygulamanın görünümünü ve istek gönderme biçimini belirler. Uygulama tercihleri API belgesi değişikliklerinden ayrıdır; tema değiştirmek veya proxy ayarlamak sözleşmeyi değiştirmez."
---

# Ayarlar

Masaüstü ayarları, uygulamanın görünümünü ve istek gönderme biçimini belirler. Uygulama tercihleri API belgesi değişikliklerinden ayrıdır; tema değiştirmek veya proxy ayarlamak sözleşmeyi değiştirmez.

## Görünüm

- **Tema** — açık ve koyu arasında geçiş yapın (`theme.get`, `theme.set`). Seçim tüm uygulamaya uygulanır ve kaydedilir.
- **Arayüz dili** — on altı dilden birini seçin veya sistem dilini otomatik izleyin:

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | Italiano | Русский |
| हिन्दी | Bahasa Indonesia | Tiếng Việt |
| Türkçe | | |

Arapça sağdan sola gösterilir. `auto` seçimi sistem dilini izler.

## İstek davranışı

Bu ayarlar İstek çalışma alanı ve senaryolardan gönderilen istekleri denetler:

- **İstek zaman aşımı** (`requestTimeoutMs`) — milisaniye cinsindendir; `0` sınırsız demektir;
- **Katı SSL** (`strictSSL`) — TLS sertifikalarını doğrular; kendinden imzalı veya güvenilmeyen sertifikalarla çalışmak için kapatılabilir;
- **Yönlendirmeleri izle** (`followRedirects`) ve **en fazla yönlendirme** (`maxRedirects`);
- **HTTP sürümü** (`protocolVersion`) — `http1`, `http2` veya `auto`;
- **Çerezleri kapat** (`disableCookies`) — isteklerde çerez işlemeyi kapatır.

## Proxy

Giden proxy için bir mod seçin (`off`, `system` veya `custom`):

- `off` — proxy kullanma;
- `system` — işletim sisteminin proxy ayarını izle;
- `custom` — proxy URL'si kullan; isteğe bağlı kullanıcı adı, parola ve istisna listesi belirle.

İstisna listesi, `localhost,127.0.0.1` gibi sunucuları ve joker karakterli kalıpları kabul eder. Proxy parolaları yazılabilir ancak geri okunmaz; boş değer yazmak parolayı temizler.

## TLS ve istemci sertifikaları

Özel güven zinciri veya karşılıklı TLS kullanan ortamlar için:

- **Özel CA** — CA sertifikasını etkinleştirip yolunu belirtin; istekler kurum içi veya kendinden imzalı köke güvensin;
- **İstemci sertifikaları (mTLS)** — sunucuya göre sertifika/anahtar çifti veya PFX dosyası yapılandırın; isteğe bağlı parola ekleyin. Sertifikanın kapsamını sunucu ve port belirler.

Sertifika eklenebilir, kimliğe göre kaldırılabilir veya tümü temizlenebilir. Sertifika parolaları yalnızca yazılır, geri döndürülmez.

## Tümleşik terminal

Uygulamanın alt kısmında terminal paneli bulunur:

- `terminal.open` paneli açar; etkin belgenin klasöründe açmak için `{"cwd":"document"}` gönderin. Uygulama bunu gerçek mutlak yola çözümler;
- `terminal.run`, onay kartından sonra açıkça belirtilen bir kabuk komutunu yazar ve çalıştırır.

Komutlar yalnızca açık isteğiniz üzerine yürütülür; paneli açmak hiçbir komut çalıştırmaz.

## Dosya ve sistem eylemleri

- `shell.revealFile` — etkin belgeyi veya belirtilen yolu sistem dosya yöneticisinde gösterir;
- `shell.openPath` — belgeyi varsayılan uygulamasıyla açar;
- `shell.openExternal` — üçüncü taraf sayfasını sistem tarayıcısında açar.

Resmî Powerduck sayfaları, uygulamadan çıkmak yerine sohbette kart gösteren özel bağlantı aracını (`app.officialLink`) kullanır.

## İstemci kodu örnekleri

Asistan, herhangi bir işlem için çalıştırılabilir istemci kodu üretebilir (`clientcode.generate`) ve dil ile istemci kitaplığı seçicileri olan kartta gösterebilir. C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift ve başka diller desteklenir. Kod sohbete yapıştırılmak yerine kartta gösterilir.

## Asistanla ayar değiştirme

Tema veya dil değiştirme, proxy ayarlama, sertifika hatasını yok sayma ya da HTTP sürümü değiştirme gibi uygulama düzeyindeki istekler API tasarım sorusu olarak değil, ayar araçlarıyla ele alınır. Ayar değişiklikleri uygulanmadan önce onay ister.

İlgili: [Yapay zekâ ve modeller](./ai-models.md), [İstek çalışma alanı](./debug.md).

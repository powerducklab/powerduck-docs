---
sidebar_position: 8
title: "Yapay zekâ ve modeller"
description: "Powerduck, asistanın modelini seçip yapılandırmanıza izin verir. Masaüstünde istekler ana süreçten seçtiğiniz uç noktaya gider; belge değişiklikleri yine incelenebilir kartlarla sunulur."
---

# Yapay zekâ ve modeller

Powerduck, asistanın modelini seçip yapılandırmanıza izin verir. Masaüstünde istekler ana süreçten seçtiğiniz uç noktaya gider; belge değişiklikleri yine incelenebilir kartlarla sunulur.

## Kendi modelinizi kullanın

Ayarlarda asistanı **OpenAI uyumlu** bir Chat Completions uç noktasına bağlayın:

- Yerleşik sağlayıcı önayarını seçin veya **özel** sağlayıcı tanımlayın;
- Görünen ad, temel URL, API anahtarı ve model kimliğini girin;
- Birden çok profil yapılandırıp aralarında seçim yapabilirsiniz.

Belirli bir sağlayıcı zorunlu değildir. Kendi barındırdığınız veya üçüncü taraf bir OpenAI uyumlu uç nokta aynı biçimde çalışır; bu, kendi model politikası olan ekipler için önemlidir.

## Gelişmiş yetenekler ve yedek yol

Her profilin varsayılan olarak açık bir **gelişmiş yetenekler** seçeneği vardır:

- Açıkken uygulama modelin **yerel işlev çağırma** özelliğini kullanır ve araç kataloğunu gönderir; model uygun aracı doğrudan seçip çağırabilir;
- Uç nokta yerel araç parametrelerini reddederse, örneğin model araçları desteklemiyorsa, bu durum hatırlanır ve istek **içerik tabanlı yedek protokolle** bir kez yeniden denenir.

Yedek yol uyumluluğu artırır ancak başarı garantisi vermez; ağ, kimlik doğrulama ve model hataları yine oluşabilir. Her zaman temel yolu kullanması gereken profillerde gelişmiş yetenekleri kapatın.

Araç kullanımı da sınırlıdır: ajan varsayılan olarak üç araç turu çalıştırır ve aynı çalıştırmadaki yinelenen çağrıları ayıklar.

## İstekler neden ana süreçten geçer?

Masaüstü istemcisinde tamamlama istekleri web görünümünden değil **Node ana sürecinden** gönderilir. Bunun iki somut avantajı vardır:

- **Tarayıcı CORS engeli yoktur.** Web sayfalarına uygulanan kökenler arası kısıtlamalar model uç noktasına çağrıları engellemez;
- **HTTP isteği görüntüleme sürecinin dışında yürütülür.** Bu sürecin ağ paneli ana sürecin HTTP alışverişini göstermez. Bu, istem veya anahtarların görüntüleme süreci belleğinde, günlüklerde ya da diğer geliştirici araçlarında bulunmadığını garanti etmez.

Masaüstü ağ geçidi istek yapısını doğrular ve kaynak sınırları uygular:

- Yalnızca HTTP(S) URL'leri kabul edilir; üstbilgi adları ve değerleri, gövde boyutu, zaman aşımı ve eşzamanlı istekler denetlenir. Yerel ve özel uç noktalara izin verilir. Bu, izin verilen sunucu listesi veya sağlayıcı gizlilik garantisi değildir;
- İstekler iptal edilebilir (`ai:cancel`).

## Masaüstü ve web

Aynı asistan, her ortama uygun kanalı kullanarak iki çalışma zamanında da çalışır:

- **Masaüstü (Electron):** yetenekler yerel olarak içe aktarılıp yürütülür ve tamamlama istekleri ana süreç üzerinden iletilir;
- **Web:** aynı akış HTTP üzerinden, yerel modüller yerine hizmet API'sini çağırarak çalışır.

Bu nedenle uygulama Electron yolunun yanında web uyumlu yolu da korur: amaç işleme ve kartlar tutarlıdır, aktarım ise ortama uyarlanır.

## Amaç nasıl anlaşılır?

Amaç, her özellik için anahtar kelimeler sıralanarak anlaşılmaz. Uygulama modele açık ve iyi tanımlanmış bir **araç kataloğu** sunar: araç kimliği, parametreler ve kullanım durumu. Model aracı seçer; deterministik uygulama doğrular ve yürütür, yazma eylemleri ise onay ister.

Yeni yetenek eklemek, anahtar kelime listesini uzatmak yerine kataloğa doğru açıklanmış bir araç eklemek demektir. Aynı katalog MCP sunucusuyla dış ajanlara paylaşılabilir; ürün ve diğer araçların yetenekleri uyumlu kalır.

## Gizlilik

- İstemler, seçili bağlam, araç açıklamaları ve kimlik bilgileri yapılandırdığınız model uç noktasına gönderilir. Barındırılan sağlayıcı bu verileri alır; politikanız yerel çıkarım gerektiriyorsa güvenilir yerel uç nokta kullanın;
- Her değişikliği model değil, deterministik uygulama doğrular ve uygular;
- Her yazma işlemini çalışmadan önce siz onaylarsınız.

İlgili: [Asistanla tasarım](./design.md), [Ayarlar](./settings.md), [Bulut erişim denetimi](../cloud/access-control.md).

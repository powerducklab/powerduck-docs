---
sidebar_position: 7
title: "Yerel mock sunucusu"
description: "Seçtiğiniz bağlantı noktası, temel yol, gecikme ve yanıt geçersiz kılmalarıyla OpenAPI API’nizin yerel taklidini çalıştırın ve aldığı istekleri inceleyin."
---

# Yerel mock sunucusu

Mock sunucusu doğrudan belirtimden API’nizin çalışan bir taklidini sunar. Böylece arka uç henüz yokken bile dış altyapı kurmadan ön yüz ve istemci geliştirmeye devam edebilirsiniz. Sunucu, masaüstü uygulamasının ana sürecinde çalışır.

## Mock başlatma

Mock’u Mock sunucusu ekranından veya doğrudan AI sohbetinden başlatabilirsiniz. Sohbetten başlatıldığında uygulama, hizmet verdiği adresi bildirir.

Aşağıdaki seçenekler kullanılabilir:

| Seçenek | Aralık / biçim | Amaç |
|---|---|---|
| `port` | `1`–`65535` arasında tam sayı | Dinlenecek yerel bağlantı noktası |
| `basePath` | URL yolu öneki | Mock’u bir temel yol altında sunar |
| `latencyMs` | `0`–`10000` | Ağ gecikmesini taklit etmek için yapay gecikme ekler |
| `overrides` | En fazla 100 yanıt geçersiz kılması | Seçilen işlemler için belirli yanıtlar döndürür |

Geçersiz bağlantı noktaları veya gecikme değerleri, bozuk bir sunucu başlatmak yerine açık bir mesajla reddedilir.

## Birden fazla mock

Aynı anda birden fazla mock çalıştırabilirsiniz; örneğin açık her belge için bir tane. Uygulama çalışan mock’ları listeler (`mock:list`) ve tek bir mock’u durdurabilir (`mock:stop`). Her mock, kolayca ayırt edilebilmesi için bir belge kimliği ve adıyla ilişkilendirilir.

## Alınan istekleri inceleme

Mock, aldığı istekleri kaydeder. İsteğe bağlı bir sınırla bu kayıtları sorgulayabilir (`mock:requests`) ve kayıt kümesini temizleyebilirsiniz. Bu, gerçek bir arka uç olmasa bile istemcinin doğru işlemi beklenen parametrelerle çağırdığını doğrulamak için yararlıdır.

## Yanıtları geçersiz kılma

Varsayılan örnek veya şemadan üretilen yanıt yeterli olmadığında, belirli bir işlem için istediğiniz yanıtı tanımlayabilirsiniz. Yapılandırmayı yönetilebilir tutmak için en fazla 100 yanıt geçersiz kılmasına izin verilir.

## Ne zaman kullanılır?

- Arka ucu henüz geliştirilmekte olan bir sözleşmeye göre ön yüz geliştirmeye devam ederken;
- Gecikme ve yanıtları ayarlayarak yavaşlığı veya uç durumları yeniden oluştururken;
- Dağıtılmış bir ortam olmadan API akışını gösterirken;
- Üretilen istemcilerin işlemleri tasarlandığı gibi çağırdığını doğrularken.

Mock, diğer araçlarla aynı belirtimi okur; böylece tasarım değiştikçe sözleşmeyle uyumlu kalır.

İlgili konular: [Senaryo testleri](/docs/tr-TR/client/scenario-testing/), [Asistanla tasarım](/docs/tr-TR/client/design/).

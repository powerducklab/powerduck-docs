---
sidebar_position: 5
title: Erişim Denetimi
description: "Dokümantasyonu parola ve son kullanma tarihiyle, MCP uç noktasını erişim anahtarıyla koruyun; MCP'nin hedef API kimlik doğrulamasını yapılandırın."
---

# Erişim Denetimi

Powerduck, farklı kullanım biçimleri nedeniyle **okuyucuların dokümantasyona erişimini** ve **istemcilerin MCP uç noktasına erişimini** birbirinden ayırır. MCP sunucusunun hedef API'de nasıl kimlik doğrulayacağı da ayrıca yapılandırılır.

## Denetim sırası

Herkese açık bir hizmete erişilip erişilemeyeceğini birkaç koşul belirler. Bunların tamamını bilmek, belgenin neden açılmadığını anlamayı kolaylaştırır.

1. **Belge durumu** — `ACTIVE` olmalıdır; duraklatılmış, arşivlenmiş veya silinmiş olmamalıdır;
2. **Hizmetin etkin olması** — dokümantasyon için `documentationEnabled`, MCP için `mcpEnabled`;
3. **Erişim bilgisi** — yapılandırılmışsa dokümantasyon için görüntüleme parolası, MCP için erişim anahtarı;
4. **Son kullanma tarihi** — dokümantasyon erişimi belirli bir tarihte sona erecek şekilde ayarlanabilir.

Yayınlanan içerik, sürüm eklediğinizde veya erişime açılan işlemleri değiştirdiğinizde otomatik oluşturulur. Bu nedenle yayınlama genellikle elle yapılmaz.

Hizmetler bağımsızdır: MCP'yi kapatmak dokümantasyonu etkilemez; dokümantasyon parolası da MCP erişimini denetlemez.

## Dokümantasyon görüntüleme parolası

Parola hem oluşturulan dokümantasyonu hem sunulan belirtim verilerini korur:

- Parola, her parola için ayrı rastgele tuz kullanılarak **scrypt** ile özetlenir; düz metin saklanmaz;
- Parola ayarlandığında okuyucular belge sunulmadan önce parolayı vermelidir;
- Parola yalnızca **dokümantasyonu** korur; MCP uç noktası kendi erişim anahtarını kullanır ve görüntüleme parolasını denetlemez.

Bir **görüntüleme son kullanma tarihi** de ayarlayabilirsiniz. Bu tarihten sonra doğru parolayla bile erişim reddedilir. İlgili kısıtlamayı kaldırmak için parolayı veya son kullanma tarihini temizleyin.

## MCP uç noktası erişim anahtarı

MCP uç noktası kendi **erişim anahtarıyla** korunur:

- Anahtar oluşturun veya anahtarı yenileyin: tam değer **yalnızca bir kez** döndürülür; daha sonra sadece son dört karakter gösterilir;
- Anahtar yapılandırıldığında her MCP isteği onu `Bearer` belirteci olarak sunmalıdır;
- Anahtar **sabit zamanlı** karşılaştırmayla doğrulanır; eksik veya yanlış anahtar `401` yanıtı üretir.

Belge etkin ve MCP açık olduğu sürece, anahtarı silmek uç noktayı anahtarsız erişime açar.

## MCP'nin hedef API kimlik doğrulaması

Uç noktaya erişim denetiminden bağımsız olarak, MCP sunucusunun belirtimde tanımlanan **hedef API'de** nasıl kimlik doğrulayacağını ayarlayabilirsiniz. Desteklenen türler:

| `authType` | Yapılandırma |
|---|---|
| `NONE` | Hedef API kimlik doğrulaması yok |
| `BEARER` | Bearer belirteci |
| `BASIC` | Temel kimlik doğrulaması için kullanıcı adı ve parola |
| `APIKEY` | Başlıkta veya sorguda API anahtarı adı ve değeri |

Bearer belirteçleri, parolalar ve API anahtarı değerleri gibi sırlar yazılabilir ancak geri okunamaz. Yapılandırma yalnızca bunların ayarlanıp ayarlanmadığını bildirir.

Diğer MCP ayarları:

- **Temel URL'yi geçersiz kılma** — hedef API için belirtimdeki yerine farklı bir temel URL kullanın;
- **İstek zaman aşımı** — MCP sunucusunun hedef API çağrılarında kullandığı bekleme süresi.

## Önerilen kurulum

- **Herkese açık dokümantasyon:** açık API'ler için parolasız etkinleştirin; denetimli paylaşım için parola ve son kullanma tarihi belirleyin;
- **Kendi ajanlarınız için MCP:** MCP'yi açıp erişim anahtarı oluşturun; böylece yalnızca kendi istemcileriniz çağırabilsin;
- **Hedef API kimlik doğrulaması:** MCP uç noktasına kimin erişebileceğinden bağımsız olarak, gerçek API'nin gerektirdiği kimlik doğrulamayı yapılandırın.

İlgili konular: [Erişime açılan işlemler](/docs/tr-TR/cloud/exposure/), [Belgeler ve sürümler](/docs/tr-TR/cloud/documents-versions/), [Özel alan adları](/docs/tr-TR/cloud/custom-domains/).

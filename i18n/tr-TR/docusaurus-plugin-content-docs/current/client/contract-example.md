---
title: "Sözleşme testleriyle uygulama hatası bulma"
description: "Sözleşme testleriyle uygulama hatası bulma"
---

# Sözleşme testleriyle uygulama hatası bulma

Bu örnek, yanıt şeması doğrulaması 0.7.6 sürümünden beri bulunan geliştirici MCP çalıştırıcısını kullanır. Node.js 22.12.0 veya üstü gerekir. Kurgu veriler ve yalnızca geri döngü arayüzünde dinleyen bir arka uç kullanır; bağımlılıklar kurulduktan sonra hesap, model veya herkese açık API gerekmez.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

Yanıt `{"total":"42"}` olmasına rağmen şema sayı gerektirir. Gerçek doğrulayıcı `/total must be number` bildirir ve 1 durum koduyla çıkar.

```sh
node examples/contract-total/verify.mjs --correct
```

Arka uç artık `{"total":42}` döndürür; aynı denetim geçer ve 0 durum koduyla çıkar. Uygulamayı kendiniz düzeltmek için `examples/contract-total/server.mjs` içindeki `total` ifadesini sayı döndürecek şekilde değiştirin. Hatayı gizlemek için sözleşmeyi gevşetmeyin.

Her çağrı boş bir yerel port ayırır ve sonunda sunucusunu kapatır. Kaynak dosyaları ve komutlar [örnek projede](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total) bulunur. Şema denetimleri şu anda JSON yanıtlarını kapsar; biçim doğrulaması veya uzak şema getirme yapılmaz. Şema doğrulaması gereken ancak desteklenmeyen içerik türleri sessizce başarılı sayılmaz, kısıtlama olarak bildirilir.

Bu işlem gerçek bir arka ucu denetler. Başarılı bir Mock isteği yalnızca örnek iş akışını gösterir. İsteğe bağlı olarak kodlama ajanı, açıkça belirtilen `baseUrl` ile `run_contract_tests` kullanarak aynı doğrulamayı çalıştırabilir; yamayı uygulamadan önce inceleyin.

[Masaüstü uygulamasını indir](https://www.powerduck.com/download.html) · [Hızlı başlangıç](https://www.powerduck.com/docs/tr-TR/overview/quickstart/)

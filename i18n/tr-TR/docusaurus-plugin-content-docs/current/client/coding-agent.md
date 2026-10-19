---
title: "OpenAPI’yi bir kodlama aracısına bağlama"
description: "OpenAPI’yi bir kodlama aracısına bağlama"
---

# OpenAPI’yi bir kodlama aracısına bağlama

Bir kodlama aracısının sözleşmeyi inceleyip arka ucu doğrulaması için **geliştirici MCP’sini** kullanın. **API-to-MCP**, API işlemlerini çağrılabilir araçlar olarak sunar; bu farklı bir iş akışıdır.

1. Masaüstü uygulamasında **Aç** ile YAML/JSON dosyanızı açın. Denemelere başlamadan önce ayrı bir kopya kaydedin.
2. Geçerli belirtim için **MCP ve Kodlama** bölümünü açın. Alternatif olarak geliştirici MCP deposunun yerel kopyasında `npm ci` ve `npm run build` çalıştırın.
3. Aracınızda bir stdio MCP sunucusu yapılandırın: çalıştırılabilir dosya `node`, bağımsız değişkenler ise `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml` olmalıdır. Gerçek mutlak yolları kullanın; yer tutucuları olduğu gibi yapıştırmayın.
4. Arka ucu değiştirmeden önce aracıdan bir işlemi ve yanıt şemasını okumasını isteyin. Değişiklikten sonra arka ucun yerel `baseUrl` değerini açıkça belirterek `run_contract_tests` çağrısını yapmasını isteyin.
5. Bildirilen doğrulamaları ve önerilen kod yamasını inceleyin. Kabul ettiğiniz düzeltmeyi uyguladıktan sonra testleri yeniden çalıştırın.

Geliştirici MCP sunucusu Node.js 22.12.0 veya daha yeni bir sürüm gerektirir. Aracınız, araç sonuçlarını veya kod bağlamını yapılandırılmış uzak modele gönderebilir. Elle yapılan yerel istekler ve sözleşme testleri için model gerekmez. Kendi anahtarınızın kullanımını sağlayıcınız faturalandırır; barındırılan model kredileri ayrı hesaplanır. Yerel çalışma için Cloud aboneliği gerekmez.

[Masaüstü uygulamasını indir](https://www.powerduck.com/download.html) · [Hızlı başlangıç](https://www.powerduck.com/docs/tr-TR/overview/quickstart/)

---
sidebar_position: 6
title: "Veri modeli ve ER diyagramı"
description: "Veri modeli alanı, API sözleşmesi ile veritabanı arasındaki bağı kurar. OpenAPI şemalarınızdan eksiksiz bir ilişkisel model türetebilir, bunu mevcut veritabanıyla karşılaştırabilir ve taraflardan biri değiştikçe ikisini uyumlu tutmanıza yardımcı olabilir. Görsel ER diyagramı bütün yapıyı gösterir."
---

# Veri modeli ve ER diyagramı

Veri modeli alanı, API sözleşmesi ile veritabanı arasındaki bağı kurar. OpenAPI şemalarınızdan eksiksiz bir ilişkisel model türetebilir, bunu mevcut veritabanıyla karşılaştırabilir ve taraflardan biri değiştikçe ikisini uyumlu tutmanıza yardımcı olabilir. Görsel ER diyagramı bütün yapıyı gösterir.

Her iki başlangıç durumu da desteklenir:

- **Henüz tablo yok.** Tüm tabloları, sütunları, yabancı anahtarları ve ilişki tablolarını mevcut API'lerden, bunları oluşturacak SQL ile birlikte türetin.
- **Mevcut bir veritabanı var.** Gerçek tabloları ve uygulanan yabancı anahtar kısıtlarını okuyun, API'lerin gerektirdiği modelle eşleştirin ve uyuşan ya da ayrışan noktaları görün.

## Dört katmanlı karşılaştırma

Karşılaştırma (`datamodel.reconcile`), esas alınacak bilgileri dört katmanda döndürür:

| Katman | İçeriği |
|---|---|
| **Gözlemlenen** | Modelde karşılığı olmayan gerçek tablolar ve yalnızca veritabanında bulunan ya da kısıt olarak uygulanan yabancı anahtarlar |
| **Modellenen** | Tablo durumu (`missing`, `drift`, `matched`, `extra`), model ve veritabanı sütun çiftleri, alan düzeyindeki farklar, etkilenen API işlemleri ve modellenen ilişkiler |
| **Önerilen** | `blockedBy` bağımlılıkları ve her adımın SQL'i ile sıralı, eklemeye dayalı geçiş planı |
| **Çıkarılan** | Otomatik türetilen çoka çok bağlantı tabloları, açık sorular ve koruyucu kontroller |

Model her tabloyu, sütunu, ilişkiyi ve ifadeyi bu sonuca dayandırır; DDL uydurmaz.

### Tablo durumu

- **Eksik (yeni)**: API'ler tarafından gerekli görülür ancak veritabanında yoktur;
- **Farklı**: iki tarafta da vardır ancak sütunlar veya kısıtlar farklıdır;
- **Eşleşen**: vardır ve tutarlıdır;
- **Fazladan**: veritabanında vardır ancak mevcut API'ler tarafından gerekli görülmez.

## İlişki tabloları ve indeksler türetilir

Bağlantı tablolarını elle modellemeniz gerekmez. Şemalar, örneğin `user` ve `product` kaynakları arasında çoka çok ilişki gösteriyorsa **çıkarılan** katman yalnızca iki temel tabloyla yetinmez; onları bağlayan ilişki tablosunu ve ilgili indeksleri de türetir. İkincil indeksler üretilen SQL'e dâhildir.

İş mantığı kesin olarak çıkarılamıyorsa sonuç tahmin yürütmek yerine açık bir soru sunar. Koruyucu kontroller, insan incelemesi gereken noktaları işaretler.

## Görsel ER diyagramı

ER görünümü modeli bir graf olarak gösterir. Böylece ilişkiler ve yabancı anahtarlar tablo listesinden okunmak yerine tek bakışta görülebilir:

- Tablolar düğümdür; kesişen bağlantıları azaltmak için otomatik yerleştirilir;
- Yabancı anahtar ilişkileri bağlantılarla çizilir;
- Düğüm durumu karşılaştırma sonucunu yansıtır: yeni, farklı, eşleşen veya fazladan;
- Yan panel, `create_table`, `alter_table` ve inceleme öğeleri gibi somut geçiş adımlarını seçilen tablonun SQL'iyle birlikte listeler.

Bu görünüm hem şemanın genelini hem de veritabanını uyumlu hâle getirmek için kesin ve sıralı bir yol sunar.

## İki yönlü etki analizi

Model hem API işlemlerini hem tabloları bildiğinden değişikliklerin etkileri görünür olur:

- **API değiştiğinde** karşılaştırma, farklılaşan mevcut tabloları ve eklenecek yeni tabloları ilgili SQL ile birlikte belirler;
- **Veritabanı değiştiğinde** etkilenen tablolara erişen işlemler işaretlenir.

Taraflardan birini düzenledikten sonra model ve veritabanı eşleşene kadar **yenileyip yeniden karşılaştırabilirsiniz**.

## Dağıtım betiği

Yeni bir veritabanı için `datamodel.deploymentScript`, tekrar çalıştırıldığında aynı sonucu veren, yalnızca ileri yönde değişiklik yapan tek bir SQL betiği üretir:

- Yabancı anahtar bağımlılık sırasına göre `CREATE TABLE IF NOT EXISTS`;
- İkincil indeksler;
- İsteğe bağlı, deterministik örnek satırlar: 0–50 arası, varsayılan 0; ilişki tablolarına hiçbir zaman örnek veri eklenmez.

Mevcut veritabanında bunun yerine karşılaştırmayı kullanın. Bu işlem, sıralı geçiş planı içinde eklemeye dayalı `ALTER` ifadeleri üretir.

## Veritabanı bağlantıları

Bağlantılar kimlik, ad, lehçe, ana makine, bağlantı noktası, kullanıcı ve veritabanını içeren kayıtlı profiller olarak yönetilir; parolalar hiçbir zaman döndürülmez. Desteklenen sistemler **MySQL**, **SQL Server** ve **Oracle**'dır.

- `database.runSelect`, kayıtlı profil üzerinden salt okunur bir `SELECT` çalıştırır ve sınırlanmış, gerektiğinde kesilmiş bir satır kümesi döndürür; yazma işlemleri ve DDL engellenir;
- `database.prefillConnection`, sağladığınız ayrıntılarla önceden doldurulmuş yeni bağlantı penceresini açar. Böylece parola bir istem üzerinden alınmak yerine sizin tarafınızdan girilir.

## SQL üretilir, otomatik çalıştırılmaz

Bu alanda SQL, veritabanınızda çalıştırılmak yerine **incelemeniz için üretilir**. Ne zaman ve nasıl uygulayacağınıza siz karar verirsiniz; salt okunur erişim mevcut verileri korur. Veritabanını değiştirmeden önce modeli inceleyip geliştirebilirsiniz.

İlgili sayfalar: [Protokoller](./protocols.md), [İstek çalışma alanı](./debug.md), [Ayarlar](./settings.md).

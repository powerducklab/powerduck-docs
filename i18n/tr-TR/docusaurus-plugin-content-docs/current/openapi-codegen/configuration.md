---
sidebar_position: 4
title: "Yapılandırma"
description: "@powerduck/openapi-codegen üretim seçenekleri: GenerateOptions, RequestIR, Generator ve Plugin arayüzleri."
---

# Yapılandırma

Ayrı bir yapılandırma dosyası yoktur. Üretim, [`generate()`](/docs/tr-TR/openapi-codegen/api-reference/) işlevine verilen `GenerateOptions` nesnesiyle denetlenir.

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Seçenek | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `language` | `string` | evet | Büyük/küçük harfe duyarsız hedef dil tanımlayıcısı, ör. `"javascript"` |
| `client` | `string` | evet | Hedef HTTP istemcisi tanımlayıcısı, ör. `"fetch"` |
| `request` | `RequestIR` | bir seçenek* | Önceden normalleştirilmiş istek; `normalize` atlanır |
| `document` | `unknown` | bir seçenek* | Ayrıştırılmış OpenAPI belge nesnesi |
| `path` | `string` | `document` ile | Tam OpenAPI yol şablonu, ör. `"/pets/{id}"` |
| `method` | `string` | `document` ile | HTTP yöntemi, ör. `"get"` / `"post"` |
| `serverUrl` | `string` | hayır | Belgedeki sunucu URL'sini geçersiz kılar |
| `securityValues` | `Record<string, string>` | hayır | Güvenlik şeması adına göre anahtarlanmış kimlik bilgileri |
| `softRefMode` | `boolean` | hayır | Bozuk veya döngüsel `$ref` için hata fırlatmaz; kısmi değerler döndürür |

\* Ya yalnızca `request` ya da `document` + `path` + `method` birlikte verilmelidir. `request` verildiğinde `document`, `path`, `method`, `serverUrl`, `securityValues` ve `softRefMode` yok sayılır.

### Girdi doğrulama hataları

Zorunlu girdi eksikse `generate()` hata fırlatır:

- `TypeError: generate() requires an options object` — Seçenek nesnesi yok.
- `Error: Unsupported generator: <language>/<client>` — Bilinmeyen birleşim.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` da desteklenmeyen yöntemler, eksik `paths`, bilinmeyen yollar ve eksik işlemler için `Error`; nesne olmayan belgeler için `TypeError` fırlatır.

## RequestIR

Bir isteğin kod üreticisinden bağımsız, normalleştirilmiş temsilidir. Bunu doğrudan oluşturup `options.request` olarak vererek `normalize` adımını atlayabilirsiniz.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Multipart dosya yer tutucuları şu işaret yapısını kullanır:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

Bu arayüze uyan herhangi bir nesne üretici olabilir. Yerleşik üreticiler `createGenerator(language, client, emit)` ile oluşturulur; kendi üreticilerinizi de kaydedebilirsiniz:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate`, bir `RequestIR` alır ve üretilen kaynak kodunu dize olarak döndürür.

## Plugin

Eklenti, `use()` üzerinden bir veya daha fazla üretici kaydeder:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Örnek:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

Bu tür, gelecekte birden fazla dosya içerebilecek üretici çıktıları için tanımlanmıştır. Şu anda `generate()` hâlâ `string` döndürür:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## normalize çıktı yapısı

`normalize()` doğrudan çağrıldığında ([API başvurusuna](/docs/tr-TR/openapi-codegen/api-reference/#normalizeoptions) bakın) `RequestIR` türünden biraz daha geniş bir nesne döner:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Sunucu URL'sini çözümleme sırası

`baseUrl`, aşağıdaki sıradaki ilk boş olmayan değeri alır:

1. `options.serverUrl`
2. işlemin `servers` alanı
3. yol öğesinin `servers` alanı
4. kök `servers` alanı
5. yedek değer `"https://example.com"`

Sunucudaki `{variable}` yer tutucuları `server.variables` içinden önce `default`, yoksa `example` değeri kullanılarak URI kodlamasıyla doldurulur.

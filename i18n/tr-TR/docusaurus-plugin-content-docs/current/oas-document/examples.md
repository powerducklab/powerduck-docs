---
sidebar_position: 5
title: "Örnekler"
description: "Otomatik dönüştürmeyi atlayın, çekirdeği React olmadan kullanın, temaları özelleştirin ve görüntüleme performansının sınırlarını öğrenin."
---

# Örnekler

## Zaten geçerli bir OAS 3.2 belgeniz mi var?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Yalnızca çekirdek (React olmadan)

Özel arayüzler veya Node.js için çekirdek giriş noktasını kullanın:

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## Özel stiller

Kök öğeye `data-theme="light"` veya `data-theme="dark"` atanır. Tüm renkler `.pde-oas-root` altındaki CSS değişkenleriyle belirlenir:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Performans notları

- Kod örneklerinin yüklenmesi, görünür alana 600px mesafeye gelene kadar ertelenir (IntersectionObserver)
- Sözdizimi vurgulama bir LRU önbelleği kullanır (64 kayıt / 1MB)
- Kaydırma takibi, rAF ile sıklığı sınırlanan pasif dinleyiciler kullanır
- Örnek üretimi 6 iç içe geçme düzeyi ve 1.000 düğümle sınırlıdır

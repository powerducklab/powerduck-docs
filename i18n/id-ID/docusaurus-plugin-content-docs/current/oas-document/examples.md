---
sidebar_position: 5
title: "Contoh"
description: "Lewati konversi otomatis, gunakan modul inti tanpa React, sesuaikan tema, dan pahami batas performa rendering."
---

# Contoh

## Sudah memiliki dokumen OAS 3.2 yang valid?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Modul inti saja (tanpa React)

Gunakan titik masuk modul inti untuk antarmuka khusus atau Node.js:

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

## Gaya khusus

Elemen akar diberi `data-theme="light"` atau `data-theme="dark"`. Semua warna ditentukan melalui variabel CSS di bawah `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Catatan performa

- Pemuatan contoh kode ditunda hingga berada dalam jarak 600px dari area tampilan (IntersectionObserver)
- Penyorotan sintaks menggunakan cache LRU (64 entri / 1MB)
- Pelacakan gulir menggunakan listener pasif dengan pembatasan frekuensi melalui rAF
- Pembuatan contoh dibatasi hingga 6 tingkat penyarangan dan 1.000 simpul

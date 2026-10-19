---
sidebar_position: 5
title: "Esempi"
description: "Salta la conversione automatica, usa il modulo principale senza React, personalizza i temi e scopri i limiti prestazionali del rendering."
---

# Esempi

## Hai già un documento OAS 3.2 valido?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Solo il modulo principale (senza React)

Usa il punto di ingresso del modulo principale per interfacce personalizzate o Node.js:

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

## Stili personalizzati

L’elemento radice riceve `data-theme="light"` o `data-theme="dark"`. Tutti i colori vengono determinati dalle variabili CSS di `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Note sulle prestazioni

- Il caricamento degli esempi di codice viene rimandato finché non si trovano entro 600px dall’area visibile (IntersectionObserver)
- L’evidenziazione della sintassi usa una cache LRU (64 voci / 1MB)
- Il monitoraggio dello scorrimento usa listener passivi con limitazione della frequenza tramite rAF
- La generazione degli esempi è limitata a 6 livelli di annidamento e 1.000 nodi

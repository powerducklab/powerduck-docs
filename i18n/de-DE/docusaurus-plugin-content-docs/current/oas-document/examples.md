---
sidebar_position: 5
title: "Beispiele"
description: "Überspringen Sie die automatische Konvertierung, nutzen Sie das Kernmodul ohne React, passen Sie Themes an und lernen Sie die Leistungsgrenzen beim Rendern kennen."
---

# Beispiele

## Bereits ein gültiges OAS-3.2-Dokument vorhanden?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Nur das Kernmodul (ohne React)

Verwenden Sie den Kerneinstiegspunkt für eigene Oberflächen oder Node.js:

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

## Eigene Stile

Das Wurzelelement erhält `data-theme="light"` oder `data-theme="dark"`. Alle Farben werden über CSS-Variablen unter `.pde-oas-root` bestimmt:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Hinweise zur Leistung

- Codebeispiele werden erst geladen, wenn sie höchstens 600px vom sichtbaren Bereich entfernt sind (IntersectionObserver)
- Die Syntaxhervorhebung verwendet einen LRU-Cache (64 Einträge / 1MB)
- Die Verfolgung der Scrollposition verwendet passive Listener mit rAF-Drosselung
- Die Beispielgenerierung ist auf 6 Verschachtelungsebenen und 1.000 Knoten begrenzt

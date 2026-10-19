---
sidebar_position: 5
title: "Ejemplos"
description: "Omite la conversión automática, usa el núcleo sin React, personaliza los temas y conoce los límites de rendimiento del renderizado."
---

# Ejemplos

## ¿Ya tienes un documento OAS 3.2 válido?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Solo el núcleo (sin React)

Utiliza la entrada del núcleo para interfaces propias o Node.js:

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

## Estilos personalizados

El elemento raíz recibe `data-theme="light"` o `data-theme="dark"`. Todos los colores se resuelven mediante variables CSS de `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Notas sobre rendimiento

- Los ejemplos de código se cargan cuando quedan a menos de 600px del área visible (IntersectionObserver)
- El resaltado de sintaxis utiliza una caché LRU (64 entradas / 1MB)
- El seguimiento del desplazamiento utiliza escuchadores pasivos con limitación de frecuencia mediante rAF
- La generación de ejemplos se limita a 6 niveles de anidamiento y 1.000 nodos

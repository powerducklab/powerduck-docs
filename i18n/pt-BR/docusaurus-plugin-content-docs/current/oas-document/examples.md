---
sidebar_position: 5
title: "Exemplos"
description: "Pule a conversão automática, use o núcleo sem React, personalize temas e conheça os limites de desempenho da renderização."
---

# Exemplos

## Já tem um documento OAS 3.2 válido?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Somente o núcleo (sem React)

Use o ponto de entrada do núcleo para interfaces próprias ou Node.js:

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

O elemento raiz recebe `data-theme="light"` ou `data-theme="dark"`. Todas as cores são definidas por variáveis CSS em `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Notas de desempenho

- Os exemplos de código só são carregados quando estão a até 600px da área visível (IntersectionObserver)
- O realce de sintaxe usa um cache LRU (64 entradas / 1MB)
- O acompanhamento da rolagem usa listeners passivos com limitação de frequência por rAF
- A geração de exemplos é limitada a 6 níveis de aninhamento e 1.000 nós

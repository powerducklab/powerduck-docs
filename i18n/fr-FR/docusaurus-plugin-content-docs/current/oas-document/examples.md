---
sidebar_position: 5
title: "Exemples"
description: "Désactivez la conversion automatique, utilisez le noyau sans React, personnalisez les thèmes et découvrez les limites de performance du rendu."
---

# Exemples

## Vous avez déjà un document OAS 3.2 valide ?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Noyau seul (sans React)

Utilisez le point d’entrée du noyau pour une interface personnalisée ou Node.js :

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

## Styles personnalisés

L’élément racine reçoit `data-theme="light"` ou `data-theme="dark"`. Toutes les couleurs sont définies par des variables CSS sous `.pde-oas-root` :

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Remarques sur les performances

- Le chargement des exemples de code est différé jusqu’à ce qu’ils soient à moins de 600px de la zone visible (IntersectionObserver)
- La coloration syntaxique utilise un cache LRU (64 entrées / 1MB)
- Le suivi du défilement utilise des écouteurs passifs dont la fréquence est limitée par rAF
- La génération d’exemples est limitée à 6 niveaux d’imbrication et 1 000 nœuds

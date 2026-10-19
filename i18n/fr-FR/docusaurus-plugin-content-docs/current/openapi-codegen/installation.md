---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/openapi-codegen avec npm, yarn ou pnpm et utilisez-le dans Node.js ou le navigateur. Nécessite Node.js 22.12.0 ou ultérieur."
---

# Installation

## Prérequis

- **Node.js** : `>= 22.12.0` (déclaré dans le champ `engines` du paquet), pour l’utilisation dans Node.js.
- Un document OpenAPI **déjà analysé**, sous forme d’objet JavaScript, et non de chaîne JSON/YAML brute.
- Un navigateur moderne doté de l’API Fetch pour l’utilisation dans le navigateur.

Le paquet fournit des builds ESM (`dist/index.js`) et CommonJS (`dist/index.cjs`), avec les déclarations TypeScript. Il n’a **aucune dépendance d’exécution**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Utilisation dans Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Les générateurs intégrés sont **enregistrés automatiquement à l’importation du module** : `generate` fonctionne immédiatement, sans configuration explicite.

## Utilisation dans le navigateur

La bibliothèque est entièrement compatible avec les navigateurs, sans module intégré de Node.js. Chargez-la depuis un CDN ESM et appelez-la directement :

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild et webpack fonctionnent également sans configuration particulière ; le build ESM permet l’élimination du code inutilisé par tree shaking.

## Fournir le document

Transmettez un objet déjà analysé. Pour JSON :

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Pour YAML, analysez d’abord le contenu avec un paquet YAML distinct :

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Structure du paquet

| Entrée | Chemin |
|-------|------|
| Entrée ESM | `dist/index.js` |
| Entrée CommonJS | `dist/index.cjs` |
| Définitions de types | `dist/index.d.ts` |

Aucun exécutable CLI n’est fourni : cette bibliothèque s’utilise uniquement dans le code.

## Étapes suivantes

- [Démarrage rapide](/docs/fr-FR/openapi-codegen/quickstart/) — générez votre premier extrait de code.
- [Configuration](/docs/fr-FR/openapi-codegen/configuration/) — toutes les options de génération.

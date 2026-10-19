---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi est un framework TypeScript extensible qui convertit des commandes curl et des collections Postman (v2.0 / v2.1.0) en documents OpenAPI 3.2. Il convient aux pipelines CI, à la génération de documentation API et à la reconstitution d’interfaces à partir de requêtes HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** est un framework TypeScript extensible qui convertit des **commandes curl** et des **collections Postman (v2.0 / v2.1.0)** en documents **OpenAPI 3.2**. Il convient aux pipelines CI, à la génération de documentation API et à la reconstitution d’interfaces à partir de requêtes HTTP.

Il utilise [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) pour valider les documents.

- **Version :** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Licence :** MIT
- **Version requise de Node.js :** `>= 22.12.0`
- **Sortie :** OpenAPI **3.2.0** uniquement
- **Code source :** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Fonctionnement

```text
commande curl → CurlAdapter
collection Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → document OpenAPI 3.2
             ↓
     validateOpenApi32() → diagnostics
```

1. Un **adaptateur** analyse la source, comme du texte curl ou une collection Postman, pour produire une liste d’objets [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. Le **générateur** fusionne les requêtes par méthode et chemin, déduit les schémas, paramètres de chemin et définitions de sécurité, puis produit un document OpenAPI 3.2.
3. Le **validateur** vérifie la sortie selon le schéma OpenAPI via `@powerduck/openapi-parser` et renvoie des diagnostics.

---

## Fonctionnalités

- **Deux adaptateurs intégrés :** [`CurlAdapter`](./api-reference.md#curladapter) traite une commande, un lot ou la sortie « Copy all as cURL » du navigateur ; [`PostmanAdapter`](./api-reference.md#postmanadapter) prend en charge v2.0/v2.1.0, les dossiers imbriqués et l’héritage de l’authentification.
- **Fonctions sans configuration :** [`curlToOpenApi`](./api-reference.md#curltoopenapi) et [`postmanToOpenApi`](./api-reference.md) enregistrent l’adaptateur et convertissent en un appel.
- **Sortie OpenAPI 3.2 :** chaque document déclare `openapi: "3.2.0"`. La validation est active par défaut. Vérifiez les diagnostics ou activez le mode strict pour rejeter les erreurs.
- **Fusion de requêtes :** les opérations de même méthode et chemin sont combinées ; paramètres de requête, en-têtes, cookies et schémas de corps sont fusionnés structurellement.
- **Déduction des paramètres de chemin :** les identifiants numériques, UUID, ULID et longs segments hexadécimaux deviennent des paramètres comme `/users/{userId}` lorsqu’ils varient sur au moins N échantillons.
- **Déduction de la sécurité :** détection de Bearer, Basic et des clés API dans les en-têtes, requêtes ou cookies, avec les `securitySchemes` correspondants.
- **Formats de corps variés :** JSON, XML, form-urlencoded, multipart/form-data avec texte et fichiers, GraphQL, texte et binaire.
- **Conservation des scripts de test Postman :** `pm.test()` / `pm.expect()` sont émis dans `x-postman-scripts` pour chaque opération.
- **Diagnostics :** chaque problème comporte une gravité, un code et, si disponibles, des détails sur la source ; le mode [`strict`](./api-reference.md#convertoptions) lève une exception en cas d’erreur.
- **Extensible :** implémentez [`SourceAdapter`](./api-reference.md) pour ajouter des sources HAR, HTTPie ou Insomnia.

---

## Architecture de plugins

Le framework repose sur une petite interface d’adaptateur :

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Les adaptateurs sont enregistrés sur une instance [`XToOpenApi`](./api-reference.md#xtoopenapi) via un [`AdapterRegistry`](./api-reference.md#adapterregistry) :

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Les fonctions sans configuration intègrent déjà les deux adaptateurs. Il est donc rarement nécessaire de manipuler directement le registre.

---

## Fonctions utilitaires ou classe ?

| Cas d’utilisation | API |
|---|---|
| Convertir une commande curl ou un lot | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Convertir une collection Postman sous forme d’objet ou de chaîne | [`postmanToOpenApi`](./api-reference.md) |
| Options personnalisées, plusieurs adaptateurs, détection `"auto"` ou adaptateur personnalisé | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Pour aller plus loin

- [Installation](./installation.md) — ajouter le paquet et découvrir les fonctions sans configuration.
- [Démarrage rapide](./quickstart.md) — convertir des commandes curl et des collections Postman, puis utiliser un adaptateur personnalisé.
- [Référence API](./api-reference.md) — tous les exports, types, options, valeurs par défaut et codes de diagnostic.
- [Exemples](./examples.md) — curl, lots de commandes, collections Postman, adaptateurs personnalisés et déduction des chemins.

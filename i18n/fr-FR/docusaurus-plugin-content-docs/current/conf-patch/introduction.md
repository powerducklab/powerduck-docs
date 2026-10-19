---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch est un éditeur de configuration organisé en deux couches. Il applique la sémantique RFC 6902 JSON Patch aux chaînes JSON, JSONC et YAML en préservant les commentaires et la mise en forme, et fournit des écritures atomiques ainsi que des verrous interprocessus pour Node.js et Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** est un éditeur de configuration organisé en **deux couches**. Il applique la sémantique [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) aux chaînes JSON, JSONC et YAML en préservant les commentaires et la mise en forme, et fournit des écritures atomiques ainsi que des verrous interprocessus pour Node.js et Electron.

- **Version :** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Licence :** MIT
- **Version requise de Node.js :** `>= 22.12.0`
- **Code source :** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Pourquoi conf-patch ?

Modifier une configuration par programmation impose souvent de choisir entre une sérialisation complète, qui peut altérer commentaires et mise en forme, et des manipulations de texte fragiles. conf-patch propose :

- **Des modifications incrémentales qui préservent les commentaires** pour JSON/JSONC avec `jsonc-parser`, et des modifications de l’AST pour YAML avec `yaml`. JSON/JSONC évite une sérialisation complète ; YAML sérialise de nouveau l’AST modifié.
- **Des écritures atomiques** par fichier temporaire puis renommage, pour éviter un fichier cible partiellement écrit.
- **Des verrous interprocessus** avec jetons de propriété, délai exponentiel entre les tentatives et récupération des verrous périmés.
- **Une API polyvalente :** la couche cœur fonctionne aussi dans les navigateurs, les fonctions Edge et les applications utilisant IndexedDB.

---

## Architecture à deux couches

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Couche cœur — `@powerduck/conf-patch/core` (compatible navigateur)

Des fonctions pures qui manipulent des **chaînes de caractères**, sans `node:fs`, `node:path` ni API propre à Node.js. Ce sous-chemin peut être intégré au code d’un navigateur, d’une fonction Edge ou d’un service worker.

| Fonction | Rôle |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Appliquer une liste d’opérations RFC 6902 à une chaîne de configuration |
| [`setContentValue`](../api-reference/#setcontentvalue) | Définir ou créer une valeur imbriquée (avec `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Supprimer une clé ou un élément de tableau (avec `remove`) |

### Couche fichiers — `@powerduck/conf-patch` (Node.js / Electron)

Des fonctions asynchrones qui lisent et écrivent des fichiers, en ajoutant à la couche cœur les écritures atomiques et le verrouillage.

| Fonction | Rôle |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Lire du texte UTF-8 à partir d’un chemin ou d’une URL `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Écrire le contenu de façon atomique, avec un verrou facultatif |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Effectuer une transaction lecture-modification-écriture sous verrou |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Définir une valeur imbriquée dans un fichier |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Supprimer une valeur imbriquée d’un fichier |
| [`withFileLock`](../api-reference/#withfilelock) | Exécuter une tâche sous verrou exclusif |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Libérer tous les verrous détenus par le processus courant |

---

## Formats pris en charge

| Format | Extension | Comportement |
|---|---|---|
| **JSON** | `.json` | JSON standard. Modifications incrémentales avec `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON avec commentaires et virgules finales. Les commentaires sont conservés. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. Les modifications de l’AST préservent commentaires, ancres et indentation. |

[`detectFormat`](../api-reference/#detectformat) associe une extension à un [`ConfigFormat`](../api-reference/#configformat). Toute autre extension déclenche une erreur, sauf si vous indiquez explicitement `format`.

---

## Opérations RFC 6902

conf-patch implémente un sous-ensemble ciblé de RFC 6902. Les seules opérations prises en charge sont :

| `op` | Comportement |
|---|---|
| `"add"` | Insérer à un indice de tableau ou ajouter/remplacer une propriété d’objet |
| `"replace"` | Remplacer une valeur existante ; le chemin doit exister |
| `"remove"` | Supprimer une clé ou un élément de tableau existant ; le chemin doit exister |

:::caution
`"move"`, `"copy"` et `"test"` ne sont **pas pris en charge**. Le type [`JsonPatchOp`](../api-reference/#jsonpatchop) limite `op` à `"add" | "replace" | "remove"`.
:::

Précisions sur le comportement :

- `add` à un indice de tableau **insère** un élément (RFC 6902). Pour remplacer un élément existant, utilisez `replace`.
- `add` exige que le chemin parent existe déjà. Créez les parents avant les enfants.
- `replace` et `remove` exigent que le chemin cible existe.
- Avec `strict: true` (par défaut), une opération en échec lève une exception. Avec `strict: false`, elle est ignorée et un avertissement est journalisé.

---

## Préservation des commentaires et de la mise en forme

- **JSON/JSONC :** les modifications sont calculées comme des plages de texte à partir de l’arbre syntaxique. Les commentaires voisins, virgules finales et indentations sont conservés.
- **YAML :** l’AST de `yaml` est modifié sur place puis sérialisé de nouveau, en préservant commentaires, ancres, alias et indentation.

---

## Validation OpenAPI

conf-patch valide les documents OpenAPI/Swagger via une interface sécurisée autour de `@powerduck/openapi-parser` :

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) valide du contenu brut JSON ou YAML.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) valide un document à partir de son chemin.
- Le traitement des entrées impose des limites de taille, un périmètre de chemins autorisés (`allowedRootDirectory`), des contrôles de complexité, des délais et l’annulation par `AbortSignal`.
- Les échecs lèvent une erreur [`OpenApiValidationError`](../api-reference/#openapivalidationerror) avec un `code` exploitable par programme.

---

## Pour aller plus loin

- [Installation](../installation/) — ajouter conf-patch au projet et découvrir ses deux points d’entrée.
- [Démarrage rapide](../quickstart/) — modifier une chaîne dans le navigateur et un fichier sur disque.
- [Référence API](../api-reference/) — tous les exports, types et options.
- [Exemples](../examples/) — exemples exécutables pour JSON, YAML, JSONC, la validation OpenAPI et les verrous.

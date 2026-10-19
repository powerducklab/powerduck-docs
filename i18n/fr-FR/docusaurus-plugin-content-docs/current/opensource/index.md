---
sidebar_position: 1
title: "Bibliothèques open source"
description: "Les paquets npm @powerduck/* sont les moteurs du client de bureau et du Cloud : analyse, mise à niveau, CLI multiprotocole, génération de code, MCP, requêtes, conversion et éditeurs intégrables."
---

# Bibliothèques open source

Powerduck repose sur de petits paquets npm composables. Le client de bureau et le service cloud utilisent ces mêmes bibliothèques : les mêmes moteurs fonctionnent ainsi en local, sur le réseau ou dans vos propres outils.

Chaque paquet est publié indépendamment et possède ses instructions d’installation, sa référence d’API et ses exemples. Cette page présente leur rôle et leur articulation.

## Organisation en couches

```text
Powerduck / Cloud
        ↓
Interfaces intégrables
        ↓
Workflows
        ↓
Fondations
```

L’analyseur et les convertisseurs constituent la base. Les workflows de plus haut niveau s’appuient dessus, puis viennent les interfaces intégrables. Cette base commune garantit un comportement cohérent sans réimplémenter l’analyse dans chaque paquet.

## Les paquets

### Fondations

| Paquet | Rôle |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | Analyser, valider et mettre à niveau des documents OpenAPI/Swagger |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Appliquer des modifications de configuration structurées et validées |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Convertir d’autres formats, comme cURL ou Postman, en OpenAPI |

### Workflows

| Paquet | Rôle |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Workflows multiprotocoles en ligne de commande, y compris l’exécution de scénarios |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Générer du code client et d’autres artefacts à partir d’une spécification |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Exposer une spécification OpenAPI sous forme de serveur MCP |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Exécuter les requêtes décrites par une spécification |

### Interfaces intégrables

| Paquet | Rôle |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | Afficher OpenAPI sous forme de documentation lisible, avec un point d’entrée React |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Éditeur Markdown intégrable |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Éditeur JSON Schema intégrable |
| [`@powerduck/tree`](../tree/introduction.md) | Composant arborescent pour données structurées |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Intégration du YAML de l’espace de travail |

## Choisir le bon paquet

- **Lire, valider ou mettre à niveau un fichier OpenAPI :** commencez par `openapi-parser`.
- **Convertir cURL ou une collection Postman en OpenAPI :** utilisez `x-to-openapi`.
- **Exécuter des scénarios ou workflows multiprotocoles en ligne de commande ou en CI :** utilisez `openapi-cli`.
- **Générer du code client :** utilisez `openapi-codegen`.
- **Exposer une API comme outils pour un agent IA :** utilisez `openapi-mcp-server`.
- **Intégrer une documentation rendue dans une application React :** utilisez `oas-document`, son point d’entrée React et son CSS.
- **Intégrer un éditeur :** utilisez `md-editor` ou `schema-editor`.

## Partager les fonctionnalités avec des agents

Le paquet serveur MCP permet aussi aux agents IA externes d’accéder aux fonctionnalités de Powerduck. Une spécification servie par `openapi-mcp-server` expose ses opérations comme outils MCP : le contrat utilisé pour la documentation et la génération de code devient directement accessible à un agent. Le client de bureau, le Cloud et les autres outils compatibles MCP partagent ainsi la même source de référence.

## À propos des exemples

Les exemples de code suivent l’API réelle du paquet et sont conçus pour être exécutés tels quels. Après une mise à niveau, consultez les notes de version pour connaître les paramètres actuels plutôt que de reprendre des extraits d’anciennes versions.

La barre latérale donne accès à l’installation, à la configuration et à la référence complète de chaque paquet.

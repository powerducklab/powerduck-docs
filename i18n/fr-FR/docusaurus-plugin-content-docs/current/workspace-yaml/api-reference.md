---
sidebar_position: 4
title: "Référence de l’API"
description: "Fonctions, options et codes d’erreur des couches principale et fichiers."
---

# Référence de l’API

## Couche principale (`@powerduck/workspace-yaml/core`)

| Fonction | Description |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Génère une chaîne contenant workspace.yaml |
| `createOpenApiYaml(options)` | Génère une chaîne YAML OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Génère le contenu de l’espace de travail et d’OpenAPI |
| `parseWorkspaceYaml(content)` | Analyse et valide une chaîne workspace.yaml |

### `createOpenApiYaml(options)` — Option

| Option | Type | Obligatoire | Description |
|--------|------|----------|-------------|
| `title` | `string` | Oui | Titre de l’API |
| `version` | `string` | Non | Valeur par défaut `"1.0.0"` |
| `description` | `string` | Non | Description de l’API |
| `contact` | `{ name?, url?, email? }` | Non | Coordonnées |
| `license` | `{ name, url? }` | Non | Informations de licence |
| `servers` | `Array<{ url, description? }>` | Non | Liste des serveurs |

## Couche fichiers (`@powerduck/workspace-yaml`)

| Fonction | Description |
|----------|-------------|
| `initializeWorkspace(options)` | Crée un fichier workspace.yaml sur disque |
| `initializeOpenApi(options)` | Crée un fichier YAML OpenAPI sur disque |
| `createWorkspaceApi(options)` | Crée les deux fichiers de façon atomique (annulation en cas d’échec) |

### `createWorkspaceApi(options)` — Option

| Option | Type | Obligatoire | Description |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Oui | Dossier cible |
| `oasId` | `string` | Oui | Identifiant unique de l’API |
| `name` | `string` | Oui | Nom affiché |
| `file` | `string` | Non | Chemin relatif (par défaut : `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Non | Titre de l’API (par défaut : `name`) |
| `version` | `string` | Non | Version de l’API (par défaut : `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Non | Valeur par défaut `false` |

## Erreurs

Toutes les erreurs sont des instances de `WorkspaceYamlError` avec un `code` exploitable par machine :

| Code | Description |
|------|-------------|
| `INVALID_ARGUMENT` | Paramètre d’entrée invalide |
| `ALREADY_EXISTS` | Le fichier existe déjà et l’écrasement vaut false |
| `NOT_FOUND` | Fichier introuvable |
| `IO_ERROR` | Échec de l’opération sur le système de fichiers |
| `INVALID_WORKSPACE` | Configuration d’espace de travail invalide |
| `INVALID_OPENAPI` | Document OpenAPI invalide |
| `ROLLBACK_FAILED` | Échec de l’annulation de la transaction |

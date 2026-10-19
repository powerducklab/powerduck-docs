---
sidebar_position: 4
title: "Riferimento API"
description: "Funzioni, opzioni e codici di errore dei livelli principale e file."
---

# Riferimento API

## Livello principale (`@powerduck/workspace-yaml/core`)

| Funzione | Descrizione |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Genera una stringa con il contenuto di workspace.yaml |
| `createOpenApiYaml(options)` | Genera una stringa YAML OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Genera il contenuto dell’area di lavoro e di OpenAPI |
| `parseWorkspaceYaml(content)` | Analizza e valida una stringa workspace.yaml |

### `createOpenApiYaml(options)` — Opzione

| Opzione | Tipo | Obbligatorio | Descrizione |
|--------|------|----------|-------------|
| `title` | `string` | Sì | Titolo dell’API |
| `version` | `string` | No | Valore predefinito `"1.0.0"` |
| `description` | `string` | No | Descrizione dell’API |
| `contact` | `{ name?, url?, email? }` | No | Informazioni di contatto |
| `license` | `{ name, url? }` | No | Informazioni sulla licenza |
| `servers` | `Array<{ url, description? }>` | No | Elenco dei server |

## Livello file (`@powerduck/workspace-yaml`)

| Funzione | Descrizione |
|----------|-------------|
| `initializeWorkspace(options)` | Crea un file workspace.yaml su disco |
| `initializeOpenApi(options)` | Crea un file YAML OpenAPI su disco |
| `createWorkspaceApi(options)` | Crea entrambi i file atomicamente (ripristino in caso di errore) |

### `createWorkspaceApi(options)` — Opzione

| Opzione | Tipo | Obbligatorio | Descrizione |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Sì | Directory di destinazione |
| `oasId` | `string` | Sì | Identificatore univoco dell’API |
| `name` | `string` | Sì | Nome visualizzato |
| `file` | `string` | No | Percorso relativo (predefinito: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | No | Titolo dell’API (predefinito: `name`) |
| `version` | `string` | No | Versione dell’API (predefinita: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | No | Valore predefinito `false` |

## Errori

Tutti gli errori sono istanze di `WorkspaceYamlError` con un `code` leggibile automaticamente:

| Codice | Descrizione |
|------|-------------|
| `INVALID_ARGUMENT` | Parametro di input non valido |
| `ALREADY_EXISTS` | Il file esiste già e la sovrascrittura è false |
| `NOT_FOUND` | File non trovato |
| `IO_ERROR` | Operazione sul file system non riuscita |
| `INVALID_WORKSPACE` | Configurazione dell’area di lavoro non valida |
| `INVALID_OPENAPI` | Documento OpenAPI non valido |
| `ROLLBACK_FAILED` | Ripristino della transazione non riuscito |

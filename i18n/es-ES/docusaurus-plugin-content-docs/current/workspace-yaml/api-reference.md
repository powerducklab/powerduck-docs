---
sidebar_position: 4
title: "Referencia de la API"
description: "Funciones, opciones y códigos de error de las capas principal y de archivos."
---

# Referencia de la API

## Capa principal (`@powerduck/workspace-yaml/core`)

| Función | Descripción |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Genera una cadena con el contenido de workspace.yaml |
| `createOpenApiYaml(options)` | Genera una cadena de contenido YAML de OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Genera el contenido del espacio de trabajo y de OpenAPI |
| `parseWorkspaceYaml(content)` | Analiza y valida una cadena workspace.yaml |

### `createOpenApiYaml(options)` — Opción

| Opción | Tipo | Obligatorio | Descripción |
|--------|------|----------|-------------|
| `title` | `string` | Sí | Título de la API |
| `version` | `string` | No | Valor predeterminado `"1.0.0"` |
| `description` | `string` | No | Descripción de la API |
| `contact` | `{ name?, url?, email? }` | No | Información de contacto |
| `license` | `{ name, url? }` | No | Información de licencia |
| `servers` | `Array<{ url, description? }>` | No | Lista de servidores |

## Capa de archivos (`@powerduck/workspace-yaml`)

| Función | Descripción |
|----------|-------------|
| `initializeWorkspace(options)` | Crea un archivo workspace.yaml en disco |
| `initializeOpenApi(options)` | Crea un archivo YAML OpenAPI en disco |
| `createWorkspaceApi(options)` | Crea ambos archivos de forma atómica (revierte los cambios si falla) |

### `createWorkspaceApi(options)` — Opción

| Opción | Tipo | Obligatorio | Descripción |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Sí | Directorio de destino |
| `oasId` | `string` | Sí | Identificador único de la API |
| `name` | `string` | Sí | Nombre para mostrar |
| `file` | `string` | No | Ruta relativa (predeterminada: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | No | Título de la API (por defecto, `name`) |
| `version` | `string` | No | Versión de la API (predeterminada: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | No | Valor predeterminado `false` |

## Errores

Todos los errores son instancias de `WorkspaceYamlError` con un `code` legible por máquina:

| Código | Descripción |
|------|-------------|
| `INVALID_ARGUMENT` | Parámetro de entrada no válido |
| `ALREADY_EXISTS` | El archivo ya existe y la sobrescritura es false |
| `NOT_FOUND` | Archivo no encontrado |
| `IO_ERROR` | La operación del sistema de archivos ha fallado |
| `INVALID_WORKSPACE` | Configuración del espacio de trabajo no válida |
| `INVALID_OPENAPI` | Documento OpenAPI no válido |
| `ROLLBACK_FAILED` | Ha fallado la reversión de la transacción |

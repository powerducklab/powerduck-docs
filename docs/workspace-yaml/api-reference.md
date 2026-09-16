---
sidebar_position: 4
title: "API Reference"
description: "Core layer and file layer functions, options, and error codes."
---

# API Reference

## Core layer (`@powerduck/workspace-yaml/core`)

| Function | Description |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Generate a workspace.yaml content string |
| `createOpenApiYaml(options)` | Generate an OpenAPI 3.2 YAML content string |
| `createWorkspaceWithApi(options)` | Generate both workspace and OpenAPI content |
| `parseWorkspaceYaml(content)` | Parse and validate a workspace.yaml string |

### `createOpenApiYaml(options)` options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | Yes | API title |
| `version` | `string` | No | Default `"1.0.0"` |
| `description` | `string` | No | API description |
| `contact` | `{ name?, url?, email? }` | No | Contact info |
| `license` | `{ name, url? }` | No | License info |
| `servers` | `Array<{ url, description? }>` | No | Server list |

## File layer (`@powerduck/workspace-yaml`)

| Function | Description |
|----------|-------------|
| `initializeWorkspace(options)` | Create a workspace.yaml file on disk |
| `initializeOpenApi(options)` | Create an OpenAPI YAML file on disk |
| `createWorkspaceApi(options)` | Create both files atomically (rollback on failure) |

### `createWorkspaceApi(options)` options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Yes | Target directory |
| `oasId` | `string` | Yes | Unique API identifier |
| `name` | `string` | Yes | Display name |
| `file` | `string` | No | Relative path (default: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | No | API title (defaults to `name`) |
| `version` | `string` | No | API version (default: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | No | Default `false` |

## Errors

All errors are instances of `WorkspaceYamlError` with a machine-readable `code`:

| Code | Description |
|------|-------------|
| `INVALID_ARGUMENT` | Invalid input parameter |
| `ALREADY_EXISTS` | File already exists (and overwrite is false) |
| `NOT_FOUND` | File not found |
| `IO_ERROR` | Filesystem operation failed |
| `INVALID_WORKSPACE` | Invalid workspace configuration |
| `INVALID_OPENAPI` | Invalid OpenAPI document |
| `ROLLBACK_FAILED` | Transaction rollback failed |

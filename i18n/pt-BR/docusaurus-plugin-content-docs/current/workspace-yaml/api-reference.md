---
sidebar_position: 4
title: "Referência da API"
description: "Funções, opções e códigos de erro das camadas principal e de arquivos."
---

# Referência da API

## Camada principal (`@powerduck/workspace-yaml/core`)

| Função | Descrição |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Gera uma string com o conteúdo de workspace.yaml |
| `createOpenApiYaml(options)` | Gera uma string de conteúdo YAML do OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Gera o conteúdo do espaço de trabalho e do OpenAPI |
| `parseWorkspaceYaml(content)` | Interpreta e valida uma string workspace.yaml |

### `createOpenApiYaml(options)` — Opção

| Opção | Tipo | Obrigatório | Descrição |
|--------|------|----------|-------------|
| `title` | `string` | Sim | Título da API |
| `version` | `string` | Não | Padrão `"1.0.0"` |
| `description` | `string` | Não | Descrição da API |
| `contact` | `{ name?, url?, email? }` | Não | Informações de contato |
| `license` | `{ name, url? }` | Não | Informações da licença |
| `servers` | `Array<{ url, description? }>` | Não | Lista de servidores |

## Camada de arquivos (`@powerduck/workspace-yaml`)

| Função | Descrição |
|----------|-------------|
| `initializeWorkspace(options)` | Cria um arquivo workspace.yaml em disco |
| `initializeOpenApi(options)` | Cria um arquivo YAML OpenAPI em disco |
| `createWorkspaceApi(options)` | Cria ambos os arquivos de forma atômica (reverte em caso de falha) |

### `createWorkspaceApi(options)` — Opção

| Opção | Tipo | Obrigatório | Descrição |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Sim | Diretório de destino |
| `oasId` | `string` | Sim | Identificador único da API |
| `name` | `string` | Sim | Nome de exibição |
| `file` | `string` | Não | Caminho relativo (padrão: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Não | Título da API (padrão: `name`) |
| `version` | `string` | Não | Versão da API (padrão: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Não | Padrão `false` |

## Erros

Todos os erros são instâncias de `WorkspaceYamlError` com um `code` legível por máquina:

| Código | Descrição |
|------|-------------|
| `INVALID_ARGUMENT` | Parâmetro de entrada inválido |
| `ALREADY_EXISTS` | O arquivo já existe e a sobrescrita é false |
| `NOT_FOUND` | Arquivo não encontrado |
| `IO_ERROR` | Falha na operação do sistema de arquivos |
| `INVALID_WORKSPACE` | Configuração do espaço de trabalho inválida |
| `INVALID_OPENAPI` | Documento OpenAPI inválido |
| `ROLLBACK_FAILED` | Falha na reversão da transação |

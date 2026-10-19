---
sidebar_position: 4
title: "API-Referenz"
description: "Funktionen, Optionen und Fehlercodes der Kern- und Dateischicht."
---

# API-Referenz

## Kernschicht (`@powerduck/workspace-yaml/core`)

| Funktion | Beschreibung |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Erzeugt den Inhalt von workspace.yaml als String |
| `createOpenApiYaml(options)` | Erzeugt OpenAPI-3.2-YAML-Inhalt als String |
| `createWorkspaceWithApi(options)` | Erzeugt Arbeitsbereichs- und OpenAPI-Inhalte gemeinsam |
| `parseWorkspaceYaml(content)` | Parst und validiert einen workspace.yaml-String |

### `createOpenApiYaml(options)` — Option

| Option | Typ | Erforderlich | Beschreibung |
|--------|------|----------|-------------|
| `title` | `string` | Ja | API-Titel |
| `version` | `string` | Nein | Standardwert `"1.0.0"` |
| `description` | `string` | Nein | API-Beschreibung |
| `contact` | `{ name?, url?, email? }` | Nein | Kontaktinformationen |
| `license` | `{ name, url? }` | Nein | Lizenzinformationen |
| `servers` | `Array<{ url, description? }>` | Nein | Serverliste |

## Dateischicht (`@powerduck/workspace-yaml`)

| Funktion | Beschreibung |
|----------|-------------|
| `initializeWorkspace(options)` | Erstellt eine workspace.yaml-Datei auf dem Datenträger |
| `initializeOpenApi(options)` | Erstellt eine OpenAPI-YAML-Datei auf dem Datenträger |
| `createWorkspaceApi(options)` | Erstellt beide Dateien atomar (Rollback bei Fehlern) |

### `createWorkspaceApi(options)` — Option

| Option | Typ | Erforderlich | Beschreibung |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Ja | Zielverzeichnis |
| `oasId` | `string` | Ja | Eindeutige API-Kennung |
| `name` | `string` | Ja | Anzeigename |
| `file` | `string` | Nein | Relativer Pfad (Standard: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Nein | API-Titel (standardmäßig `name`) |
| `version` | `string` | Nein | API-Version (Standard: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Nein | Standardwert `false` |

## Fehler

Alle Fehler sind Instanzen von `WorkspaceYamlError` mit einem maschinenlesbaren `code`:

| Code | Beschreibung |
|------|-------------|
| `INVALID_ARGUMENT` | Ungültiger Eingabeparameter |
| `ALREADY_EXISTS` | Datei existiert bereits und Überschreiben ist false |
| `NOT_FOUND` | Datei nicht gefunden |
| `IO_ERROR` | Dateisystemoperation fehlgeschlagen |
| `INVALID_WORKSPACE` | Ungültige Arbeitsbereichskonfiguration |
| `INVALID_OPENAPI` | Ungültiges OpenAPI-Dokument |
| `ROLLBACK_FAILED` | Transaktions-Rollback fehlgeschlagen |

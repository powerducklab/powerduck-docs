---
sidebar_position: 1
title: "Open-Source-Bibliotheken"
description: "Die npm-Pakete @powerduck/* bilden die Grundlage von Desktop-Client und Cloud: Parsing, Upgrades, Mehrprotokoll-CLI, Codegenerierung, MCP, Anfragen, Konvertierung und einbettbare Editoren und Ansichten."
---

# Open-Source-Bibliotheken

Powerduck besteht aus kleinen, kombinierbaren npm-Paketen. Desktop-Client und Clouddienst bauen auf denselben Bibliotheken auf. So laufen dieselben Komponenten lokal, über das Netzwerk oder in Ihren eigenen Werkzeugen.

Jedes Paket wird unabhängig veröffentlicht und hat eigene Installationshinweise, eine API-Referenz und Beispiele. Diese Seite beschreibt Aufgaben und Zusammenspiel der Pakete.

## Aufbau der Schichten

```text
Powerduck / Cloud
        ↓
Einbettbare Oberfläche
        ↓
Abläufe
        ↓
Grundlage
```

Parser und Konverter bilden die Grundlage. Darauf bauen übergeordnete Abläufe und schließlich die einbettbare Oberfläche auf. Die gemeinsame Basis sorgt für einheitliches Verhalten, ohne das Parsing in jedem Paket erneut zu implementieren.

## Die Pakete

### Grundlage

| Paket | Aufgabe |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | OpenAPI-/Swagger-Dokumente parsen, validieren und aktualisieren |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Strukturierte, validierte Konfigurationsänderungen anwenden |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Andere Formate wie cURL und Postman in OpenAPI umwandeln |

### Abläufe

| Paket | Aufgabe |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Mehrprotokoll-Abläufe über die Kommandozeile, einschließlich Szenarioläufen |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Clientcode und weitere Artefakte aus einer Spezifikation erzeugen |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Eine OpenAPI-Spezifikation als MCP-Server bereitstellen |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | In einer Spezifikation beschriebene Anfragen ausführen |

### Einbettbare Oberfläche

| Paket | Aufgabe |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | OpenAPI als lesbare Dokumentation darstellen, mit React-Einstiegspunkt |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Einbettbarer Markdown-Editor |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Einbettbarer JSON-Schema-Editor |
| [`@powerduck/tree`](../tree/introduction.md) | Baumkomponente für strukturierte Daten |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Integration von Workspace-YAML |

## Das passende Paket auswählen

- **OpenAPI-Dateien lesen, validieren oder aktualisieren:** Beginnen Sie mit `openapi-parser`.
- **cURL oder eine Postman-Sammlung in OpenAPI umwandeln:** Verwenden Sie `x-to-openapi`.
- **Szenarien oder Mehrprotokoll-Abläufe über Kommandozeile oder CI ausführen:** Verwenden Sie `openapi-cli`.
- **Clientcode erzeugen:** Verwenden Sie `openapi-codegen`.
- **Eine API als Tools für einen KI-Agenten bereitstellen:** Verwenden Sie `openapi-mcp-server`.
- **Gerenderte Dokumentation in eine React-App einbetten:** Verwenden Sie `oas-document` mit React-Einstiegspunkt und zugehörigem CSS.
- **Einen Editor einbetten:** Verwenden Sie `md-editor` oder `schema-editor`.

## Funktionen mit Agenten teilen

Über das MCP-Server-Paket können auch externe KI-Agenten die Funktionen nutzen. Eine mit `openapi-mcp-server` bereitgestellte Spezifikation stellt ihre Operationen als MCP-Tools zur Verfügung. Derselbe Vertrag, der Dokumentation und Codegenerierung bestimmt, lässt sich damit direkt vom Agenten aufrufen. Desktop-Client, Cloud und weitere MCP-kompatible Werkzeuge arbeiten so mit derselben maßgeblichen Definition.

## Hinweise zu den Beispielen

Die Codebeispiele orientieren sich an der tatsächlichen Paket-API und sollen wie gezeigt ausführbar sein. Prüfen Sie nach einem Paketupdate die Versionshinweise auf aktuelle Parameter, statt Beispiele älterer Versionen ungeprüft zu übernehmen.

Über die Seitenleiste erreichen Sie Installation, Konfiguration und vollständige API-Referenz jedes Pakets.

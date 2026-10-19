---
sidebar_position: 1
title: "Einführung"
description: "Initialisieren Sie workspace.yaml und OpenAPI-3.2-YAML-Dateien zuverlässig. Browsergeeignet: Reine Funktionen erzeugen YAML-Inhalte als Strings, ohne auf das Dateisystem zuzugreifen. Erweitert die Kernschicht unter Node.js / Electron um atomare Schreibvorgänge, Dateisperren und die Normalisierung von Pfaden."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Initialisieren Sie workspace.yaml und OpenAPI-3.2-YAML-Dateien zuverlässig.

Architektur mit zwei Schichten:
- **Kernschicht**: Browsergeeignet: Reine Funktionen erzeugen YAML-Inhalte als Strings, ohne auf das Dateisystem zuzugreifen.
- **Dateischicht**: Erweitert die Kernschicht unter Node.js / Electron um atomare Schreibvorgänge, Dateisperren und die Normalisierung von Pfaden.

- **Paketname:** `@powerduck/workspace-yaml`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Lizenz:** MIT

Diese Bibliothek dient **nur zur Initialisierung von Dateien**, also zum Anlegen neuer Dateien oder zur manuellen Erstellung. Sie implementiert das Lesen, Patchen oder Aktualisieren von YAML-Dateien **nicht erneut**. Verwenden Sie für diese Vorgänge [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Nächste Schritte

- [Installation](/docs/de-DE/workspace-yaml/installation/)
- [Schnellstart](/docs/de-DE/workspace-yaml/quickstart/)
- [API-Referenz](/docs/de-DE/workspace-yaml/api-reference/)
- [Beispiele](/docs/de-DE/workspace-yaml/examples/)

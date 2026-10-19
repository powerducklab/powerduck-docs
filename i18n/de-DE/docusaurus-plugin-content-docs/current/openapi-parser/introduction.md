---
sidebar_position: 1
title: "Einführung"
description: "Konvertieren Sie jedes Swagger-2.0-, OpenAPI-3.0-, 3.1- oder 3.2-Dokument mit einem Aufruf in OpenAPI 3.2."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Konvertieren Sie jedes Swagger-2.0-, OpenAPI-3.0-, 3.1- oder 3.2-Dokument mit einem Aufruf in OpenAPI 3.2.

Eine schlanke Hülle um diese beiden Bibliotheken: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Parsing, Validierung und Konvertierung werden nicht neu implementiert, sondern miteinander verbunden. Jeder Fehler erhält eine einheitliche, vorhersehbare Struktur mit einem maschinenlesbaren Fehlercode.

- **Paketname:** `@powerduck/openapi-parser`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Lizenz:** MIT
- **Node.js:** >= 22.12.0

## Funktionen

- **Eine Funktion für alle Versionen** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x und 3.2.x werden in ein validiertes 3.2-Dokument konvertiert.
- **JSON- und YAML-Strings als Eingabe** — Übergeben Sie ein bereits geparstes Objekt oder einen unverarbeiteten JSON/YAML-String.
- **Maschinenlesbare Fehlercodes** — Jeder Fehler wird als `OpenApiUpgradeError` mit einem Enum-Wert aus `UpgradeErrorCode` ausgegeben.
- **Keine Änderung der Eingabe** — Vor jedem Konvertierungsschritt wird die Eingabe mit `structuredClone` tief kopiert.
- **Schutz vor zirkulären Referenzen** — Erkennt zyklische Eingaben, bevor sie einen Stapelüberlauf verursachen.
- **Ausgabevalidierung** — Das konvertierte 3.2-Dokument wird standardmäßig anhand des Schemas validiert.
- **ESM und CJS** — `import` für modernes Node und Bundler, `require()` für den Electron-Hauptprozess.

## Nächste Schritte

- [Installation](/docs/de-DE/openapi-parser/installation/) — Installation und Voraussetzungen
- [Schnellstart](/docs/de-DE/openapi-parser/quickstart/) — Ihr erstes Dokument konvertieren
- [API-Referenz](/docs/de-DE/openapi-parser/api-reference/) — alle Exporte, Fehlercodes und Optionen
- [Beispiele](/docs/de-DE/openapi-parser/examples/) — Fehlerbehandlung, Optionen und Verwendung mit CommonJS

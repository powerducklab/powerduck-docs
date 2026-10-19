---
sidebar_position: 1
title: "Einführung"
description: "Produktionsreife OpenAPI-Dokumentationskomponente für React. Übergeben Sie ein OAS-Dokument und erhalten Sie eine vollständige API-Dokumentationsoberfläche im Stripe-Stil mit Kopfnavigation, hellen und dunklen Themes, Baumnavigation, Scrollverfolgung, Schemaansicht und Codebeispielen in mehreren Sprachen."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

Produktionsreife OpenAPI-Dokumentationskomponente für React. Übergeben Sie ein OAS-Dokument und erhalten Sie eine vollständige API-Dokumentationsoberfläche im Stripe-Stil mit Kopfnavigation, hellen und dunklen Themes, Baumnavigation, Scrollverfolgung, Schemaansicht und Codebeispielen in mehreren Sprachen.

- **Paketname:** `@powerduck/oas-document`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **Lizenz:** MIT

Verwendete Bibliotheken: `@powerduck/openapi-parser` (Validierung und automatische Konvertierung), `@powerduck/tree` (Navigation), `@powerduck/md-editor` (Markdown-Darstellung), `@powerduck/openapi-codegen` (Erzeugung von Anfragecode).

## Funktionen

- **Direkt integrierbare API-Dokumentation** — Akzeptiert ein geparstes Objekt, einen JSON-String oder einen YAML-String
- **Layout im Stripe-Stil** — Konfigurierbare Kopfzeile, Seitenleistenbaum und zweispaltige Operationsansicht
- **Helle und dunkle Themes** — Umschalten in der Kopfzeile, Speicherung in localStorage
- **Automatische Konvertierung zu OAS 3.2** — Validiert und konvertiert mit `@powerduck/openapi-parser`
- **Scrollabhängige Navigation** — Passiver Scroll-Listener mit binärer Suche
- **Markdown-Darstellung** — Beschreibungen werden mit `@powerduck/md-editor` dargestellt
- **Codebeispiele in mehreren Sprachen** — Erzeugt mit `@powerduck/openapi-codegen`
- **Schemaansicht** — Verschachtelte Eigenschaftstabellen zum Auf- und Zuklappen
- **Responsives Layout** — Auf Mobilgeräten wird die Seitenleiste als Overlay eingeblendet

## Nächste Schritte

- [Installation](/docs/de-DE/oas-document/installation/)
- [Schnellstart](/docs/de-DE/oas-document/quickstart/)
- [API-Referenz](/docs/de-DE/oas-document/api-reference/)
- [Beispiele](/docs/de-DE/oas-document/examples/)

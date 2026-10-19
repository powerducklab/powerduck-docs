---
sidebar_position: 1
title: "Einführung"
description: "Erweiterbare Baumkomponente für API-Navigation, Schemaansichten und Dokumentation. Basiert auf einem generischen Kern mit Adaptern für OpenAPI, JSON Schema und eigene Datenquellen."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Erweiterbare Baumkomponente für API-Navigation, Schemaansichten und Dokumentation. Basiert auf einem generischen Kern mit Adaptern für OpenAPI, JSON Schema und eigene Datenquellen.

- **Paketname:** `@powerduck/tree`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Lizenz:** MIT

## Funktionen

- **Generischer Kern** — `TreeNode<TMetadata>` funktioniert mit jeder Datenquelle
- **OpenAPI-Adapter** — Tagbasierte Navigation mit verschachtelten OAS-3.2-Tags, `x-tagGroups`, `x-order`, `x-displayName` und `x-internal`
- **JSON-Schema-Adapter** — Tiefes Aufklappen verschachtelter Eigenschaften, Arrays und Kombinatoren mit `jsonPath`-Metadaten
- **Dokumentationsadapter** — Dokumentationsbaum im Stripe-Stil mit Badges für die Anzahl der Operationen
- **React-Komponente** — Suche, Auf- und Zuklappen, Tastaturnavigation, Methoden-Badges und eigene Render-Props
- **Drag-and-drop** — Umsortieren unter demselben Elternknoten und Verschieben in Ordner anderer Ebenen
- **Kontextmenü** — Knotenaktionen per Rechtsklick oder Mehr-Schaltfläche
- **Imperatives Auffinden** — `locateNode(predicate)` findet einen Knoten, klappt seine Vorfahren auf, wählt ihn aus und scrollt ihn in den sichtbaren Bereich
- **JSON-Patch-Integration** — Der Callback `onPatch` gibt RFC-6902-Operationen aus
- **Themes über CSS-Variablen** — Kompatibel mit Powerducks `tokens.css` sowie hellem und dunklem Modus

## Nächste Schritte

- [Installation](/docs/de-DE/tree/installation/)
- [Schnellstart](/docs/de-DE/tree/quickstart/)
- [API-Referenz](/docs/de-DE/tree/api-reference/)
- [Beispiele](/docs/de-DE/tree/examples/)

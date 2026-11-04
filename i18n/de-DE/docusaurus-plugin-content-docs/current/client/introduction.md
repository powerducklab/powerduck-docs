---
sidebar_position: 1
title: "API-Arbeitsbereich · Code-Review"
description: "Powerduck hilft, KI-generierte Änderungen mit ihrem Kontext zu prüfen und den nächsten Schritt zu entscheiden. Die Desktop-App bietet einen API-Arbeitsbereich und Code-Reviews, jeweils direkt über die Startseite."
---

# API-Arbeitsbereich · Code-Review

Powerduck hilft, KI-generierte Änderungen mit ihrem Kontext zu prüfen und den nächsten Schritt zu entscheiden. Die Desktop-App bietet einen API-Arbeitsbereich und Code-Reviews, jeweils direkt über die Startseite.

## API-Arbeitsbereich

OpenAPI als YAML oder JSON importieren, Operationen entwerfen, Anfragen senden, Antworten prüfen sowie Szenarien, lokale Mocks, Datenmodelle und Dokumentation nutzen. MCP und Veröffentlichung sind eigene Abläufe. Ein Import stellt kein Geschäfts-Backend bereit.

## Code-Review

Nach der Ordnerwahl erscheint die Projektstruktur. Dateien lassen sich vollständig lesen: nur Quelltext, vollständiger Vergleich oder nur Änderungen. Zeilen- und Zeichenmarkierungen, Änderungsnavigation und Suche zeigen den tatsächlichen Eingriff im Kontext.

## Projektstruktur und verknüpfter Code

Git und Parser liefern Änderungsblöcke sowie auflösbare Definitionen, Aufrufer und Importe. Unterstützte Symbole zeigen beim Darüberfahren Definitionen; verknüpfter Code öffnet sich an der Änderung. Die Struktur markiert häufig referenzierte Dateien, temporäre Namen, identische Inhalte und fehlende eingehende Referenzen. Dynamisches Laden und externe Nutzer können fehlen; fehlende Referenzen erlauben keine sichere Löschung.

## Integrierte KI und Nutzung

Mit Google oder GitHub anmelden. Nur das integrierte Modell ist verfügbar, ohne Modellwahl, eigene Schlüssel oder Endpunkte. Angeforderte KI-Arbeit sendet ausgewählten Kontext an verwaltete Anbieter. Übliche Abhängigkeits-, Build- und Zugangsdatenpfade werden ausgeschlossen; Geheimnisse im Quelltext sind trotzdem möglich.

- [API-Arbeitsbereich](introduction.md)
- [Code-Review](code-quality.md)
- [Integrierte KI und Nutzung](ai-models.md)
- [Tarife und Aufgaben](../cloud/billing.md)
- [Installieren und starten](../overview/installation.md)
- [Jede Änderung verstehen](../overview/quickstart.md)

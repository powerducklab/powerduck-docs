---
sidebar_position: 3
title: "Schnellstart"
description: "Powerduck hilft, KI-generierte Änderungen mit ihrem Kontext zu prüfen und den nächsten Schritt zu entscheiden. Die Desktop-App bietet einen API-Arbeitsbereich und Code-Reviews, jeweils direkt über die Startseite."
---

# Schnellstart

Den passenden macOS-Installer für Apple Silicon oder Intel, Windows oder Linux AppImage von der offiziellen Seite laden. Quelle und Herausgeber prüfen, Schutzfunktionen nicht abschalten. Im Web anmelden und zur App zurückkehren; API-Datei oder Codeprojekt wählen. Die Browser-App zeigt API-Abläufe; lokale Analyse und Befehle benötigen die Desktop-App.

## API-Arbeitsbereich

OpenAPI als YAML oder JSON importieren, Operationen entwerfen, Anfragen senden, Antworten prüfen sowie Szenarien, lokale Mocks, Datenmodelle und Dokumentation nutzen. MCP und Veröffentlichung sind eigene Abläufe. Ein Import stellt kein Geschäfts-Backend bereit.

## Code-Review

Nach der Ordnerwahl erscheint die Projektstruktur. Dateien lassen sich vollständig lesen: nur Quelltext, vollständiger Vergleich oder nur Änderungen. Zeilen- und Zeichenmarkierungen, Änderungsnavigation und Suche zeigen den tatsächlichen Eingriff im Kontext.

## Vergleich und Rundenverlauf

Die aktuelle Runde vergleicht ihren gespeicherten Ausgangspunkt mit Dateien auf der Festplatte. Beim ersten Öffnen wird ein Ausgangspunkt angelegt; vorhandener Inhalt ist nicht automatisch neu. Alle nicht eingecheckten Änderungen werden mit Git HEAD verglichen. Neue Runden bewusst starten und alte im Verlauf auswählen. Der lokale Verlauf ersetzt kein Git-Backup. Änderungen zuerst speichern.

## Prüfungen ausführen

Projektbefehle ausdrücklich ausführen und Befehl, Exit-Code und Rohdaten prüfen. Fehlende Skripte gelten als ungeprüft. Nur vertrauenswürdige Projekte ausführen. Dateilesen, statische Analyse und KI sind keine Ausführungsbelege; gelesen bedeutet nur Lesefortschritt.

- [API-Arbeitsbereich](../client/introduction.md)
- [Code-Review](../client/code-quality.md)
- [Integrierte KI und Nutzung](../client/ai-models.md)
- [Tarife und Aufgaben](../cloud/billing.md)
- [Installieren und starten](installation.md)
- [Jede Änderung verstehen](quickstart.md)

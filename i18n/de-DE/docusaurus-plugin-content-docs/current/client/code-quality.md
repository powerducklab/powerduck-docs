---
sidebar_position: 10
title: "Code-Review"
description: "Powerduck hilft, KI-generierte Änderungen mit ihrem Kontext zu prüfen und den nächsten Schritt zu entscheiden. Die Desktop-App bietet einen API-Arbeitsbereich und Code-Reviews, jeweils direkt über die Startseite."
---

# Code-Review

Nach der Ordnerwahl erscheint die Projektstruktur. Dateien lassen sich vollständig lesen: nur Quelltext, vollständiger Vergleich oder nur Änderungen. Zeilen- und Zeichenmarkierungen, Änderungsnavigation und Suche zeigen den tatsächlichen Eingriff im Kontext.

## Vergleich und Rundenverlauf

Die aktuelle Runde vergleicht ihren gespeicherten Ausgangspunkt mit Dateien auf der Festplatte. Beim ersten Öffnen wird ein Ausgangspunkt angelegt; vorhandener Inhalt ist nicht automatisch neu. Alle nicht eingecheckten Änderungen werden mit Git HEAD verglichen. Neue Runden bewusst starten und alte im Verlauf auswählen. Der lokale Verlauf ersetzt kein Git-Backup. Änderungen zuerst speichern.

## Projektstruktur und verknüpfter Code

Git und Parser liefern Änderungsblöcke sowie auflösbare Definitionen, Aufrufer und Importe. Unterstützte Symbole zeigen beim Darüberfahren Definitionen; verknüpfter Code öffnet sich an der Änderung. Die Struktur markiert häufig referenzierte Dateien, temporäre Namen, identische Inhalte und fehlende eingehende Referenzen. Dynamisches Laden und externe Nutzer können fehlen; fehlende Referenzen erlauben keine sichere Löschung.

## KI-Review im Code

KI-Reviews starten auf Anforderung und verarbeiten begrenzte Differenzen mit zugehörigem Kontext in Paketen statt jeder vollständigen Datei. Passende Cache-Ergebnisse sind wiederverwendbar. Hinweise erscheinen mit Priorität, Beleg und Empfehlung am Code. Als Problem bestätigen, Fehlalarm markieren oder an einen Agent übergeben. KI beweist weder Korrektheit noch ausgeführte Tests.

## Agent-Aufgabenpakete

Mehrere Hinweise als Markdown mit Code und Revisionsankern ansehen, kopieren oder herunterladen. Der empfangende Agent soll unabhängig urteilen; eine Änderungserlaubnis wird ausdrücklich angegeben. JSON-Berichte bleiben manuell zu prüfen. Eine Reparaturbehauptung ist kein bestandener Test. Der Export kontaktiert oder startet keinen Agent automatisch.

## Prüfungen ausführen

Projektbefehle ausdrücklich ausführen und Befehl, Exit-Code und Rohdaten prüfen. Fehlende Skripte gelten als ungeprüft. Nur vertrauenswürdige Projekte ausführen. Dateilesen, statische Analyse und KI sind keine Ausführungsbelege; gelesen bedeutet nur Lesefortschritt.

## Integrierte KI und Nutzung

Mit Google oder GitHub anmelden. Nur das integrierte Modell ist verfügbar, ohne Modellwahl, eigene Schlüssel oder Endpunkte. Angeforderte KI-Arbeit sendet ausgewählten Kontext an verwaltete Anbieter. Übliche Abhängigkeits-, Build- und Zugangsdatenpfade werden ausgeschlossen; Geheimnisse im Quelltext sind trotzdem möglich.

- [API-Arbeitsbereich](introduction.md)
- [Code-Review](code-quality.md)
- [Integrierte KI und Nutzung](ai-models.md)
- [Tarife und Aufgaben](../cloud/billing.md)
- [Installieren und starten](../overview/installation.md)
- [Jede Änderung verstehen](../overview/quickstart.md)

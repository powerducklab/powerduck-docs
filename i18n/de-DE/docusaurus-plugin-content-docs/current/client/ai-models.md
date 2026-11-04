---
sidebar_position: 15
title: "Integrierte KI und Nutzung"
description: "Powerduck hilft, KI-generierte Änderungen mit ihrem Kontext zu prüfen und den nächsten Schritt zu entscheiden. Die Desktop-App bietet einen API-Arbeitsbereich und Code-Reviews, jeweils direkt über die Startseite."
---

# Integrierte KI und Nutzung

Mit Google oder GitHub anmelden. Nur das integrierte Modell ist verfügbar, ohne Modellwahl, eigene Schlüssel oder Endpunkte. Angeforderte KI-Arbeit sendet ausgewählten Kontext an verwaltete Anbieter. Übliche Abhängigkeits-, Build- und Zugangsdatenpfade werden ausgeschlossen; Geheimnisse im Quelltext sind trotzdem möglich.

## KI-Review im Code

KI-Reviews starten auf Anforderung und verarbeiten begrenzte Differenzen mit zugehörigem Kontext in Paketen statt jeder vollständigen Datei. Passende Cache-Ergebnisse sind wiederverwendbar. Hinweise erscheinen mit Priorität, Beleg und Empfehlung am Code. Als Problem bestätigen, Fehlalarm markieren oder an einen Agent übergeben. KI beweist weder Korrektheit noch ausgeführte Tests.

## Tarife und Aufgaben

Ein Gesprächszug oder Review zählt als Aufgabe; interne Aufrufe kosten nicht jeweils extra. Während der Ausführung wird reserviert. Ein geliefertes Ergebnis zählt einmal, auch bei anschließendem Abbruch; ohne erfolgreiches Ergebnis wird freigegeben. Große Reviews aufteilen. Lokales Lesen, Git/AST und gespeicherte Ergebnisse verbrauchen keine Aufgaben. Alt-Abos können Credits behalten; maßgeblich ist die Kontoanzeige.

- [API-Arbeitsbereich](introduction.md)
- [Code-Review](code-quality.md)
- [Integrierte KI und Nutzung](ai-models.md)
- [Tarife und Aufgaben](../cloud/billing.md)
- [Installieren und starten](../overview/installation.md)
- [Jede Änderung verstehen](../overview/quickstart.md)

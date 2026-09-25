---
sidebar_position: 7
title: Lokaler Mock-Server
description: "Führen Sie einen lokalen Mock Ihrer OpenAPI-API mit Wahl von Port, Basispfad, Latenz und Antwortüberschreibungen aus und prüfen Sie empfangene Requests."
---

# Lokaler Mock-Server

Der Mock-Server liefert direkt aus der Spec einen funktionierenden Klon Ihrer API, um Frontend- und Client-Arbeit voranzubringen, bevor das Backend bereit ist. Keine externe Infrastruktur nötig; er läuft im Desktop-Hauptprozess.

## Einen Mock starten

Sie können im Mock-Server-Modus oder direkt im KI-Chat starten; aus dem Chat bestätigt die App die Dienstadresse.

Verfügbare Optionen.

| Option | Bereich/Form | Zweck |
|---|---|---|
| `port` | Ganzzahl `1`–`65535` | Zu überwachender lokaler Port |
| `basePath` | URL-Pfadpräfix | Unter einem Basispfad servieren |
| `latencyMs` | `0`–`10000` | Künstliche Verzögerung zur Nachahmung von Netzwerklatenz |
| `overrides` | bis zu 100 Antwortüberschreibungen | Für gewählte Operationen eine bestimmte Antwort zurückgeben |

Ungültige Port- oder Latenzwerte werden mit klarer Meldung abgelehnt, ohne einen kaputten Server zu starten.

## Mehrere Mocks

Mehrere Mocks lassen sich parallel ausführen — etwa einer pro geöffnetem Dokument. Die App listet laufende Mocks (`mock:list`) und kann einzeln stoppen (`mock:stop`). Jeder ist an eine Dokument-ID und einen Namen gebunden.

## Empfangene Requests prüfen

Der Mock zeichnet empfangene Requests auf; abrufbar (`mock:requests`, optionales Limit) und das Protokoll löschbar. So prüfen Sie, ob der Client die richtigen Operationen mit erwarteten Parametern aufruft, auch ohne echtes Backend.

## Antwortüberschreibungen

Wenn Standardbeispiele oder schemaabgeleitete Antworten nicht reichen, geben Überschreibungen für bestimmte Operationen eine gewählte Antwort zurück. Eine Obergrenze (maximal 100) hält die Konfiguration vorhersehbar.

## Wann nutzen

- Frontend-Entwicklung bei einem noch im Bau befindlichen Vertrag entblocken.
- Langsame Situationen oder Randfälle über Latenz und Antworten nachstellen.
- API-Abläufe ohne bereitgestellte Umgebung vorführen.
- Prüfen, ob ein generierter Client Operationen wie vorgesehen aufruft.

Der Mock liest dieselbe Spec wie alle anderen Modi und bleibt bei Entwurfsänderungen am Vertrag ausgerichtet.

Siehe auch: [Szenario-Tests](./scenario-testing)、[Mit dem Assistenten entwerfen](./design).

---
sidebar_position: 2
title: Installation
description: "Installieren Sie den Powerduck-Desktop-Client auf macOS, Windows und Linux. Die App ist Local-First und startet ohne Konto."
---

# Installation

Der Powerduck-Desktop-Client ist eine Local-First-App. Er wird wie jedes andere Desktop-Programm installiert, öffnet echte Dateien auf der Festplatte und startet ohne Konto.

## Download

Holen Sie das Installationsprogramm für Ihre Plattform von der [Powerduck-Website](https://www.powerduck.com/#download). Folgende Builds werden mit `electron-builder` erzeugt.

| Plattform | Installationsprogramm | Architekturen |
|---|---|---|
| macOS | `.dmg` (und `.zip` für automatische Updates) | Apple Silicon (`arm64`) und Intel (`x64`) |
| Windows | NSIS-Installationsprogramm (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Öffnen Sie das `.dmg` und ziehen Sie Powerduck in **Programme**.
2. Beim ersten Start kann macOS die Öffnung einer außerhalb des App Store geladenen App bestätigen lassen. Prüfen Sie zuvor, dass sie von der offiziellen Downloadseite stammt; deaktivieren Sie keine Sicherheitsprüfungen des Systems.
3. Zwei Builds sind veröffentlicht: `arm64` für Apple Silicon (M-Serie) und `x64` für Intel-Macs. Laden Sie den passenden.

## Windows

1. Starten Sie das NSIS-Installationsprogramm (`.exe`) und folgen der Einrichtung.
2. Meldet SmartScreen einen unbekannten Herausgeber, prüfen Sie zuerst, ob das Installationsprogramm von der offiziellen Downloadseite stammt. Fahren Sie erst nach Prüfung der Quelle fort; umgehen Sie die Warnung nicht bei einem nicht vertrauenswürdigen Download.

## Linux

1. Laden Sie das `.AppImage` herunter.
2. Machen Sie es ausführbar und starten es.

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

Das AppImage funktioniert ohne systemweite Installation. Einige Distributionen benötigen FUSE zum Einbinden.

## Was auf Ihrer Maschine läuft

Der Desktop-Client ist eine Electron-App aus zwei Teilen.

- Der **Hauptprozess** (Node.js), der Dateizugriff, externe HTTP-Requests, den lokalen Mock-Server, Datenbankverbindungen und das integrierte Terminal verwaltet.
- Der **Renderer** (der React-Arbeitsbereich), der Spec, KI-Chat und Werkzeuge anzeigt.

Die KI-Anfragen des Desktop-Clients werden über den Hauptprozess gesendet; CORS-Beschränkungen zwischen Browser und Anbieter greifen daher nicht. Prompts, relevanter Kontext und Zugangsdaten werden dennoch an den konfigurierten Modellendpunkt übertragen. Ein gehostetes Modell arbeitet nicht offline. Die Prozessgrenze garantiert auch nicht, dass Geheimnisse niemals in Protokollen oder Entwicklerwerkzeugen erscheinen. Siehe [KI und Modelle](../client/ai-models.md).

## Systemanforderungen

- macOS 11 oder neuer, Windows 10 oder neuer oder eine gängige Linux-Desktop-Distribution, die mit Electron 37 kompatibel ist.
- Genügend Speicherplatz für die App. Geöffnete Specs bleiben an ihrem Ursprungsort.
- Netzwerk nur für das Senden von Requests, die Synchronisierung von Git-Quellen oder den Aufruf gehosteter KI-Modelle nötig; der Rest funktioniert offline.

## Lizenz

Der Desktop-Client kann frei evaluiert werden. Er wird als **dauerhafte** Lizenz nach Einmalkauf verkauft, ohne Abonnement. Der Lizenzschlüssel wird beim Kauf erzeugt und einmal angezeigt. Cloud-Hosting ist ein separater Abonnement-Dienst. Siehe [Cloud-Abrechnung](../cloud/billing.md) für den Unterschied.

Weiter geht es mit dem [Schnellstart](./quickstart.md).

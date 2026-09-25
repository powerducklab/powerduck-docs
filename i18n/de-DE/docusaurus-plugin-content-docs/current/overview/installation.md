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
2. Beim ersten Start fragt macOS möglicherweise nach Bestätigung für eine außerhalb des App Stores geladene App. Erlauben Sie im Dialog, oder rechtsklicken Sie die App und wählen **Öffnen**.
3. Zwei Builds sind veröffentlicht: `arm64` für Apple Silicon (M-Serie) und `x64` für Intel-Macs. Laden Sie den passenden.

## Windows

1. Starten Sie das NSIS-Installationsprogramm (`.exe`) und folgen der Einrichtung.
2. Wenn SmartScreen einen nicht erkannten Herausgeber meldet, wählen Sie **Weitere Informationen**, dann **Ausführen**.

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

Diese Trennung zählt für Sicherheit und Zuverlässigkeit. Requests mit Netzwerk- und Dateisystemzugriff behandelt der Hauptprozess, nicht die WebView: Prompts und API-Schlüssel erscheinen nicht in der Browser-Konsole, und direkte Browser-CORS-Einschränkungen zum Anbieter greifen nicht. Siehe [KI und Modelle](/docs/client/ai-models).

## Systemanforderungen

- Aktuelles macOS, Windows 10 oder neuer oder eine größere Linux-Desktop-Distribution.
- Genügend Speicherplatz für die App. Geöffnete Specs bleiben an ihrem Ursprungsort.
- Netzwerk nur für das Senden von Requests, die Synchronisierung von Git-Quellen oder den Aufruf gehosteter KI-Modelle nötig; der Rest funktioniert offline.

## Lizenz

Der Desktop-Client kann frei evaluiert werden. Er wird als **dauerhafte** Lizenz nach Einmalkauf verkauft, ohne Abonnement. Der Lizenzschlüssel wird beim Kauf erzeugt und einmal angezeigt. Cloud-Hosting ist ein separater Abonnement-Dienst. Siehe [Cloud-Abrechnung](/docs/cloud/billing) für den Unterschied.

Weiter geht es mit dem [Schnellstart](/docs/overview/quickstart).

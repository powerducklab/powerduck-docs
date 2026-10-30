---
sidebar_position: 2
title: Installation
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Installation

Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

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

Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

## Systemanforderungen

- macOS 11 oder neuer, Windows 10 oder neuer oder eine gängige Linux-Desktop-Distribution, die mit Electron 37 kompatibel ist.
- Genügend Speicherplatz für die App. Geöffnete Specs bleiben an ihrem Ursprungsort.
- Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

## Powerduck · Free / Pro / Max

Free: täglich 300.000 credits, Rücksetzung um 00:00 UTC. Pro: 39 $/Monat und 18.000.000 credits je 7 Tage. Max: 99 $/Monat und 60.000.000 credits je 7 Tage. Der Zyklus beginnt mit dem ursprünglichen Abonnementstart und ist von der monatlichen Abrechnung unabhängig. Kein Übertrag. Desktop und AI Chat nutzen denselben persönlichen Tarif; Dauerlizenzen und Aktivierungsschlüssel werden nicht mehr verkauft.

Weiter geht es mit dem [Schnellstart](./quickstart.md).

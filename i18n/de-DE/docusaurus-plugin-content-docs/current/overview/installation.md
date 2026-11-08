---
sidebar_position: 2
title: "Installieren und starten"
description: "Powerduck hilft, KI-generierte Änderungen mit ihrem Kontext zu prüfen und den nächsten Schritt zu entscheiden. Die Desktop-App bietet einen API-Arbeitsbereich und Code-Reviews, jeweils direkt über die Startseite."
---

# Installieren und starten

Den passenden macOS-Installer für Apple Silicon oder Intel, Windows oder Linux AppImage von der offiziellen Seite laden. Quelle und Herausgeber prüfen, Schutzfunktionen nicht abschalten. Im Web anmelden und zur App zurückkehren; API-Datei oder Codeprojekt wählen. Die Browser-App zeigt API-Abläufe; lokale Analyse und Befehle benötigen die Desktop-App.

[Powerduck](https://www.powerduck.com/download.html)

## Integrierte KI und Nutzung

Mit Google oder GitHub anmelden. Nur das integrierte Modell ist verfügbar, ohne Modellwahl, eigene Schlüssel oder Endpunkte. Angeforderte KI-Arbeit sendet ausgewählten Kontext an verwaltete Anbieter. Übliche Abhängigkeits-, Build- und Zugangsdatenpfade werden ausgeschlossen; Geheimnisse im Quelltext sind trotzdem möglich.

## Tarife und Aufgaben

Neue Tarife zählen Gespräche und Reviews getrennt: Free 20/5; Starter $19/Monat 300/30; Pro $39/Monat 700/90; Max $99/Monat 2.000/270. Free wird am UTC-Monatsanfang zurückgesetzt, bezahlte Kontingente im Abo-Abrechnungszeitraum. Kein Übertrag. Endpreis und Steuern stehen im Checkout.

- [API-Arbeitsbereich](../client/introduction.md)
- [Code-Review](../client/code-quality.md)
- [Integrierte KI und Nutzung](../client/ai-models.md)
- [Tarife und Aufgaben](../cloud/billing.md)
- [Installieren und starten](installation.md)
- [Jede Änderung verstehen](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

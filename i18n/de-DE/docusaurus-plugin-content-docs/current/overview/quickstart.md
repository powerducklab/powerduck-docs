---
sidebar_position: 3
title: "Die erste lokale Anfrage – ohne Konto und ohne KI-Modell"
description: "Die erste lokale Anfrage – ohne Konto und ohne KI-Modell"
---

# Die erste lokale Anfrage – ohne Konto und ohne KI-Modell

## Das lokale Beispiel ausprobieren

Wähle in einem leeren Arbeitsbereich der Desktop-App **Beispiel ausprobieren** und starte den Durchlauf. Powerduck legt ein unabhängiges Beispiel an, startet den lokalen Mock-Server, sendet `GET /orders/summary` an den zugewiesenen Port und zeigt die tatsächliche Antwort an. Das Beispiel gilt erst nach HTTP 200 als abgeschlossen. Der Mock-Server stoppt nach der Anfrage oder wenn du das Beispiel schließt. Du kannst es jederzeit erneut ausführen. Installiere zuerst die App. Für diesen lokalen Ablauf brauchst du weder Internet noch ein Konto oder einen Modell-API-Schlüssel.

## Eine eigene Spezifikation öffnen

Importiere mit **Öffnen** ein OpenAPI-Dokument im YAML- oder JSON-Format. Das Beispiel überschreibt keine vorhandenen Dateien. Die kostenlose Nutzung begrenzt die Anzahl der Spezifikationen. Ist die Grenze erreicht, speichere und schließe oder entferne ein nicht mehr benötigtes Dokument. Verwirf keine ungespeicherten Änderungen, nur um das Beispiel auszuführen. Für vorhandene Projekte kannst du alternativ eine OpenAPI-Spezifikation aus dem Code erzeugen. Prüfe unklare Felder, bevor du dich auf das Ergebnis verlässt.

## Ein echtes Backend prüfen

Eine erfolgreiche Mock-Anfrage belegt noch nicht, dass dein Backend die Spezifikation erfüllt. Arbeite das [Beispiel für einen Vertragsfehler](/docs/de-DE/client/contract-example/) durch und [verbinde bei Bedarf einen Coding-Agenten](/docs/de-DE/client/coding-agent/). Für die manuelle Prüfung brauchst du kein KI-Modell.

## Optionale Modelle und häufige Fehler

- **Kein Modell konfiguriert:** Lokale Anfragen, Mock-Server und manuelle Vertragsprüfungen funktionieren trotzdem. Richte nur dann ein Modell in den Einstellungen ein, wenn du KI nutzen möchtest.
- **Verbindung zum Modelldienst fehlgeschlagen:** Prüfe Endpunkt, Schlüssel und Proxy in den Einstellungen. Veröffentliche keine Schlüssel oder Anfrage-Header in Fehlerberichten.
- **Ziel-API nicht erreichbar:** Prüfe, ob der Server läuft und ob URL, Port und Anfrageeinstellungen im Debugger stimmen.
- **HTTP 401/403:** Prüfe Authentifizierung und Berechtigungen der Ziel-API. Du wirst damit nicht aufgefordert, dich bei Powerduck anzumelden.
- **Vertragsprüfung fehlgeschlagen:** Lies den Feldpfad und den erwarteten Typ in der Assertion. Korrigiere das Backend oder eine fehlerhafte Spezifikation und prüfe erneut.

Lokale Dateien werden auf deinem Computer gelesen und gespeichert. Entfernte Modelle erhalten den benötigten Kontext; beim Veröffentlichen in der Cloud werden die ausgewählten Inhalte hochgeladen. Optionale Nutzungsstatistiken sind in den Einstellungen standardmäßig deaktiviert und von der Lizenzprüfung unabhängig.

[Herunterladen](https://www.powerduck.com/download.html) · [Desktop-Lizenz](https://www.powerduck.com/pricing?product=client)

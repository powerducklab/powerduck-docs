---
sidebar_position: 1
title: Desktop-Client
description: "Der Powerduck-Desktop-Client ist ein Local-First, KI-gesteuerter Arbeitsbereich. Aus einer einzigen OpenAPI-Datei auf Ihrer Maschine entwerfen Sie APIs, debuggen Requests, führen Tests aus, mocken APIs, veröffentlichen Dokumentation und stellen MCP-Tools bereit."
---

# Desktop-Client

Der Desktop-Client ist der Ort, an dem der KI-native Workflow auf Ihrer eigenen Maschine stattfindet. Sie öffnen die `openapi.yaml` aus dem Repository, beschreiben das gewünschte Ergebnis und prüfen. Kein Wechsel zwischen Spec-Editor, HTTP-Client, Mock-Werkzeug, Doku-Generator und Test-Runner, und Sie starten ohne Cloud-Konto.

Sie behalten immer die Kontrolle: Der Assistent schlägt vor, Sie stimmen zu.

## Ein Tag im Arbeitsbereich

Das sind die Momente, die der Client ins Zentrum stellt.

- **Spec öffnen und das Ganze erfassen.** Der Assistent liest das aktuelle Dokument und schlägt sofort vor, was er tun kann: zu füllende Lücken, zu ergänzende Doku, zu testende Abläufe.
- **Die API bauen.** Beschreiben Sie eine Ressource, und der Assistent schlägt die Operationen vor. Verfeinern Sie dieselbe Operation weiter — Parameter hinzufügen, Antwort verschärfen, Statuscode anpassen — und er bleibt bei dieser API, ohne den Rest des Dokuments zu stören.
- **Testdaten vorbereiten.** Erzeugen Sie realistische Beispieldaten aus den Schemas, um Requests und Szenarien konkrete Werte zu geben.
- **Einzelnen Request oder ganzes Szenario ausführen.** Debuggen Sie einen isolierten Aufruf oder verketten mehrere Operationen zu einem End-to-End-Ablauf, und erhalten Sie einen teilbaren Bericht über Erfolg und Fehler.
- **Weiterkommen, bevor das Backend bereit ist.** Starten Sie einen lokalen Mock, der während der Entwicklung des echten Dienstes nach Vertrag antwortet.
- **Die API an einen Coding-Agenten geben.** Wandeln Sie die Spec in einen MCP-Server, damit KI-Werkzeuge die richtigen Operationen mit den richtigen Parametern entdecken und aufrufen.
- **Die Datenbank hinter der API sehen.** Leiten Sie Tabellen, Beziehungen und SQL aus der Spec ab, vergleichen mit einer echten Datenbank und verstehen die anstehenden Änderungen.
- **Einstellungen ändern, ohne das Gespräch zu verlassen.** Theme oder Sprache wechseln, Proxy einrichten, Umgebungsvariablen verwalten — einfach per Anfrage.

## Jeder Modus und sein Zweck

Ein einziges Dokument treibt alle Modi an, erreichbar über einen kompakten Umschalter.

| Modus | Was er tut |
|---|---|
| [**Spec**](./design) | Hauptmodus: KI-Chat, Dokument, Live-Vorschau |
| [**Request-Arbeitsbereich**](./debug) | Sendet und prüft echte HTTP-Requests; Tabs und Umgebungen |
| [**Szenario-Tests**](./scenario-testing) | Verknüpft Operationen zu Abläufen, führt sie aus und erstellt einen Bericht |
| [**Dokumentation**](./protocols) | Liest die Spec als gerenderte API-Doku |
| [**MCP**](./protocols) | Prüft und nutzt den aus der Spec abgeleiteten MCP-Server |
| [**Mock-Server**](./mock-server) | Führt während der API-Entwicklung einen lokalen Mock aus |
| [**Datenmodell**](./data-model) | Leitet Tabellen und Beziehungen ab, vergleicht mit der DB und erzeugt SQL |
| [**Einstellungen**](./settings) | Theme, Sprache, Proxy, Zertifikate, Arbeitsbereichs-Voreinstellungen |

## Wie Sie mit dem Assistenten zusammenarbeiten

Sie beschreiben die Absicht in natürlicher Sprache, der Assistent wählt die passende Fähigkeit, die deterministische Engine validiert, und Sie stimmen über eine Karte zu. Das Modell bearbeitet nie selbst das Dokument.

- Spec-Änderungen kommen als **Patch-Karten** mit feinen Operationen. Beim Bearbeiten einer bestehenden Operation ändern sich nur die geforderten Felder.
- Nur-Lese-Aufgaben — Operationen auflisten, Schema holen, Abfrage ausführen — liefern die Fakten, auf die der Assistent seine Antwort gründet.
- Schreib-Aktionen verlangen vor Ausführung eine Bestätigung.

Das Modell **konfigurieren Sie**. Richten Sie die App auf einen beliebigen OpenAI-kompatiblen Anbieter und wählen ihn in den Einstellungen. Siehe [KI und Modelle](./ai-models).

## Was Local-First für Sie bedeutet

- **Ihre echten Dateien.** Sie öffnen, bearbeiten und speichern echte Dateien auf der Festplatte und verfolgen lokale Änderungen.
- **Keine CORS-Mauer.** Requests laufen über einen lokalen Prozess, nicht die WebView, daher blockieren Cross-Origin-Einschränkungen Aufrufe nicht.
- **Prompts und Schlüssel privat.** Lokal verarbeitet, erscheinen sie nicht im Browser-Netzwerk-Panel.
- **Funktioniert offline.** Entwurf, Mocking und Doku brauchen kein Netzwerk; nur echte Requests, Git-Sync und gehostete Modelle.
- **Lokal ausgeführte Umgebungen.** Mocks, Szenario-Runner, Datenbankzugriff und Terminal laufen auf Ihrer Maschine.

## Desktop-Lizenz

Der Desktop-Client wird als **dauerhafte Lizenz nach Einmalkauf** verkauft. Einmal gekauft, für immer behalten, vollständig offline und ohne Konto. Der Schlüssel wird beim Kauf erzeugt und einmal angezeigt. Er unterscheidet sich von Powerduck Cloud, dem monatlich abonnierten Hosting-Dienst. Siehe [Cloud-Abrechnung](../cloud/billing).

## Hier starten

- [Mit dem Assistenten entwerfen](./design)
- [Request-Arbeitsbereich und Umgebungen](./debug)
- [Szenario-Tests und Berichte](./scenario-testing)
- [Protokolle](./protocols)
- [Datenmodell und ER-Diagramm](./data-model)
- [Mock-Server](./mock-server)
- [KI und Modelle](./ai-models)
- [Einstellungen](./settings)

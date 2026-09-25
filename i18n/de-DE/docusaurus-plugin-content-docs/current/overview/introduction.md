---
sidebar_position: 1
title: Einführung
description: "Powerduck ist eine KI-native, Local-First-Plattform rund um eine einzige OpenAPI-YAML-Datei. Sie und die KI entwerfen, debuggen, testen, mocken, dokumentieren und stellen MCP-Tools aus derselben Datei bereit. Als Desktop-Client, Cloud und Open-Source-Bibliotheken verfügbar."
---

# Einführung

Die Art, APIs zu bauen, ändert sich. Zwanzig Jahre lang war der **Bediener** ein Mensch, der in einer Oberfläche klickte, und der **Nutzer** eines API-Vertrags ein Mensch, der Dokumentation las. Heute wechseln beide Enden.

- Der Bediener wird zu einem **KI-Assistenten**, der Absicht in Handlungen übersetzt.
- Der Nutzer wird zu einem **KI-Agenten**, der die API als Werkzeug über MCP aufruft.

Die Werkzeuge der vorherigen Ära — API-Clients, Spec-Viewer, Request-Sammlungen — wurden für einen Menschen an der Tastatur gebaut. Powerduck ist für diese Ära gebaut. Es ist kein besserer API-Client und kein schönerer Spec-Viewer. Es ist eine **KI-native Plattform, die bei einer einzigen OpenAPI-Datei beginnt**.

## Der Kern: eine einzige lokale OpenAPI-Datei

Alles beginnt mit einer einfachen `openapi.yaml` in Ihrem Repository: eine offene, versionierte Datei, lesbar für Menschen und KI. Keine proprietäre Datenbank, kein Cloud-Konto nötig.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Diese eine Datei ist der Vertrag. Jeder Workflow liest aus ihr, und dieselbe Datei kann über MCP an jeden KI-Coding-Agenten weitergegeben werden. So teilen Sie, der eingebaute Assistent und jeder externe Agent eine einzige Wahrheitsquelle. Wenn Entwurf, Debugging, Tests, Mocking und Dokumentation alle dieselbe Datei lesen, ist „Tools synchron halten" keine Aufgabe mehr: kein Ziel, sondern eine Folge des Entwurfs.

Powerduck unterstützt OpenAPI 3.2 und hebt bestehende 3.0-/3.1-Dokumente (und Swagger 2.0) sofort an. Andere APIs als HTTP — SSE, WebSocket, GraphQL, gRPC, MCP — werden als gewöhnliche Pfadeinträge über eine `x-protocol`-Erweiterung modelliert, ohne erzwungene Umwandlung in REST-Formen.

## Arbeiten mit der KI

- Sobald Sie das YAML öffnen, schlägt der Assistent vor, was er damit tun kann.
- Beschreiben Sie das Ergebnis in natürlicher Sprache — „erstelle den Bestell-Endpunkt", „bereite Testdaten vor", „führe den Zahlungsablauf aus und erstelle einen Bericht" — und er wählt die passenden Werkzeuge und schlägt Änderungen vor.
- Jede Änderung kommt als **prüfbare Karte**. Nichts wird vor Ihrer Zustimmung angewendet.
- Wenn Sie eine API verfeinern, bleibt der Assistent bei dieser API und ändert nur das Geforderte, ohne den Rest des Dokuments zu stören.
- Sie können **jedes OpenAI-kompatible Modell** mitbringen. Auf dem Desktop verlassen Prompts und Schlüssel nie die Maschine.

## Standardmäßig Local-First

Powerduck läuft auf Ihrer Maschine, öffnet und speichert echte Dateien, funktioniert offline und hält Ihre API-Schlüssel und Prompts aus dem Browser heraus. Die Cloud ist eine optionale Erweiterung für Teilen und Veröffentlichen, keine Voraussetzung zum Start.

## Drei Wege, Powerduck zu nutzen

| Form | Was es ist | Wann nutzen |
|---|---|---|
| [**Desktop-Client**](/docs/client/introduction) | Local-First-Electron-App mit KI-Assistent und vollständigem API-Arbeitsbereich | Ingenieure, die alles auf der eigenen Maschine behalten, offline arbeiten und Schlüssel/Prompts lokal halten wollen |
| [**Powerduck Cloud**](/docs/cloud/introduction) | Gehosteter Dienst für OAS-Hosting, Online-Doku und verwaltetes MCP | Zum Teilen von APIs, Veröffentlichen stabiler Links und Bereitstellen von MCP ohne etwas auszuführen |
| [**Open-Source-Bibliotheken**](/docs/opensource/) | Kombinierbare `@powerduck/*`-npm-Pakete | Zum Bauen eigener Werkzeuge, CI-Pipelines oder eingebetteter Komponenten |

Alle drei Formen teilen denselben Motor. Desktop-Client und Cloud sind beide aus den Open-Source-Bibliotheken zusammengesetzt, daher verhalten sich die Fähigkeiten gleich — ob lokal ausgeführt, über das Netz aufgerufen oder die Pakete direkt importiert.

### Desktop-Client

Der [Desktop-Client](/docs/client/introduction) läuft vollständig auf Ihrer Maschine. Er öffnet und bearbeitet echte Dateien auf der Festplatte, sendet Requests über einen lokalen Prozess, führt lokale Mocks aus und hält KI-Prompts und API-Schlüssel aus der Browser-Konsole heraus. Modelle sind frei konfigurierbar, und vorgeschlagene Änderungen kommen vor der Anwendung als prüfbare Karten.

### Powerduck Cloud

[Powerduck Cloud](/docs/cloud/introduction) trägt denselben Workflow online. Fügen Sie Datei, Git-Repository oder URL hinzu, wählen Sie die bereitzustellenden Operationen, und Sie erhalten stabile Links zur gerenderten Doku und einen verwalteten MCP-Endpunkt. Der Zugriff kann per Ansichtspasswort oder MCP-Zugriffsschlüssel geschützt werden; kostenpflichtige Pläne ergänzen Git-Synchronisierung, benutzerdefinierte Domains und höhere Grenzwerte.

### Open-Source-Bibliotheken

Die [Bibliotheken](/docs/opensource/) sind der Motor darunter: OpenAPI-Parser und -Upgrader, Multiprotokoll-CLI, Code-Generator, MCP-Server, Request-Runner, cURL-/Postman-Konverter und eingebettete Editoren. Jedes ist unabhängig auf npm veröffentlicht, mit eigenen Installationsanleitungen und API-Referenzen. Die technischen Details auf niedriger Ebene leben hier.

## Was sich für Sie ändert

- **Sie beschreiben das Ergebnis, nicht die Klicks.** Nennen Sie das Ziel, und der Assistent arbeitet in prüfbaren Schritten.
- **Ihre APIs sind von Anfang an agentenfähig.** Derselbe Vertrag, der Doku erzeugt, erzeugt auch MCP-Tools, damit KI-Agenten Ihre API ab Tag eins korrekt aufrufen.
- **Keine Drift.** Entwurf, Debugging, Tests, Mocking und Doku lesen eine Datei.
- **Alle Protokolle an einem Ort.** HTTP, SSE, WebSocket, GraphQL, gRPC und MCP in einer Spec, nicht sechs Werkzeuge.
- **Kein Lock-in.** Bringen Sie Ihre Modelle mit, halten Sie Schlüssel auf dem Desktop lokal und besitzen Sie das Klartext-YAML im Repository.

## Wohin als Nächstes

- Neu hier? Beginnen Sie mit [Installation](/docs/overview/installation) und [Schnellstart](/docs/overview/quickstart).
- Brauchen Sie den vollständigen lokalen Arbeitsbereich? Lesen Sie den [Desktop-Client-Leitfaden](/docs/client/introduction).
- Wollen Sie Ihre API online veröffentlichen? Lesen Sie den [Cloud-Leitfaden](/docs/cloud/introduction).
- Bauen Sie eine eigene Integration? Siehe [Open-Source-Bibliotheken](/docs/opensource/).

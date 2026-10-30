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

Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

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
- Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

## Standardmäßig Local-First

Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

## Drei Wege, Powerduck zu nutzen

| Form | Was es ist | Wann nutzen |
|---|---|---|
| [Desktop](../client/introduction.md) | Google OAuth / GitHub | AI Chat · Code Quality · OpenAPI |
| [**Powerduck Cloud**](../cloud/introduction.md) | Gehosteter Dienst für OAS-Hosting, Online-Doku und verwaltetes MCP | Zum Teilen von APIs, Veröffentlichen stabiler Links und Bereitstellen von MCP ohne etwas auszuführen |
| [**Open-Source-Bibliotheken**](/opensource/index.md) | Kombinierbare `@powerduck/*`-npm-Pakete | Zum Bauen eigener Werkzeuge, CI-Pipelines oder eingebetteter Komponenten |

Alle drei Formen teilen denselben Motor. Desktop-Client und Cloud sind beide aus den Open-Source-Bibliotheken zusammengesetzt, daher verhalten sich die Fähigkeiten gleich — ob lokal ausgeführt, über das Netz aufgerufen oder die Pakete direkt importiert.

### Desktop-Client

Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

### Powerduck Cloud

[Powerduck Cloud](../cloud/introduction.md) trägt denselben Workflow online. Fügen Sie Datei, Git-Repository oder URL hinzu, wählen Sie die bereitzustellenden Operationen, und Sie erhalten stabile Links zur gerenderten Doku und einen verwalteten MCP-Endpunkt. Der Zugriff kann per Ansichtspasswort oder MCP-Zugriffsschlüssel geschützt werden; kostenpflichtige Pläne ergänzen Git-Synchronisierung, benutzerdefinierte Domains und höhere Grenzwerte.

### Open-Source-Bibliotheken

Die [Bibliotheken](/opensource/index.md) sind der Motor darunter: OpenAPI-Parser und -Upgrader, Multiprotokoll-CLI, Code-Generator, MCP-Server, Request-Runner, cURL-/Postman-Konverter und eingebettete Editoren. Jedes ist unabhängig auf npm veröffentlicht, mit eigenen Installationsanleitungen und API-Referenzen. Die technischen Details auf niedriger Ebene leben hier.

## Was sich für Sie ändert

- **Sie beschreiben das Ergebnis, nicht die Klicks.** Nennen Sie das Ziel, und der Assistent arbeitet in prüfbaren Schritten.
- **Ihre APIs sind von Anfang an agentenfähig.** Derselbe Vertrag, der Doku erzeugt, erzeugt auch MCP-Tools, damit KI-Agenten Ihre API ab Tag eins korrekt aufrufen.
- **Keine Drift.** Entwurf, Debugging, Tests, Mocking und Doku lesen eine Datei.
- **Alle Protokolle an einem Ort.** HTTP, SSE, WebSocket, GraphQL, gRPC und MCP in einer Spec, nicht sechs Werkzeuge.
- Powerduck erfordert auch auf dem Desktop eine Anmeldung mit Google OAuth oder GitHub. Dateien bleiben lokal. Für KI-Analysen wird der ausgewählte Kontext an die von Powerduck verwalteten Anbieter gesendet. Eigene Modell-URLs und API-Schlüssel werden nicht mehr unterstützt.

## Wohin als Nächstes

- Neu hier? Beginnen Sie mit [Installation](./installation.md) und [Schnellstart](./quickstart.md).
- Brauchen Sie den vollständigen lokalen Arbeitsbereich? Lesen Sie den [Desktop-Client-Leitfaden](../client/introduction.md).
- Wollen Sie Ihre API online veröffentlichen? Lesen Sie den [Cloud-Leitfaden](../cloud/introduction.md).
- Bauen Sie eine eigene Integration? Siehe [Open-Source-Bibliotheken](/opensource/index.md).

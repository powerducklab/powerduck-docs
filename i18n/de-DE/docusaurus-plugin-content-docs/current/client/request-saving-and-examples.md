---
title: "Anfragen speichern und Protokollbeispiele"
description: "Powerduck trennt die getestete Anfrage vom veröffentlichten API-Vertrag."
---

# Anfragen speichern und Protokollbeispiele

Powerduck trennt die getestete Anfrage vom veröffentlichten API-Vertrag.

| Aktion | Ergebnis |
| --- | --- |
| Speichern in der URL-Leiste | Speichert die lokale Debugging-Konfiguration dieser Anfrage. Das OpenAPI-Dokument bleibt unverändert. |
| Schnellanfrage: In Spezifikation speichern | Fügt dem ausgewählten Dokument und Ordner eine Operation hinzu. |
| Spezifikationsanfrage: Spezifikation aktualisieren | Zeigt vor der Vertragsänderung die Zielmethode, den Zielpfad und eine Vorschau der Definition. |
| Dokument speichern / Cmd+S oder Ctrl+S | Schreibt das aktuelle OpenAPI-Dokument auf die Festplatte. In einem Schnellanfrage-Tab speichert das Tastenkürzel diese Schnellanfrage. |

Die lokale Anfrage enthält den ausgewählten Server, URL, Methode, Parameterwerte, Body, Skripte und Transporteinstellungen. Entwürfe von Spezifikationsanfragen bleiben während der Bearbeitung im Arbeitsspeicher; Speichern in der URL-Leiste persistiert sie unter `powerduck.debug.v1:` im Speicher des Renderer-Prozesses. Einträge sind nach Dokument-ID, Pfad und Methode getrennt. Das Löschen von Browser- oder Anwendungsdaten entfernt diesen lokalen Zustand; ein OAS-Export enthält ihn nicht. Dieser Speicher **ist kein verschlüsselter Geheimnisspeicher**: Verwenden Sie Umgebungsreferenzen statt Klartext-Zugangsdaten in URLs, Headern oder Bodys. Die Authentifizierungsfelder nutzen einen separaten Persistenzweg für Zugangsdaten.

`x-powerduck-request` **ist keine offizielle Vertragserweiterung**. Beim Hinzufügen zur oder Aktualisieren der Spezifikation wird sie nicht ausgegeben. Sie darf keine Methode, Parameter, Anfragebodys oder Antworten beschreiben. Das bloße Öffnen eines Dokuments verändert bestehende Vorkommen in anderen Operationen nicht.

## Definitionen gezielt aktualisieren

Die Spezifikationsaktualisierung zeigt Zielmethode und Zielpfad in der Vorschau und behält vorhandene Antworten und Schemas bei. Parameterdefinitionen werden nur nach ausdrücklicher Auswahl übernommen; Debugging-Parameterwerte werden nicht kopiert. Ein JSON-Body wird nur bei ausdrücklicher Auswahl als Beispiel hinzugefügt. Übliche Zugangsdaten-Feldnamen werden ausgeschlossen, dennoch sollten Sie **Freitext und Beispiele vor der Veröffentlichung prüfen**. Skripte und Authentifizierungsüberschreibungen sind keine Vertragsfelder.

Eine vorhandene Zieloperation lässt sich nicht durch Ändern von Methode oder Pfad überschreiben. Lokale Operationsreferenzen werden angepasst. Eine benutzerdefinierte Methode wie `PURGE` wird unter `paths./cache.additionalOperations.PURGE` gespeichert und benötigt OpenAPI 3.2. Die Vorschau weist darauf hin; beim Anwenden wird die Dokumentversion auf 3.2.0 gesetzt. Prüfen Sie auch, ob nachgelagerte Werkzeuge diese Version unterstützen.

Protokollschemas können weiterhin über Dokumentation bearbeiten geändert werden. Dabei wird die Definition ausdrücklich angepasst; das Senden oder Speichern einer Debugging-Anfrage schreibt Protokollschemas nicht unbemerkt um.

## Offizielle Beispiele zum Herunterladen

Dies sind gepflegte **Beispieldefinitionen**, keine öffentlichen API-Dienste von Powerduck. Alle Endpunkte verweisen auf lokale Dienste, die Sie bereitstellen müssen. Der Import startet diese Dienste nicht, verbindet sich nicht automatisch und stellt keine Zugangsdaten bereit.

- [Alle Protokolle](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP und benutzerdefiniertes PURGE](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) und [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Laden Sie für gRPC `echo.proto` neben die YAML-Datei herunter und wählen Sie bei Bedarf den tatsächlichen lokalen Pfad im Client aus. Der Server muss `powerduck.examples.Echo/Echo` auf Port 50051 implementieren. Auch die anderen Beispiele benötigen einen passenden Server; sie demonstrieren keine Validierung gegen ein laufendes Backend.

## Referenz der Vertragserweiterungen

Jede Operation besitzt eine gewöhnliche OAS-Methode, operationId, summary und responses. Nicht-HTTP-Bindungen verwenden eine OAS-Operation als Dokumentationsanker; `post` im gRPC-Beispiel bedeutet nicht, dass gRPC in einen REST-Endpunkt umgewandelt wurde.

| Erweiterung | Bedeutung und in den Beispielen verwendete Felder |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` oder `a2a`. Für HTTP optional. |
| `x-session` | Deklariert eine langlebige Protokollsitzung; die Beispiele verwenden dies für WebSocket und MCP. |
| `x-websocket` | `url`, optional `subprotocols`, `headers` und `messages`. Jede dokumentierte Nachricht enthält `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Header dürfen keine Zugangsdaten enthalten. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, öffentliche `variables`, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` und dokumentierte `messages`. `kind` unterstützt unary/server_streaming/client_streaming/bidi_streaming. Lokale proto-Pfade sind installationsabhängig. |
| `x-mcp` | `transport`, `endpoint`, `method` sowie methodenspezifische Felder `name`, `argumentsSchema`, öffentliche `arguments`, `responseSchema`. Ressourcenoperationen verwenden `uri`; vermischen Sie keine Felder unterschiedlicher Methoden. |
| `x-a2a` | Explizite `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` und öffentliches `example`. Die Nutzdaten von 0.3 und 1.0 unterscheiden sich; siehe [A2A](./a2a.md). |
| `x-response-stream` | Optionale GraphQL-Streaming-Absicht, wenn Server und Transport tatsächlich Streaming unterstützen. Für normale GraphQL-Anfragen nicht erforderlich. |

SSE beschreibt die Nutzdaten jedes Ereignisses über das Standardfeld `responses.200.content.text/event-stream.itemSchema`. HTTP verwendet die üblichen Parameter, requestBody, responses und Sicherheitsschemas. Erfinden Sie keinen `x-sse`-Konfigurationsblock und speichern Sie Debugging-Zustände nicht als Vertragserweiterung.

Die Beispiele enthalten vollständige, nutzbare Konfigurationen für die gewählte Bindung, nicht alle sich gegenseitig ausschließenden Optionen. MCP stdio benötigt ein separat konfiguriertes lokales Programm; die herunterladbaren Beispiele starten es bewusst nicht automatisch.

## Paketintegration

Die Desktop-Oberfläche verwaltet den lokalen Debugging-Speicher und explizite Schreibvorgänge an der Spezifikation. `@powerduck/openapi-parser` liest benutzerdefinierte Methoden bereits über `additionalOperations`; `@powerduck/tree` und `@powerduck/oas-document` verarbeiten diese Vertragsstruktur. `@powerduck/openapi-request` erhält Laufzeitargumente getrennt von der Spezifikation. Die Anfrageausführung benötigt kein `x-powerduck-request`.

Die Trennung der Speichervorgänge führt keine neuen öffentlichen npm-Parameter ein. Verwenden Sie vorhandene Protokollerweiterungen für Vertragsdaten und übergeben Sie aktuelle Debugging-Werte an die Ausführungs-API. Exporter, Generatoren und MCP-Werkzeuge sollten die private Anfragezustandsstruktur nicht auswerten.

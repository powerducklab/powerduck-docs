---
sidebar_position: 6
title: "A2A-Agenten"
description: "A2A lokal entwerfen, debuggen und dokumentieren: JSON-RPC, REST, Desktop-gRPC, JWS-Prüfung und ausführbare Demo."
---

# A2A-Agenten

MCP stellt Werkzeuge und Ressourcen bereit. A2A beschreibt die Delegation zwischen Agenten, Nachrichten, Aufgaben und Ergebnisse. Powerduck verwaltet beide als eigenständige Protokolle in derselben lokalen Spezifikation.

## Erstellen und debuggen

1. Wählen Sie **Neue Anfrage → A2A**. Standard ist **1.0 / JSON-RPC**. Version 1.0 unterstützt auch REST und Desktop-gRPC; 0.3 nur JSON-RPC. Es findet keine automatische Versionsübersetzung statt.
2. Stellen Sie Endpunkt und Methode ein. **Anfrageinhalt erzeugen** öffnet eine Vorschau; **Anfrageinhalt ersetzen** übernimmt sie. Abbrechen oder ein reiner Methodenwechsel behält den Entwurf bei.
3. Bearbeiten Sie bei JSON-RPC `params`, bei REST/gRPC direkt das Anfrageobjekt ohne äußere `jsonrpc`-, `id`- und `params`-Hülle. Zugangsdaten werden unter Auth und Header gesetzt. Beim Senden wird `A2A-Version` ergänzt.
4. Prüfen Sie die vollständige Antwort: HTTP 200 kann einen RPC-Fehler `error` enthalten. JSON-RPC 1.0 liefert in `result` ein `task`- oder `message`-Objekt.
5. Speichern Sie in der Spezifikation. `x-a2a` erhält Konfiguration, Beispiele und Verträge. JSON-RPC verwendet die Methode im Inhalt, REST/gRPC die ausgewählte Methode. Anfrage-ID und Nachrichten-ID sind verschieden. Für weitere Nachrichten übernehmen Sie die zurückgegebenen Kontext- und Aufgaben-IDs.

## Transportbindungen

Die REST-URL ist ein Basispfad wie `https://agent.example/rest`. Die Methode bestimmt HTTP-Verb und Pfad; Aufgaben-IDs werden kodiert, Filter und Seitennavigation als Abfrageparameter übergeben. Debugger und Dokumentation verwenden dieselbe Zuordnung.

gRPC benötigt die Desktop-Anwendung. `https://host:port` nutzt TLS mit dem Zertifikatsspeicher des Systems; `http://localhost:port` dient lokalen Klartexttests. Ein Pfad ist nicht erlaubt. Header werden zu Metadaten. Verwendet werden der offizielle Deskriptor `lf.a2a.v1.A2AService` und ProtoJSON. HTTP-Skripte, Proxys und eigene TLS-Einstellungen werden für diese Bindung abgelehnt.

## Agent Card und JWS

**Öffentliche Agent Card abrufen** lädt normalerweise `/.well-known/agent-card.json`. Prüfen Sie Version, Fähigkeiten und Authentifizierung, bevor Sie eine Schnittstelle ausdrücklich übernehmen. Das Abrufen ändert keine Endpunkte und leitet keine Zugangsdaten an andere Ursprünge weiter. Öffentliche Erkennung sendet keine Zugangsdaten, folgt keinen Umleitungen und begrenzt Antworten auf 1 MiB. Im Browser ist CORS nötig.

Öffnen Sie **JWS-Signatur prüfen** und fügen Sie öffentliche JWKS aus vertrauenswürdiger Quelle ein. Die lokale Prüfung folgt keinen Schlüssel-URLs aus der Karte. Sie umfasst nur A2A-1.0-Standardfelder, keine eigenen Erweiterungen. Die Kanonisierung folgt A2A-Feldpräsenz und RFC 8785: erforderliche leere Zeichenfolgen und Arrays sowie ausdrücklich gesetzte optionale boolesche Werte bleiben erhalten. Signaturen, die diese Werte entfernen, werden abgelehnt. Eine gültige Signatur bestätigt nicht die Organisation hinter einem unbekannten Schlüssel.

Gespeichert wird nur ein Karten-Snapshot, keine Vertrauensentscheidung. Entfernen Sie private Metadaten vor dem Teilen. Geschützte Karten erhalten Sie über eine authentifizierte extended-card-Methode.

## Aufgaben und Streams

1.0 verwendet `SendStreamingMessage` oder `SubscribeToTask`, 0.3 `message/stream` oder `tasks/resubscribe`. SSE- oder native gRPC-Ereignisse, Zustände und Ergebnisse bleiben prüfbar. **Stopp** trennt nur die lokale Verbindung. Für entfernten Abbruch senden Sie `CancelTask` oder `tasks/cancel` mit der Aufgaben-ID. Eine abgeschlossene Aufgabe lässt sich nicht einfach neu starten.

Abrufen und Auflisten von Aufgaben (Liste ab 1.0), erweiterte Karten und Push-Konfiguration hängen von den Fähigkeiten des Agenten ab. Powerduck hostet keinen Push-Empfänger.

## OpenAPI-Erweiterung

`x-a2a` ist eine Powerduck-Erweiterung, keine standardisierte Agent Card und kein OpenAPI-Schlüsselwort. Der dokumentierte Pfad identifiziert die Operation; `endpoint` ist die tatsächliche Zieladresse.

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version` ist `1.0` oder `0.3`; `binding` ist `JSONRPC`, ab 1.0 auch `HTTP+JSON` oder `GRPC`. `agentCardUrl` ist die Erkennungsadresse, `agentCard` ein optionaler Snapshot. `example` enthält eine JSON-RPC-Hülle oder ein REST/gRPC-Objekt. `requestSchema` und `responseSchema` sind explizite Verträge, nicht aus einer einzelnen Antwort abgeleitet. SSE nutzt `text/event-stream` mit OAS-3.2-`itemSchema`. Dokumentation und Copy for LLM erhalten die Konfiguration; gRPC zeigt ProtoJSON, HTTP-Bindungen ihre Codebeispiele.

## Server erzeugen

Über **Server erzeugen → Serverprojekt herunterladen** erhalten Sie ein Node.js-22+-Projekt. Führen Sie `npm install` aus, setzen Sie `A2A_TOKEN` auf mindestens 32 zufällige Zeichen und `HANDLER_URL`, dann `npm start`. Der HTTP-Handler empfängt `{message, contextId}` und liefert eine Message mit nicht leeren `parts`. Bestehende Zugangsdaten werden nicht exportiert.

Der Server begrenzt Nutzlasten und Parallelität, setzt eine Frist von 60 Sekunden und räumt beim Beenden auf. `SIGNING_JWK_FILE` aktiviert die Signatur, `CORS_ORIGINS` erlaubt Browser-Ursprünge ausdrücklich. Es handelt sich um einen zustandslosen Adapter ohne persistente Aufgaben oder Push-Engine. Vor öffentlicher Bereitstellung benötigen Sie öffentliche URLs, TLS, Reverse-Proxy-Ratenlimits und eine geeignete Mehrbenutzer-Authentifizierung.

## Ausführbare lokale Demo

Im React-Repository enthält `examples/a2a-demo` einen Summenrechner ohne KI-Schlüssel oder externe Dienste. Voraussetzung: Node.js 22+.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

Starten Sie `npm test` in einem zweiten Terminal im selben Verzeichnis. Importieren Sie `openapi.json` und setzen Sie den Bearer Token `powerduck-local-demo-token-0123456789`. `[12,30]` ergibt `Sum: 42` und den strukturierten Wert `total: 42`. JSON-RPC: `http://127.0.0.1:9999/rpc`; REST: `http://127.0.0.1:9999/rest`; gRPC: `http://127.0.0.1:9998`. Karte: `http://127.0.0.1:9999/.well-known/agent-card.json`. Der vertrauenswürdige lokale Schlüssel liegt in `.runtime/trusted-jwks.json` und ändert sich beim Neustart.

Der Test prüft auf getrennten Ports alle drei Transporte, SSE, strukturierte Antworten, Manipulationsschutz, Authentifizierung und CORS. Die Demo lauscht nur lokal und unterstützt keine persistenten Aufgaben oder Push-Zustellung. Den Demo-Token nicht öffentlich einsetzen. Standardmäßig erlaubt: `http://localhost:3000` und `http://127.0.0.1:3000`; weitere Ursprünge über `CORS_ORIGINS` konfigurieren.

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)

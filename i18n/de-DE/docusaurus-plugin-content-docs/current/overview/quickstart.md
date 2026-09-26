---
sidebar_position: 3
title: Schnellstart
description: "In wenigen Minuten durchlaufen Sie den entworfenen Endpunkt, einen echten Request und die gerenderte Dokumentation aus Ihrer OpenAPI-Datei."
---

# Schnellstart

Dieser kurze Ablauf durchläuft die zentrale Schleife: Spec öffnen, mit dem KI-Assistenten ändern, einen Request senden und das Ergebnis als Dokumentation sehen — überall mit demselben OpenAPI-Dokument.

## 1. Spec öffnen

Starten Sie den Client und öffnen Sie eine Spec aus einer unterstützten Quelle. Alle laufen durch denselben Import-Fluss und werden zu OpenAPI 3.2 konvertiert oder angehoben:

- Eine **OpenAPI- oder Swagger-Datei** auf der Festplatte (Swagger 2.0, OpenAPI 3.0 / 3.1 angehoben).
- Eine **Postman-Collection**.
- Ein **cURL-Befehl**.
- Ein **Git-Repository**.
- Eine auf eine Spec zeigende **URL**.

Sie können eine Datei auch direkt in den Arbeitsbereich ziehen. Ohne Startpunkt lässt der Assistent aus einer kurzen Beschreibung ein Anfangsgerüst erstellen.

## 2. Den Assistenten einen Endpunkt hinzufügen lassen

Beschreiben Sie im Chat, was Sie brauchen. Zum Beispiel:

> Füge einen `GET /products`-Endpunkt hinzu, der eine paginierte Produktliste zurückgibt.

Der Assistent bearbeitet das Dokument nicht direkt; er antwortet mit einer **Patch-Karte**. Die Karte zeigt die zu ändernde Operation und die betroffenen Pfade/Ressourcen. Prüfen Sie, dann **Anwenden** oder **Verwerfen**. Nichts erreicht vor dem Anwenden das Dokument.

Bei einer breiten Anfrage wie „baue eine E-Commerce-API" stellt der Assistent zuerst Klärungsfragen und schlägt dann Patches mit je 2 bis 5 Operationen vor.

## 3. Eine einzelne Operation ohne Drift verfeinern

Öffnen Sie die Operation und verfeinern sie direkt — fügen einen Query-Parameter hinzu oder erweitern das Antwort-Schema. Im Fokus-Modus erzeugt der Assistent feine Patches, die nur die geforderten Felder treffen und alles andere der Operation erhalten. Das verhindert, dass wiederholte Bearbeitungen derselben API bestehende Arbeit stören oder überschreiben.

## 4. Einen echten Request senden

Wechseln Sie zum **Request-Arbeitsbereich** der Operation und senden. Der Request läuft über den lokalen Hauptprozess. Antwort, Status, Header und Timing erscheinen neben der Operation, und für pro Ausführung wechselnde Werte lassen sich Umgebungen und Variablen nutzen.

Wenn weder die `servers` der Spec noch die aktive Umgebung eine Basis-URL liefern, rät die App nicht: Sie bittet um Eingabe der Basis-URL.

## 5. Dokumentation ansehen

Öffnen Sie die **Dokumentation**: Dieselbe Spec wird als lesbare API-Doku gerendert. Der Viewer liest das Live-Dokument, daher stimmt die Doku immer mit dem gerade Entworfenen überein.

## 6. Bei Bedarf weitergehen

- Verketten Sie mehrere Requests mit [Szenario-Tests](../client/scenario-testing.md) und exportieren einen HTML-Bericht.
- Starten Sie den [lokalen Mock-Server](../client/mock-server.md) während der Backend-Entwicklung.
- Modellieren Sie Streaming-/RPC-APIs mit den [sechs Protokollen](../client/protocols.md).
- Leiten Sie Tabellen, Beziehungen und SQL im [Datenmodell](../client/data-model.md) ab.
- Veröffentlichen Sie dieselbe Spec online mit [Powerduck Cloud](../cloud/quickstart.md).

Damit ist die zentrale Schleife komplett. Der Rest der Dokumentation beschreibt jeden Arbeitsbereich im Detail.

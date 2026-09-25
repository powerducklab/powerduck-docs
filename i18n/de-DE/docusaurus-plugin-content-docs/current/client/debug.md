---
sidebar_position: 3
title: Request-Arbeitsbereich und Umgebungen
description: "Senden Sie echte Requests in Tabs, verwalten Sie Variablen über Bereiche und verstehen Sie die Beziehung zwischen benutzerdefinierten Umgebungen und den im OpenAPI-Dokument deklarierten servers."
---

# Request-Arbeitsbereich und Umgebungen

Der Request-Arbeitsbereich ist der Ort, an dem entworfene Operationen zu echten Aufrufen werden. Sie senden Requests über den lokalen Hauptprozess, zeigen Antworten und verwalten pro Ausführung wechselnde Werte mit Umgebungen und Variablen.

## Einen Request senden

1. Öffnen Sie eine Operation im Request-Arbeitsbereich. Methode, Pfad, Parameter, Header und Body stammen aus der Spec.
2. Tragen Sie Werte ein, die konkrete Eingabe brauchen, wie Pfadparameter oder ein Token.
3. Senden. Der Tab zeigt Statuscode, Antwort-Header, Antwort-Body und Dauer.
4. Halten Sie mehrere Requests in **Tabs** für Vergleich oder Wiederprüfung.

Die Ausführung findet im Hauptprozess statt, nicht der WebView: Direkte Browser-CORS-Einschränkungen blockieren Aufrufe nicht, und Request-Details werden nicht über das Browser-Netzwerk-Panel offengelegt.

## Umgebungen versus OAS servers

Sie sind verwandt, aber verschieden; den Unterschied zu verstehen beseitigt eine häufige Verwirrungsquelle.

| | Benutzerdefinierte Umgebungen | OAS-`servers` |
|---|---|---|
| Ort | Lokale App-Einstellungen | Im OpenAPI-Dokument |
| Vom Request-Werkzeug änderbar | Ja | Nein — per Spec-Patch |
| Zweck | Standard-Basis-URL neuer Tabs und Szenario-Ausführungen | Vom Vertrag selbst deklarierte Basis-URLs |
| Mit Doku geteilt | Nein | Ja |

Wenn der Assistent Basis-URLs auflistet (`env.listServers`), gibt er zuerst die nutzbaren benutzerdefinierten Umgebungen zurück, dann die im aktuellen Dokument deklarierten Nur-Lese-servers.

- **Lokale Basis-URL hinzufügen/wählen** erzeugt und aktiviert eine benutzerdefinierte Umgebung (`env.upsertServer`, `env.selectServer`); das bearbeitet das Dokument nicht.
- **servers im Vertrag ändern** schlägt stattdessen einen Spec-Patch vor.

So bleiben persönliche Debug-Basis-URLs aus dem Vertrag, während die deklarierten servers ebenfalls Requests steuern.

## Variablen

Variablen werden über vier Bereiche verwaltet.

- **globals** — in allen Collections verfügbar.
- **collection** — gelten für eine Collection.
- **environment** — an die aktuelle Umgebung gebunden; ohne bestimmten server für alle server.
- **local** — nur für die lokale Sitzung.

Der Assistent listet Variablen (`env.listVariables`, nach Bereich filterbar) und erzeugt oder aktualisiert sie (`env.setVariable`, Upsert nach Name und Bereich). Eine Variable kann an einen bestimmten server gebunden werden und hat einen eigenen Aktivzustand. Variablenkonfiguration ist eine App-Aktion, keine Änderung des API-Dokuments.

Üblich sind Zugriffstoken, zwischen Aufrufen wiederverwendete IDs oder Feature-Flags als Variablen.

## Wenn keine Basis-URL existiert

Ein Request braucht eine vollständige URL. Wenn weder die `servers` der Spec noch die aktuelle Umgebung eine Basis-URL liefern, rät die App nicht: Sie bittet vor Ausführung um Eingabe. Besser als still den falschen Host aufzurufen.

## Vom Einzel-Request zum Ablauf

Sobald ein isolierter Aufruf funktioniert, ist der natürliche nächste Schritt das Verketten, um einen Antwortwert an den nächsten Request zu geben. Das leisten die [Szenario-Tests](./scenario-testing).

Siehe auch: [Mit dem Assistenten entwerfen](./design)、[Szenario-Tests](./scenario-testing)、[Einstellungen](./settings).

---
sidebar_position: 2
title: Mit dem Assistenten entwerfen
description: "Entwerfen Sie OpenAPI über einen Gesprächsassistenten. Änderungen kommen als prüfbare Patch-Karten mit feinen JSON-Patch-Operationen. Fokussiertes Bearbeiten erhält den Rest der Operation."
---

# Mit dem Assistenten entwerfen

Der Spec-Modus ist der Ort, an dem Sie die API entwerfen. Er verbindet den KI-Chat mit dem Live-Dokument und der Vorschau, damit Sie die Absicht in natürlicher Sprache beschreiben und gleichzeitig volle Kontrolle über die echten Änderungen behalten.

## Die Zustimmungsschleife

Das Modell bearbeitet das Dokument nicht direkt. Diese Schleife ist bewusst explizit.

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Diese Trennung ist eine zentrale Entwurfsentscheidung. Das **Modell** versteht gut die Absicht und schlägt Strukturen vor, der **Host** ist deterministisch und validiert jede Operation, und **Sie** stimmen jeder Änderung zu. Ein Vorschlag gilt nie als angewendet, bevor Sie bestätigen.

## Die Patch-Karte

Die Patch-Karte fasst die Änderung zusammen und listet die genauen Operationen, etwa das Hinzufügen eines Pfads.

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Pfadsegmente sind Array-Elemente, keine JSON-Pointer-Zeichenfolgen. Beim Hinzufügen eines völlig neuen Pfads ist das Ziel `["paths", "/products"]`, und übergeordnete Container werden automatisch erzeugt.

### Feine Bearbeitungen einer bestehenden Operation

Beim Bearbeiten einer bestehenden Operation sendet der Assistent nicht die ganze Operation zurück — das würde alle nicht wiederholten Felder löschen. Stattdessen erzeugt er kleine Operationen, die in die Operation hineingehen und nur das Ändernde treffen.

- Query-Parameter hinzufügen:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Antwort-Schema erweitern:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Ein einzelnes Feld ändern:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Arrays erhalten Ergänzungen über `"-"`, keinen vollständigen Neuversand. Parameter werden über `(in, name)` identifiziert, um Bestehende nicht zu duplizieren. Der Host führt die vorgeschlagenen Werte mit der aktuellen Operation zusammen und erhält alles Ausgelassene.

Das macht iteratives Verfeinern verlässlich: Sagen Sie „füge hier den limit-Parameter hinzu" oder „mache name verpflichtend", und nur dieses Feld ändert sich, der Rest der Operation bleibt.

## Lese-Werkzeuge begründen jeden Vorschlag

Vor der Antwort kann das Modell Nur-Lese-Werkzeuge aufrufen, um den genauen Zustand zu erhalten, keine Vermutung.

- `spec.overview` — Titel, Version, Protokolle, Zähler, Tags, servers, Sicherheit.
- `spec.listOperations` — jede Operation als `METHOD /path`, mit Zusammenfassungen und Tags.
- `spec.presentOperations` — Rendert eine Nur-Lese-Listenkarte aller Operationen.
- `spec.getOperation` — vollständige Definition einer Operation und referenzierte Schemas.
- `spec.getSchema` — ein einzelnes Komponenten-Schema, inkl. Pflichtfelder und Beschreibungen.

Wenn die vollständige Form einer Operation nicht sichtbar ist, muss das Modell sie vor dem Bearbeiten lesen.

## Breite Anfragen schreiten schrittweise voran

Bei einer großen Anfrage wie „baue eine E-Commerce-API" schüttet der Assistent nicht alles auf einmal aus.

1. Er stellt zuerst **Klärungsfragen** zu Kernentscheidungen.
2. Nach Antwort schlägt er **jeweils einen fokussierten Patch** vor, jede Karte mit 2 bis 5 Operationen.
3. Er fährt nur fort, solange die jüngste Anfrage im Zielbereich bleibt.

Sobald der Bereich klar ist, erzeugt der Assistent auch einen `plan` der zu bauenden Operationen, um die Form der Arbeit vor den Patches zu sehen.

## Schutz vor Drift

Der Host erzwingt einige Regeln, um Operationen ausgerichtet zu halten.

- Das **aktuelle Dokument** ist maßgeblich. Wenn das Dokument etwas nicht zeigt, nimmt das Modell nicht an, ein früherer Patch existiere.
- Im Fokus-Modus ändern sich nur das aktive Ziel (und explizit referenzierte Komponenten-Schemas); keine opportunistischen Änderungen an nebengeordneten Operationen.
- Das Erwähnen eines anderen `METHOD /path` gilt als beabsichtigter Operationswechsel.
- Angewendete und verworfene Vorschläge werden im Verlauf verfolgt, um bestehende Patches nicht zu wiederholen.

Wenn ein nötiges Detail nicht sichtbar ist, erfindet es der Assistent nicht: Er stellt eine gezielte Frage.

## Andere Karten

Nicht jede Antwort ist ein Patch.

- **Fragekarten** bitten um Auswahl zwischen Optionen.
- **Validierungskarten** berichten Qualitätsprüfungen mit Bestanden-, Warnungs- und Fehlerzustand.
- **Aktionskarten** liefern einen konkreten nächsten Schritt, wie ein Szenario auszuführen oder einen Arbeitsbereich zu öffnen.
- **Datentabellenkarten** zeigen konkrete Beispiel-/Testdaten für Operationen oder Schemas.

Siehe auch: [Request-Arbeitsbereich](/docs/client/debug)、[Szenario-Tests](/docs/client/scenario-testing)、[KI und Modelle](/docs/client/ai-models).

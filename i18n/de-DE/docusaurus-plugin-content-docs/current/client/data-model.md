---
sidebar_position: 6
title: Datenmodell und ER-Diagramm
description: "Leiten Sie Tabellen, Fremdschlüssel, N:M-Beziehungstabellen und SQL aus der API ab, vergleichen mit einer echten Datenbank und verfolgen Sie den Einfluss über ein visuelles ER-Diagramm."
---

# Datenmodell und ER-Diagramm

Der Datenmodell-Modus schließt die Lücke zwischen API-Vertrag und Datenbank. Er leitet aus OpenAPI-Schemas ein vollständiges relationales Modell ab, vergleicht es mit einer bestehenden Datenbank und synchronisiert beide bei Änderung — alles in einem visuellen ER-Diagramm.

Es gibt zwei Startpunkte, beide unterstützt.

- **Noch keine Tabellen.** Leiten Sie direkt aus den aktuellen APIs jede Tabelle, jedes Feld, Fremdschlüssel, jede Beziehungstabelle und das SQL zum Anlegen ab.
- **Eine Datenbank existiert bereits.** Lesen Sie die echten Tabellen und erzwungenen Fremdschlüssel, vergleichen mit dem von der API implizierten Modell und sehen, wo es passt und abweicht.

## Die vierschichtige Abstimmung

Die Abstimmung (`datamodel.reconcile`) liefert eine maßgebliche Sicht auf vier Schichten.

| Schicht | Inhalt |
|---|---|
| **Observed (beobachtet)** | Verwaiste Tabellen der verbundenen DB, nur in der DB vorhandene/erzwungene Fremdschlüssel |
| **Modeled (modelliert)** | Zustand jeder Tabelle (`missing`, `drift`, `matched`, `extra`), modellierte/echte Feldpaare, feldgenaue Unterschiede, betroffene API-Operationen, modellierte Beziehungen |
| **Proposed (vorgeschlagen)** | Geordneter additiver Migrationsplan mit `blockedBy`-Abhängigkeiten und SQL pro Schritt |
| **Inferred (abgeleitet)** | Automatisch abgeleitete N:M-Beziehungstabellen, Klärungsfragen, Schutzmaßnahmen |

Das Modell gründet jede Tabelle, jedes Feld, jede Beziehung und Aussage auf dieses Ergebnis und erfindet keine DDL.

### Tabellenzustände

- **Missing (fehlend)** — von der API impliziert, aber in der DB nicht vorhanden.
- **Drift (abweichend)** — auf beiden Seiten, aber Felder/Einschränkungen verschieden.
- **Matched (übereinstimmend)** — vorhanden und ausgerichtet.
- **Extra (zusätzlich)** — in der DB, aber von der aktuellen API nicht impliziert.

## Beziehungstabellen und Indexe abgeleitet

Sie müssen Joint-Tabellen nicht von Hand modellieren. Wenn Schemas ein N:M andeuten — etwa mit `user`- und `product`-Ressourcen — hört die **Inferred**-Schicht nicht bei den beiden Basistabellen auf: Sie leitet die sie verbindende Beziehungstabelle (und zugehörige Indexe) ab. Sekundäre Indexe sind im erzeugten SQL enthalten.

Wenn sich die Geschäftslogik nicht klar ableiten lässt, stellt das Ergebnis statt zu raten eine Klärungsfrage, und Schutzmaßnahmen markieren menschlich zu Prüfendes.

## Visuelles ER-Diagramm

Die ER-Ansicht rendert das Modell als Graphen, um Beziehungen und Fremdschlüssel auf einen Blick zu zeigen, nicht aus einer Tabellenliste zu lesen.

- Tabellen sind Knoten mit automatischem, Kreuzungen reduzierendem Layout.
- Fremdschlüsselbeziehungen sind als Verbindungen gezeichnet.
- Knotenzustand spiegelt den Abstimmungszustand (fehlend, abweichend, übereinstimmend, zusätzlich).
- Ein Seitenfeld zeigt konkrete Migrationsschritte — `create_table`, `alter_table`, Prüfpunkte — und das SQL der gewählten Tabelle.

So erhalten Sie eine Makro-Sicht des Schemas und einen genauen, geordneten Pfad zum Angleichen der DB.

## Bidirektionale Einflussanalyse

Das Modell kennt sowohl API-Operationen als auch Tabellen, daher verbreiten sich Änderungen sichtbar.

- Ändert sich die **API**, identifiziert die Abstimmung betroffene Tabellen — abweichende bestehende und hinzuzufügende — und liefert das SQL.
- Ändert sich die **DB**, werden Operationen, die betroffene Tabellen berühren, als Einfluss-Elemente gezeigt.

In beiden Fällen können Sie nach Bearbeitung **aktualisieren und neu abstimmen**, bis Modell und DB übereinstimmen.

## Bereitstellungsskript

Für eine neue DB erzeugt `datamodel.deploymentScript` ein idempotentes, nur vorwärts gehendes SQL-Skript.

- `CREATE TABLE IF NOT EXISTS` in Fremdschlüsselreihenfolge.
- Sekundäre Indexe.
- Optionale deterministische Beispieldaten (0–50 Zeilen, Standard 0); Beziehungstabellen unbefüllt.

Für eine bestehende DB nutzen Sie die Abstimmung, die über den geordneten Migrationsplan additive `ALTER` liefert.

## Datenbankverbindungen

Verbindungen werden über gespeicherte Profile verwaltet (id, Name, Dialekt, Host, Port, Benutzer, DB), und Passwörter werden nicht zurückgegeben. Unterstützte Dialekte: **MySQL**, **SQL Server**, **Oracle**.

- `database.runSelect` führt über ein gespeichertes Profil ein Nur-Lese-`SELECT` aus und gibt gedeckelte Zeilen zurück; Schreibvorgänge und DDL blockiert.
- `database.prefillConnection` öffnet einen mit den gelieferten Details vorausgefüllten neuen Verbindungsdialog, damit Sie das Passwort selbst eingeben, statt es in der Anfrage zu übergeben.

## SQL erzeugt, nie automatisch ausgeführt

In diesem Modus wird SQL **zur Prüfung erzeugt**, nicht gegen die DB ausgeführt. Sie entscheiden, wann und wie anzuwenden, und Nur-Lese-Zugriff schützt die echten Daten. Sie können das Modell sicher erkunden und wiederholen, bevor Sie die DB berühren.

Siehe auch: [Protokolle](./protocols)、[Request-Arbeitsbereich](./debug)、[Einstellungen](./settings).

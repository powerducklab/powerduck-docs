---
sidebar_position: 3
title: Dokumente und Versionen
description: "Dokumente leben unter Projekten mit klarem Zustandslebenszyklus. Jede Änderung erzeugt eine neue unveränderliche Version, und Quellen umfassen Upload und Git-Synchronisierung."
---

# Dokumente und Versionen

Ein Dokument ist die gehostete Darstellung einer einzelnen API. Es gehört zu einem Projekt der Organisation und sammelt im Laufe der Zeit Versionen statt zu überschreiben.

## Die Hierarchie

```text
Organization -> Project -> Document -> Versions
```

Ein Dokument kann direkt unter der Organisation oder in einem Projekt angelegt und nach Projekt und Organisation aufgelistet werden.

## Zustandslebenszyklus

Das Dokument durchläuft vier Zustände.

| Zustand | Bedeutung | Öffentlicher Dienst |
|---|---|---|
| `ACTIVE` | Online | Doku und MCP serviert (gemäß Aktiv-Anzeigen) |
| `PAUSED` | Pausiert | Öffentliche Dienste nicht verfügbar |
| `ARCHIVED` | Aufbewahrt, aber nicht aktuell | Nicht serviert |
| `DELETED` | Weich gelöscht | Nicht serviert |

Erlaubte Übergänge:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Pausieren ist der schnellste Weg zum Herunternehmen und Wiederaufnehmen; Archivieren hält die Historie, behandelt das Dokument aber nicht als aktuell; Löschen ist weich, daher werden Kerndaten nicht sofort zerstört.

## Versionen sind unveränderlich

Wenn sich die Spec ändert, legen Sie eine neue Version an; das Original wird nie ersetzt.

```text
v1 -> v2 -> v3 -> v4
```

Jede Version erfasst:

- Den **Speicherschlüssel** der Datei im Objektspeicher.
- Den **SHA-256**-Prüfwert.
- Inhaltstyp, Größe und Erzeugungszeit.

Das trägt Historie, Zurücksetzen, Vergleich und Doku/MCP-Neuerzeugung für eine bestimmte Version.

### Aktuelle versus versionsfixierte Links

- Links zum **aktuellen** Dokument folgen der jüngsten Version.
- **Versionsfixierte** Links referenzieren eine bestimmte Version und verschieben sich nicht unter dem Leser.

Nutzen Sie fixierte Links, wenn Versionshinweise oder Verträge eine unveränderliche Referenz verlangen, und aktuelle Links, wenn immer das Neueste nötig ist.

## Quellen

Der Inhalt kommt aus einer Quelle, abstrahiert, damit Upload und Git nicht fest im Dokumentmodell verdrahtet sind.

- **Upload** — direktes Dateihinzufügen.
- **Git** — ein Repository über URL, Branch und Dateipfad verbinden.

Die Git-Quelle verfolgt Synchronisationsaktivierung und letzte Synchronisation.

- Mit Repository-URL und Dateipfad **verbinden** (Branch-Wahl).
- Auf Anfrage **synchronisieren**, um den jüngsten Inhalt als neue Version zu holen.

Quell-Metadaten bleiben beim Dokument, um immer zu wissen, ob es aus Upload oder Repository stammt und die letzte Synchronisation zu sehen.

## Speicherung

Echte Dateien leben in einer Organisation/Dokument/Version-Anordnung im Objektspeicher, und die Datenbank hält nur Metadaten (Speicherschlüssel, Prüfwert, Inhaltstyp, Größe). Dateien sind im Speicher standardmäßig nicht öffentlich lesbar; öffentlicher Zugriff geht über die veröffentlichten Pfade des Dokuments.

## Warum es zählt

Die Kombination aus unveränderlichen Versionen und einem weich löschenden Lebenszyklus lässt schnell wiederholen, ohne Historie zu verlieren, und ein zu stoppendes Dokument nicht versehentlich exponieren. Pause für vorübergehende Unterbrechung, Archiv für lange Aufbewahrung, fixierte Links, wenn Unveränderlichkeit zählt.

Siehe auch: [Bereitgestellte Operationen](./exposure.md)、[Zugriffskontrolle](./access-control.md)、[Benutzerdefinierte Domains](./custom-domains.md).

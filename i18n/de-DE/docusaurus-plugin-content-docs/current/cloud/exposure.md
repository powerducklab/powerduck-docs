---
sidebar_position: 4
title: Bereitgestellte Operationen
description: "Wählen Sie die öffentlich zu machenden Operationen, ohne das Originaldokument zu ändern. Gruppieren Sie nach Tags, suchen und schalten einzeln oder im Batch."
---

# Bereitgestellte Operationen

Nicht jede Operation einer Spec muss öffentlich sein. Admin-Schnittstellen, interne Werkzeuge und Entwürfe sollen oft in der Spec bleiben, während sie aus öffentlicher Doku und MCP ausgeblendet sind. Die Bereitstellungskonfiguration macht diese Wahl explizit und **ändert das Originaldokument nicht**.

## Funktionsweise

Die Bereitstellungskonfiguration wird getrennt von der Spec gespeichert; jeder Eintrag referenziert eine Operation und merkt sich den Aktivzustand.

- Die `operationId` wird genutzt, wenn vorhanden.
- `method` und `path` werden ebenfalls gespeichert für Specs ohne Kennung und zur Prüfung.

Die Originaldatei bleibt unveränderlich. Doku und MCP werden aus Spec und aktiven Operationen erzeugt: Eine Operation deaktivieren schließt sie von der öffentlichen Fläche aus, ohne sie aus der Datei zu löschen.

## Der Bereitstellungs-Arbeitsbereich

Der Operationen-Modus ist für große Specs gebaut.

- **Suche** — Operationen nach Methode, Pfad, Zusammenfassung oder Tag eingrenzen.
- **Tag-Gruppierung** — nach Haupt-Tag gruppiert, ohne Tag = nicht klassifiziert.
- **Einzelnes Schalten** — eine Operation an/aus.
- **Gruppen-Batch** — alle Operationen einer Tag-Gruppe zugleich aktivieren/deaktivieren.
- **Alle wählen (gefiltert)** — die globale Checkbox greift auf die aktuellen Suchtreffer.

Jede Operation ist eine Zeile, und der Aktivzustand bleibt auch mit mehreren Tags klar.

## Praktische Standardwerte

Der einfache Weg ist, alle aktiv zu starten und das Unerwünschte zu deaktivieren.

- Interne/Admin-Schnittstellen (Benutzerverwaltung oder interne Gesundheitsprüfungen).
- Noch im Entwurf befindliche Operationen.
- Nur lokales Debuggen betreffende Schnittstellen.

Die Wahl ist von der Datei unabhängig und lässt sich mit der API-Entwicklung anpassen, ohne die Spec selbst zu bearbeiten.

## Zusammenspiel Bereitstellung/Veröffentlichung

Bereitstellung legt fest, **welche Operationen erscheinen**, andere Steuerung, **ob das Dokument grundsätzlich erreichbar ist**.

- Das Dokument muss `ACTIVE` sein.
- Jeder Modus hat seine Aktiv-Anzeige für Doku und MCP.
- Zugriff per Passwort (Doku) oder Zugriffsschlüssel (MCP) schützbar.

Die Gesamtheit der Tore steht in [Zugriffskontrolle](./access-control).

## Plan-Grenzwerte

Pläne begrenzen die Zahl bereitgestellter Operationen.

- **Free** — bis zu 10.
- **Pro** — bis zu 1.000.
- **Team** — bis zu 10.000.

Siehe auch: [Zugriffskontrolle](./access-control)、[Dokumente und Versionen](./documents-versions).

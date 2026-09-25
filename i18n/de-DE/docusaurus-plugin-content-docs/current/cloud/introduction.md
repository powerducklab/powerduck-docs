---
sidebar_position: 1
title: Powerduck Cloud
description: "Bringen Sie Ihre OpenAPI-Spec in Minuten online. Veröffentlichen Sie gerenderte Dokumentation und einen verwalteten MCP-Endpunkt, wählen Sie die Bereitstellung, steuern Sie den Zugriff und teilen Sie stabile Links, ohne etwas auszuführen."
---

# Powerduck Cloud

Powerduck Cloud macht aus einer OpenAPI-Datei etwas **Teilbares**. Fügen Sie Ihre Spec hinzu, wählen Sie die bereitzustellenden Inhalte, dann geben Sie stabile Links zur gerenderten Dokumentation und einem verwalteten MCP-Server weiter. Kein Selbsthosting oder Ausführen nötig.

Es ist derselbe vertragsorientierte, KI-unterstützte Workflow wie der Desktop-Client, online für Teams und Nutzer.

## Der Ablauf

1. **Spec hinzufügen** — Datei, Git-Repository oder URL. Sie können den Fluss auch von der Website starten und sich bei Bereit anmelden, ohne neu hochzuladen.
2. **Bereitstellung wählen.** Operationen einzeln an/aus; die Originaldatei ändert sich nicht.
3. **Doku-Link sofort öffnen** — gerenderte Doku ist standardmäßig an. Der verwaltete MCP-Endpunkt bleibt aus, bis Sie Werkzeuge für Agenten bereitstellen wollen: ein Schalter.
4. **Zugriff steuern.** Ansichtspasswort und Gültigkeitsdauer sowie einen unabhängigen MCP-Zugriffsschlüssel für Agenten hinzufügen.
5. **Veröffentlichen und teilen.** Veröffentlichen Sie die fertigen Artefakte der aktuellen Version: Links lösen auf, erweiterte Steuerung einen Klick entfernt.
6. **Aktuell bleiben.** Jede Änderung erzeugt eine neue Version zum Vergleichen/Zurücksetzen, und Git-Quellen synchronisieren bei Updates.
7. **Lebenszyklus verwalten.** Pausieren, fortsetzen, archivieren und Zustand, Version, Quelle auf einen Blick sehen.

## Was Sie erhalten

- **Stabiler Doku-Link** — nach neuen Versionen lesbar.
- **Verwalteter MCP-Endpunkt** — KI-Agenten anderer entdecken und rufen gewählte Operationen auf.
- **Bereitstellung pro Operation** — interne/unfertige Schnittstellen von der öffentlichen Fläche ausschließen.
- **Zugriffskontrolle** — Ansichtspasswort, Gültigkeitsdauer, MCP-Zugriffsschlüssel.
- **Versionsverlauf** — Vergleich und Zurücksetzen; das Original nie überschrieben.
- **Git-Synchronisierung** — spiegelt Repository-Updates als neue gehostete Versionen.
- **Benutzerdefinierte Domains** — Markenerlebnis inklusive Unterpfad-Konfiguration.

### Ein Dokument, mehrere Versionen

Jede Bearbeitung erzeugt statt Überschreiben eine neue Version für Vergleich, Zurücksetzen und Doku/MCP-Neuerzeugung für einen bestimmten Zustand. Doku und MCP sind immer an ein bestimmtes Dokument und eine Version gebunden, nie an einen vagen „aktuellen Stand".

### Warum ein Link nicht öffnen kann

Ein Doku- oder MCP-Link löst auf, wenn drei Dinge gegeben sind, und der Dokument-Arbeitsbereich zeigt jede und hebt die erste fehlende Anforderung hervor.

1. Das Dokument ist **aktiv** — Pausieren nimmt Doku und MCP gemeinsam vom Netz.
2. Der zu teilende Modus ist **aktiv** — je ein Schalter für Doku und MCP (Doku standardmäßig an, MCP standardmäßig aus).
3. Das aktuelle Artefakt ist **veröffentlicht** — nach Versionszugabe oder Bereitstellungswechsel automatisch gebaut, meist keine Aktion; manuelle Veröffentlichung als Absicherung.

Zugriffsprüfungen — Ansichtspasswort, Gültigkeitsdauer, MCP-Zugriffsschlüssel — wirken über diesen drei.

## Anmeldung und Zugehörigkeit

Melden Sie sich mit **Google** oder **GitHub** an. Nach dem OAuth-Handshake gibt Powerduck eine eigene Sitzung in einem sicheren HttpOnly-Cookie aus, und das Anbieter-Token dient nicht als langfristige Identität. Alles gehört einer **Organisation**; eine persönliche Organisation wird automatisch angelegt, um später ohne Neuentwurf im Team zu teilen.

## Die Konsole

- **Dashboard** — Specs hinzufügen und jüngste Dokumente mit Schnelllinks und Start/Stop-Aktionen sehen.
- **Projects** — Dokumente organisieren.
- **Dokument-Arbeitsbereich** — Zustand, Doku, MCP, bereitgestellte Operationen, Versionen, Quelle, Domains in klaren Tabs.
- **Billing** — Abonnementzustand und Bestellungen getrennt.
- **Hub** — öffentliche Doku und MCP-Server veröffentlichen und erkunden.
- **Settings** und **Activity** — Profil, Voreinstellungen, Audit-Protokoll.

Öffentliche Leser nutzen einen eigenen Viewer und brauchen kein Konto, wenn das Dokument kein Passwort verlangt.

## Cloud versus Desktop-Client

| | Desktop-Client | Cloud |
|---|---|---|
| Ausführung | Ihre Maschine | Gehostet |
| Modell | Dauerlizenz Einmalkauf | Monatsabonnement |
| Ergebnis | Lizenzschlüssel (einmal gezeigt) | Mitgliedschaft, kein Schlüssel |
| Wann | Lokal, offline, voller Bereich | Online teilen und veröffentlichen |

Beide ergänzen sich und werden getrennt verkauft. Siehe [Abrechnung](./billing).

## Hier starten

- [Cloud-Schnellstart](./quickstart)
- [Dokumente und Versionen](./documents-versions)
- [Bereitgestellte Operationen](./exposure)
- [Zugriffskontrolle](./access-control)
- [Benutzerdefinierte Domains](./custom-domains)
- [Abrechnung](./billing)

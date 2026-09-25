---
sidebar_position: 5
title: Zugriffskontrolle
description: "Schützen Sie die Doku per Ansichtspasswort und Gültigkeitsdauer, das MCP per Zugriffsschlüssel, und konfigurieren Sie die Upstream-Authentifizierung des MCP-Servers. Verstehen Sie jede über das Öffnen entscheidende Tür."
---

# Zugriffskontrolle

Powerduck trennt **wie ein Leser auf die Doku zugreift** und **wie ein Client auf den MCP-Endpunkt zugreift**, da die Konsumformen verschieden sind. Sie konfigurieren zudem, wie sich der MCP-Server bei der Upstream-API authentifiziert.

## Jede Tür (der Reihe nach)

Mehrere Bedingungen entscheiden über das Öffnen einer öffentlichen Fläche; die vollständige Liste beantwortet das häufige „warum öffnet meine Doku nicht?".

1. **Dokumentzustand** — muss `ACTIVE` sein (weder pausiert, archiviert noch gelöscht).
2. **Modus aktiv** — `documentationEnabled` für Doku, `mcpEnabled` für MCP.
3. **Zugangsdaten** — Ansichtspasswort für Doku falls konfiguriert, Zugriffsschlüssel für MCP.
4. **Gültigkeitsdauer** — die Ansicht kann zu einer festen Zeit ablaufen.

Das hinter jedem Modus veröffentlichte Artefakt wird nach Versionszugabe oder Bereitstellungswechsel automatisch gebaut, daher ist die Veröffentlichung meist nicht manuell.

Jeder Modus ist unabhängig: MCP deaktivieren berührt die Doku nicht, und das Doku-Passwort schützt das MCP nicht.

## Ansichtspasswort

Das Passwort schützt die gerenderte Doku und die servierten Spec-Daten.

- Das Passwort wird mit einem zufälligen Salz pro Passwort über **scrypt** gehasht; nie im Klartext gespeichert.
- Einmal gesetzt, muss der Leser es vor Auslieferung eingeben.
- Es ist **doku-spezifisch**: Der MCP-Endpunkt nutzt seinen eigenen Schlüssel und ignoriert das Ansichtspasswort.

Eine **Gültigkeitsdauer** ist ebenfalls setzbar; nach Ablauf wird selbst das richtige Passwort abgelehnt. Passwort oder Dauer entfernen hebt die Einschränkung auf.

## MCP-Endpunkt-Zugriffsschlüssel

Der MCP-Endpunkt wird durch einen eigenen **Zugriffsschlüssel** geschützt.

- Legen Sie einen Schlüssel an (oder ersetzen ihn); der volle Schlüssel wird nur **einmal** zurückgegeben, danach nur die letzten vier Zeichen gezeigt.
- Einmal konfiguriert, muss jeder MCP-Request ihn als `Bearer`-Token vorweisen.
- Gelieferte Schlüssel werden in **konstanter Zeit** verglichen, und Fehlen/Fehler ergibt `401`.

Den Schlüssel löschen öffnet den Endpunkt, wenn das Dokument aktiv und MCP an ist.

## MCP-Upstream-Authentifizierung

Neben dem Endpunkt-Schutz konfigurieren Sie, wie sich der MCP-Server bei der von der Spec beschriebenen **Upstream-API** authentifiziert. Unterstützte Typen:

| `authType` | Konfiguration |
|---|---|
| `NONE` | Keine Upstream-Authentifizierung |
| `BEARER` | Bearer-Token |
| `BASIC` | Basic-Benutzername und Passwort |
| `APIKEY` | API-Schlüsselname (Header/Query) und Wert |

Geheimnisse wie Bearer-Token, Basic-Passwort oder Schlüsselwert sind beschreibbar, aber nicht lesbar; die Konfiguration zeigt nur, ob sie gesetzt sind.

Weitere MCP-Einstellungen:

- **Basis-URL-Überschreibung** — Upstream-Basis-URL statt der Spec überschreiben.
- **Request-Zeitlimit** — vom MCP-Server bei Upstream-Aufrufen genutzt.

## Empfohlene Einstellungen

- **Öffentliche Doku:** Doku aktiv, ohne Passwort für eine offene API oder Passwort + Dauer für kontrolliertes Teilen.
- **MCP für eigene Agenten:** MCP aktivieren und Zugriffsschlüssel anlegen, damit nur Ihre Clients aufrufen.
- **Upstream-Authentifizierung:** Die MCP-Server-Authentifizierung an die realen API-Anforderungen angleichen, unabhängig davon, wer den Endpunkt aufrufen darf.

Siehe auch: [Bereitgestellte Operationen](/docs/cloud/exposure)、[Dokumente und Versionen](/docs/cloud/documents-versions)、[Benutzerdefinierte Domains](/docs/cloud/custom-domains).

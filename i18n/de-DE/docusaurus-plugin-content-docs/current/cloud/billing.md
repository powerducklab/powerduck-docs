---
sidebar_position: 7
title: Abrechnung
description: "Die Cloud ist ein Monatsabonnement und der Desktop eine dauerhafte Einmalkauflizenz. Verstehen Sie Pläne und Berechtigungen, die Wahl des Zahlungsanbieters und den Abonnementlebenszyklus."
---

# Abrechnung

Powerduck hat zwei getrennte Kaufmodelle, die sich nicht mischen.

| | Desktop-Client | Powerduck Cloud |
|---|---|---|
| Kauf | Einmalig | Monatsabonnement |
| Erhalten | Dauerhafter Lizenzschlüssel | Gehostete Mitgliedschaft |
| Ablauf | Keiner | Erneuerung am Periodenende |
| Nach Kauf gezeigt | Schlüssel einmal | Kein Schlüssel |

## Desktop-Lizenz

Der Desktop-Client wird als dauerhafte Einmalkauflizenz verkauft.

- Beim Kauf wird der Schlüssel erzeugt und **einmal** angezeigt.
- Der Schlüssel wird als SHA-256-Hash gespeichert, daher kann die DB das Original nicht rekonstruieren, und nur die letzten vier Zeichen bleiben.
- Zustände: `ISSUED`, `ACTIVE`, `SUSPENDED`, `REVOKED`. Dauerhaft bedeutet nicht unmöglich zu widerrufen.
- Der Schlüssel ist an eine Organisation gebunden, und die Aktivierung ist ratenbegrenzt.

Das bleibt vollständig vom Cloud-Abonnement getrennt: Ein Cloud-Abo kaufen erzeugt keinen Lizenzschlüssel.

## Cloud-Abonnement

Die Cloud ist ein monatlich abonnierter Hosting-Dienst.

- **Pro** — 19 $/Monat.
- **Team** — 49 $/Monat.
- **Free** — 0 $, mit Grenzen.

Das Abonnement hat Perioden und erneuert sich am Ende der aktuellen Periode.

### Pläne und Berechtigungen

Fähigkeiten werden über **Berechtigungen** entschieden, nicht durch Plan-Code-Vergleich.

| Berechtigung | Free | Pro | Team |
|---|---|---|---|
| Dokument-Hosting | Ja | Ja | Ja |
| Git-Quelle | Nein | Ja | Ja |
| Benutzerdefinierte Domain | Nein | Ja | Ja |
| Max. Dokumente | 3 | 20 | 100 |
| Max. Versionen/Dokument | 3 | 100 | 500 |
| Max. bereitgestellte Operationen | 10 | 1.000 | 10.000 |
| Max. Upload-Größe | 1 MB | 10 MB | 50 MB |

## Zahlungsanbieter

Der Zahlungsweg wird nach Region gewählt.

- Chinesisches Festland, Hongkong, Südostasien — **Antom**.
- Europa/Amerika, Japan, Korea — **Paddle**.
- Schlägt die Erkennung fehl, Fallback auf **Antom**.

Beide Anbieter erscheinen nicht zugleich beim Bezahlen; Paddle bleibt als Absicherung für schnellen Notwechsel.

### Zahlungsfluss

1. Plan wählen und Zahlung starten.
2. Zum Anbieter umleiten.
3. Nach Zahlung zurückkehren: Die Rückkehrseite prüft den Bestellzustand.
4. Ein Webhook bestätigt die Zahlung und aktiviert das Abonnement.

Bestellungen werden **idempotent** behandelt, damit dieselbe Zahlung nicht zweimal greift.

## Abonnementlebenszyklus

- **Upgrade** — sofort wirksam; anteilige Differenz nach verbleibendem Periodenwert berechnet.
- **Downgrade** — am Ende der aktuellen Periode wirksam (vorher signalisiert).
- **Kündigen** — am Periodenende ablaufend; die Kündigung durchläuft wiederholte Bestätigungen mit Alternativen.
- **Ablauf** — nach Periodenende Rückkehr zu Free-Grenzen.

Kündigen nimmt den Zugriff nicht sofort weg; Sie behalten den Dienst bis zum Periodenende.

## Bestellungen und Mitgliedschaft

Die Abrechnungsseite trennt beide.

- **Mitgliedschaft/Abonnement** — aktueller Plan, Zustand, Periodenende, Erneuerung.
- **Bestellungen** — vergangene Käufe und Zahlungsverlauf.

## Berechtigungsprüfung

Wie jede Host-Ressource gehören Zahlungen und Abonnements einer **Organisation** und werden mit Organisationsbereich abgefragt, daher kann ein Nutzer mit einer anderen Organisations-ID die Bestellungen eines anderen Teams nicht lesen.

Siehe auch: [Cloud-Einführung](./introduction)、[Benutzerdefinierte Domains](./custom-domains).

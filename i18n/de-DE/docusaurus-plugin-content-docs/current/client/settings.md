---
sidebar_position: 9
title: Einstellungen
description: "Konfigurieren Sie Erscheinung und Sprache, Request-Verhalten, Proxys, TLS und Client-Zertifikate, das integrierte Terminal sowie Datei-/Shell-Aktionen."
---

# Einstellungen

Die Einstellungen des Desktop-Clients decken das Aussehen der App und die Art, wie Requests gesendet werden, ab. App-weite Voreinstellungen bleiben von API-Dokumentänderungen getrennt: Theme-Wechsel oder Proxy-Einrichtung ändern den Vertrag nicht.

## Erscheinung

- **Theme** — zwischen hell und dunkel wechseln (`theme.get`, `theme.set`); der Wechsel gilt app-weit und wird gespeichert.
- **Oberflächensprache** — aus zehn Sprachen wählen oder dem System automatisch folgen.

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | | |

Arabisch wird von rechts nach links gerendert. Die Wahl `auto` folgt der Systemsprache.

## Request-Verhalten

Diese Einstellungen steuern ausgehende Requests im Request-Arbeitsbereich und in Szenarien.

- **Request-Zeitlimit** (`requestTimeoutMs`) — in Millisekunden; `0` bedeutet unbegrenzt.
- **Striktes SSL** (`strictSSL`) — TLS-Zertifikatsprüfung; bei selbst signierten oder nicht vertrauenswürdigen Servern abschaltbar.
- **Weiterleitungen folgen** (`followRedirects`) und **maximale Weiterleitungen** (`maxRedirects`).
- **HTTP-Version** (`protocolVersion`) — `http1`, `http2`, `auto`.
- **Cookies deaktivieren** (`disableCookies`) — schaltet die Request-Cookie-Verwaltung ab.

## Proxy

Richten Sie einen ausgehenden Proxy über einen Modus ein (`off`, `system`, `custom`).

- `off` — kein Proxy.
- `system` — dem Betriebssystem-Proxy folgen.
- `custom` — eine Proxy-URL verwenden, mit optionalem Benutzernamen, Passwort und Umgehungsliste.

Die Umgehungsliste nimmt Hosts und Muster (z. B. `localhost,127.0.0.1`, Platzhalter-Hosts). Das Proxy-Passwort ist beschreibbar, aber nicht lesbar und wird mit leerem Wert geleert.

## TLS und Client-Zertifikate

Für Umgebungen mit individueller Vertrauensstellung oder wechselseitigem TLS:

- **Benutzerdefinierte CA** — aktivieren und den Pfad eines CA-Zertifikats angeben, damit Requests einer internen oder selbst signierten Root-CA vertrauen.
- **Client-Zertifikat (mTLS)** — pro Host ein Zertifikat konfigurieren: Zertifikat/Schlüssel-Paar oder PFX, mit optionaler Passphrase; Bereich über Host und Port bestimmt.

Zertifikate lassen sich hinzufügen, per ID löschen oder ganz leeren. Zertifikat-Passphrasen sind nur beschreibbar und werden nicht zurückgegeben.

## Integriertes Terminal

Die App hat ein Terminal-Feld unten.

- `terminal.open` zeigt das Feld; mit `{"cwd":"document"}` öffnet es im Ordner des aktuellen Dokuments, das der Host in einen echten absoluten Pfad auflöst.
- `terminal.run` gibt nach einer Bestätigungskarte einen expliziten Shell-Befehl ein und führt ihn aus.

Ein Befehl läuft nur, wenn Sie ihn explizit verlangen; das Anzeigen des Feldes führt nichts aus.

## Datei- und Shell-Aktionen

- `shell.revealFile` — zeigt das aktuelle Dokument (oder einen Pfad) im System-Dateimanager.
- `shell.openPath` — öffnet eine Datei mit der Standard-App.
- `shell.openExternal` — öffnet eine externe Drittseite im System-Browser.

Offizielle Powerduck-Seiten nutzen ein eigenes Link-Werkzeug (`app.officialLink`), um eine Karte im Gespräch zu rendern, ohne die App zu verlassen.

## Client-Code-Beispiele

Für jede Operation kann der Assistent ausführbaren Client-Code erzeugen (`clientcode.generate`), gezeigt auf einer Codekarte mit Umschalter für Sprache und Client-Bibliothek: C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift usw. Der Code erscheint auf einer Karte, nicht im Gespräch.

## Einstellungen über den Assistenten ändern

App-weite Anfragen — Theme/Sprache wechseln, Proxy einrichten, Zertifikatsfehler ignorieren, HTTP-Version ändern — werden über Einstellungswerkzeuge behandelt, nicht als API-Entwurfsproblem. Einstellungsänderungen verlangen vor Anwendung eine Bestätigung.

Siehe auch: [KI und Modelle](./ai-models.md)、[Request-Arbeitsbereich](./debug.md).

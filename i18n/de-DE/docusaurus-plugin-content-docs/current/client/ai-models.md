---
sidebar_position: 8
title: KI und Modelle
description: "Binden Sie ein OpenAI-kompatibles Modell an, halten Sie Prompts und Schlüssel über den Hauptprozess lokal, nutzen Sie native Funktionsaufrufe mit automatischem Fallback und behalten Sie denselben Workflow im Web bei."
---

# KI und Modelle

Die Fähigkeit des Assistenten hängt vom zugrunde liegenden Modell ab, daher bindet Powerduck Sie nicht an einen bestimmten Anbieter. Sie wählen und konfigurieren das Modell, die App ruft es über einen sicheren lokalen Pfad auf, und jede Änderung läuft durch dieselben prüfbaren Karten.

## Ein Modell mitbringen

Konfigurieren Sie in den Einstellungen den Assistenten zu einem beliebigen **OpenAI-kompatiblen** Chat-Completions-Endpunkt.

- Wählen Sie eine eingebaute Anbieter-Voreinstellung oder legen einen **benutzerdefinierten** Anbieter an.
- Geben Sie Anzeigename, Basis-URL, API-Schlüssel und Modell-ID an.
- Legen Sie mehrere Profile an und wählen zwischen ihnen.

Die App nimmt nicht an, das Modell stamme von einem bestimmten Anbieter. Selbst gehostete oder OpenAI-kompatible Dritt-Endpunkte funktionieren gleich, wichtig für Teams mit eigener Modellstrategie.

## Erweiterte Funktionen und eleganter Fallback

Jedes Profil hat eine Schalter **Erweiterte Funktionen**, standardmäßig an.

- An, nutzt die App den **nativen Funktionsaufruf** des Modells: Sie sendet den Werkzeugkatalog über das Netz und lässt das Modell das passende Werkzeug direkt wählen und aufrufen.
- Wenn ein Endpunkt native Werkzeugargumente ablehnt — kleine Modelle ohne Werkzeugunterstützung — wird dieser Endpunkt gemerkt und ein einziger neuer Versuch über ein **inhaltsbasiertes Fallback-Protokoll** unternommen.

Ziel ist immer ein Ergebnis: Starke Modelle nehmen den präzisen nativen Pfad, werkzeuglose Modelle werden auf ein einfacheres Protokoll zurückgestuft, statt den Zug zu verlieren. Für Profile, die immer den Basispfad nehmen sollen, lassen sich erweiterte Funktionen abschalten.

Werkzeuggesteuerte Arbeit hat ebenfalls Grenzen: Der Agent führt eine begrenzte Zahl an Werkzeug-Zügen aus (Standard 3) und dedupliziert Aufrufe, damit ein Werkzeug nicht zweimal in einer Schleife läuft.

## Warum Requests über den Hauptprozess gehen

Auf dem Desktop-Client wird der fertige Request vom **Node-Hauptprozess** ausgegeben, nicht der WebView. Zwei konkrete Vorteile.

- **Keine Browser-CORS-Mauer.** Cross-Origin-Einschränkungen des Webs blockieren Aufrufe zum Modell-Endpunkt nicht.
- **Prompts und Schlüssel aus der Browser-Konsole.** Request-URL, Authentifizierungs-Header, System-Prompt und Werkzeugliste erscheinen nicht im Netzwerk-Panel des Renderers.

Das Gateway ist bewusst beschränkt, kein offener Proxy.

- Es validiert Ziele (Loopback und erlaubte Hosts), bereinigt Header und verhindert Zeilenumbruch-Einschleusung über Antwort-Header.
- Requests sind abbrechbar (`ai:cancel`).

## Desktop und Web

Derselbe Assistent läuft in beiden Ausführungsumgebungen mit dem jeweils passenden Pfad.

- **Desktop (Electron):** Fähigkeiten werden lokal importiert und ausgeführt, und der fertige Request wird über den Hauptprozess geleitet.
- **Web:** Derselbe Workflow läuft über HTTP und ruft Dienst-APIs statt lokale Module auf.

Deshalb hält die App neben dem Electron-Pfad einen webkompatiblen. Absichtsverarbeitung und Kartendarstellung sind gleich, nur der Transport wechselt.

## Wie die Absicht erkannt wird

Die Absicht wird nicht über Schlüsselwortlisten je Funktion gehandhabt. Stattdessen zeigt die App dem Modell einen klaren, gut beschriebenen **Werkzeugkatalog** — ID jedes Werkzeugs, Argumente und genaue Einsatzsituation. Das Modell wählt das beste Werkzeug aus dem Katalog, der deterministische Host validiert und führt es aus, und Schreibvorgänge verlangen Bestätigung.

Eine Fähigkeit hinzuzufügen bedeutet also ein Werkzeug in den Katalog (mit präziser Beschreibung), keine längeren Schlüsselwortlisten. Derselbe Katalog wird über den MCP-Server mit externen Agenten geteilt, damit Fähigkeiten zwischen Produkt und anderen Werkzeugen ausgerichtet sind.

## Datenschutz

- Auf dem Desktop bleiben API-Schlüssel und Prompts lokal und werden dem Renderer nicht offengelegt.
- Der deterministische Host, nicht das Modell, validiert und wendet jede Änderung an.
- Alle Schreibvorgänge erhalten vor Ausführung Ihre Zustimmung.

Siehe auch: [Mit dem Assistenten entwerfen](./design.md)、[Einstellungen](./settings.md)、[Cloud-Zugriffskontrolle](../cloud/access-control.md).

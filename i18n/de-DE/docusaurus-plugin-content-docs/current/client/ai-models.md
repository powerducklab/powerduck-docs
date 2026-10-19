---
sidebar_position: 8
title: KI und Modelle
description: "OpenAI-kompatible Modelle konfigurieren, Desktop- und Web-Transport verstehen, Werkzeugaufrufe mit Fallback nutzen und übertragene Daten prüfen."
---

# KI und Modelle

In Powerduck wählen und konfigurieren Sie das Modell des Assistenten. Auf dem Desktop gehen Anfragen über den Hauptprozess an Ihren gewählten Endpunkt; Dokumentänderungen erscheinen weiterhin als überprüfbare Karten.

## Ein Modell mitbringen

Konfigurieren Sie in den Einstellungen den Assistenten zu einem beliebigen **OpenAI-kompatiblen** Chat-Completions-Endpunkt.

- Wählen Sie eine eingebaute Anbieter-Voreinstellung oder legen einen **benutzerdefinierten** Anbieter an.
- Geben Sie Anzeigename, Basis-URL, API-Schlüssel und Modell-ID an.
- Legen Sie mehrere Profile an und wählen zwischen ihnen.

Ein bestimmter Anbieter wird nicht vorausgesetzt. Selbst gehostete und externe OpenAI-kompatible Endpunkte lassen sich auf dieselbe Weise verwenden, sodass Teams ihre eigene Modellrichtlinie umsetzen können.

## Erweiterte Funktionen und eleganter Fallback

Jedes Profil hat eine Schalter **Erweiterte Funktionen**, standardmäßig an.

- An, nutzt die App den **nativen Funktionsaufruf** des Modells: Sie sendet den Werkzeugkatalog über das Netz und lässt das Modell das passende Werkzeug direkt wählen und aufrufen.
- Wenn ein Endpunkt native Werkzeugargumente ablehnt — kleine Modelle ohne Werkzeugunterstützung — wird dieser Endpunkt gemerkt und ein einziger neuer Versuch über ein **inhaltsbasiertes Fallback-Protokoll** unternommen.

Der Fallback verbessert die Kompatibilität, garantiert aber keinen Erfolg: Netzwerk-, Authentifizierungs- und Modellfehler sind weiterhin möglich. Deaktivieren Sie erweiterte Fähigkeiten für Profile, die stets den Basismodus verwenden sollen.

Auch Werkzeugaufrufe sind begrenzt: Der Agent nutzt standardmäßig drei Werkzeugrunden und entfernt wiederholte Aufrufe innerhalb desselben Laufs.

## Warum Requests über den Hauptprozess gehen

Auf dem Desktop-Client wird der fertige Request vom **Node-Hauptprozess** ausgegeben, nicht der WebView. Zwei konkrete Vorteile.

- **Keine Browser-CORS-Mauer.** Cross-Origin-Einschränkungen des Webs blockieren Aufrufe zum Modell-Endpunkt nicht.
- **Die HTTP-Anfrage läuft außerhalb des Renderers.** Dessen Netzwerkpanel zeigt den HTTP-Austausch des Hauptprozesses nicht an. Das garantiert jedoch nicht, dass Prompts oder Schlüssel nicht im Renderer-Speicher, in Protokollen oder anderen Entwicklerwerkzeugen vorkommen.

Das Desktop-Gateway prüft die Anfragestruktur und begrenzt den Ressourcenverbrauch:

- Nur HTTP(S)-URLs werden akzeptiert; Headernamen und -werte, Bodygröße, Zeitlimits und parallele Anfragen werden geprüft. Lokale und private Endpunkte sind erlaubt. Das ist weder eine Host-Zulassungsliste noch eine Datenschutzgarantie des Anbieters;
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

- Prompts, ausgewählter Kontext, Werkzeugbeschreibungen und Zugangsdaten werden an den konfigurierten Modellendpunkt gesendet. Ein gehosteter Anbieter erhält diese Daten. Verwenden Sie einen vertrauenswürdigen lokalen Endpunkt, wenn Ihre Richtlinie lokale Inferenz verlangt;
- Der deterministische Host, nicht das Modell, validiert und wendet jede Änderung an.
- Alle Schreibvorgänge erhalten vor Ausführung Ihre Zustimmung.

Siehe auch: [Mit dem Assistenten entwerfen](./design.md)、[Einstellungen](./settings.md)、[Cloud-Zugriffskontrolle](../cloud/access-control.md).

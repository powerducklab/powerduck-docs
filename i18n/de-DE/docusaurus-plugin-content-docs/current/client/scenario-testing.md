---
sidebar_position: 4
title: Szenario-Tests und Berichte
description: "Verketten Sie geordnete API-Aufrufe mit Datenübergabe und Assertions, führen Sie sie über das lokale CLI aus und exportieren Sie einen eigenständigen HTML-Bericht in zehn Sprachen."
---

# Szenario-Tests und Berichte

Ein Einzel-Request beweist nur einen isolierten Aufruf. Ein **Szenario-Test** beweist einen Arbeitsablauf: eine Request-Folge, die Werte einer Antwort an Folge-Requests gibt und pro Schritt Assertions prüft. Das Szenario erfasst die End-to-End-Abläufe, die nur in den Köpfen der Entwickler lebten.

## Ein Szenario aufbauen

- **Geordnete Schritte**, jeder referenziert eine Operation der Spec.
- **Datenübergabe** zwischen Schritten — etwa die `id` einer erstellten Ressource für den nächsten Request.
- **Assertions** zu Statuscodes, Antwort-Headern und Antwortfeldern.
- Werte, die der Leser vor Ausführung liefern muss.

Reihenfolge und Assertions sind erstklassig und werden bei Ausführung nicht still aufgegeben.

## Ein Szenario ausführen

Das Szenario läuft im Hauptprozess über die `runScenario`-Engine von `@powerduck/openapi-cli`.

- `scenario:run` startet die Ausführung mit Szenario, Spec und Request-Einstellungen.
- Der Fortschritt wird über `scenario:event` gestreamt, während Schritte laufen.
- `scenario:cancel` bricht eine laufende Ausführung ab.

Sie beobachten jeden Schritt, sehen, wo der Ablauf scheitert, und können lange Ausführungen abbrechen.

## Wie der Assistent Szenarien aufbaut

Der Assistent erfindet keine Testdefinitionen innerhalb der Spec. Szenarien sind eigenständige Host-Abläufe und **werden nicht im OpenAPI-Dokument gespeichert** — kein `x-scenarios`-Schlüssel, keine eingebetteten Schritte.

Wenn Sie sowohl Operationsentwurf als auch Tests verlangen, wird die Arbeit geordnet.

1. Der Assistent schlägt zuerst **nur den Operations-Patch** vor.
2. Nach Anwendung gibt er eine **Aktionskarte** zurück, die den Ablauf ausführt:
   - `test.single` für eine einzelne Operation.
   - `scenario.plan`, damit der Host einen End-to-End-Ablauf entdeckt.
   - `scenario.run`, um den geordneten Ablauf vorzubereiten und auszuführen.

Die `scenario.run`-Karte listet Operationen in Ausführungsreihenfolge (2 bis 8), mit den an jeden Folge-Request übergebenen Antwortfeldern, Headern und Zuständen, und beschreibt das Ziel. Jede Referenz ist aus der aktuellen Spec kopiert.

## Berichte

Nach Ausführung können Sie einen **eigenständigen HTML-Bericht** exportieren. Nicht die rohe CLI-Ausgabe, sondern ein zusammenfassendes Dokument, das Ablauf, Ergebnis jedes Schritts, Assertions und Endergebnis in lesbarem Layout zeigt.

Beim Export wählen Sie die Sprache; zehn sind eingebaut.

1. English
2. 简体中文 (Vereinfachtes Chinesisch)
3. 繁體中文 (Traditionelles Chinesisch)
4. 日本語 (Japanisch)
5. 한국어 (Koreanisch)
6. Français (Französisch)
7. Deutsch
8. Español (Spanisch)
9. Português — Brasil (Portugiesisch — Brasilien)
10. العربية (Arabisch)

Eine Option **Sonstiges/Benutzerdefiniert** erlaubt die direkte Spracheingabe.

Der Bericht ist sicher teilbar.

- **Anmeldedaten werden automatisch maskiert**, daher erscheinen Token und Schlüssel nicht.
- **Große Nutzlasten sind eingeklappt**, um den Bericht statt alles einzufügen lesbar zu halten.

Das HTML ist eigenständig: an Tickets anhängen oder pro Release archivieren.

## Wann Szenarien nutzen

- Mehrstufige Geschäftsabläufe (erstellen, lesen, aktualisieren, löschen) prüfen.
- Bestätigen, dass Authentifizierung und Token-Übergabe zwischen Aufrufen funktionieren.
- Verhaltensnachweis der API für Release oder Übergabe erzeugen.
- Ablauf-Regression nach Vertragsänderung.

Siehe auch: [Request-Arbeitsbereich](/docs/client/debug)、[Mit dem Assistenten entwerfen](/docs/client/design)、[Mock-Server](/docs/client/mock-server).

---
title: "OpenAPI mit einem Programmieragenten verbinden"
description: "OpenAPI mit einem Programmieragenten verbinden"
---

# OpenAPI mit einem Programmieragenten verbinden

Mit **Entwickler-MCP** kann ein Programmieragent einen Vertrag untersuchen und ein Backend überprüfen. **API-to-MCP** stellt API-Operationen als aufrufbare Werkzeuge bereit; das ist ein anderer Arbeitsablauf.

1. Öffne deine YAML-/JSON-Datei über **Öffnen** in der Desktop-App. Speichere vor dem Experimentieren eine unabhängige Kopie.
2. Öffne **MCP und Programmierung** für die aktuelle Spezifikation. Alternativ kannst du in einer lokalen Kopie des Entwickler-MCP-Repositorys `npm ci` und `npm run build` ausführen.
3. Konfiguriere im Agenten einen stdio-MCP-Server mit der ausführbaren Datei `node` und den Argumenten `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Verwende tatsächliche absolute Pfade; übernimm die Platzhalter nicht wörtlich.
4. Bitte den Agenten, eine Operation und ihr Antwortschema zu lesen, bevor er dein Backend ändert. Lass ihn nach der Änderung `run_contract_tests` mit der ausdrücklich angegebenen lokalen `baseUrl` des Backends aufrufen.
5. Prüfe die gemeldeten Assertions und den vorgeschlagenen Code-Patch. Führe die Tests erneut aus, nachdem du eine akzeptierte Korrektur übernommen hast.

Der Entwickler-MCP-Server benötigt Node.js 22.12.0 oder neuer. Dein Agent kann Werkzeugergebnisse oder Codekontext an das konfigurierte entfernte Modell senden. Für manuelle lokale Anfragen und Vertragstests ist kein Modell erforderlich. Dein Anbieter rechnet die Nutzung deines Schlüssels ab; Guthaben für gehostete Modelle wird separat geführt. Lokales Arbeiten erfordert kein Cloud-Abonnement.

[Desktop-App herunterladen](https://www.powerduck.com/de/download/) · [Schnellstart](https://www.powerduck.com/docs/de-DE/overview/quickstart/)

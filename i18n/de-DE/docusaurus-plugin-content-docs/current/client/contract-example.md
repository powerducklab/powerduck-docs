---
title: "Implementierungsfehler mit Vertragstests finden"
description: "Implementierungsfehler mit Vertragstests finden"
---

# Implementierungsfehler mit Vertragstests finden

Dieses Beispiel verwendet den Entwickler-MCP-Runner, dessen Antwortschema-Validierung seit Version 0.7.6 verfügbar ist. Erforderlich ist Node.js 22.12.0 oder neuer. Es nutzt fiktive Daten und ein nur auf der Loopback-Schnittstelle erreichbares Backend. Nach der Installation der Abhängigkeiten sind weder Konto noch Modell oder öffentliche API erforderlich.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

Die Antwort lautet `{"total":"42"}`, obwohl das Schema eine Zahl verlangt. Der echte Validator meldet `/total must be number` und beendet sich mit Status 1.

```sh
node examples/contract-total/verify.mjs --correct
```

Das Backend liefert jetzt `{"total":42}`; dieselbe Prüfung besteht und endet mit Status 0. Um die Implementierung selbst zu korrigieren, ändern Sie den Ausdruck `total` in `examples/contract-total/server.mjs` so, dass er eine Zahl zurückgibt. Schwächen Sie den Vertrag nicht ab, um den Fehler zu verbergen.

Jeder Aufruf reserviert einen freien lokalen Port und beendet anschließend seinen Server. Quellcode und Befehle finden Sie im [Beispielprojekt](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Die Schemaprüfung umfasst derzeit JSON-Antworten, ohne Formatvalidierung oder Abruf entfernter Schemas. Nicht unterstützte Inhaltstypen, die eine Schemaprüfung benötigen, werden als Einschränkung gemeldet und nicht stillschweigend als bestanden gewertet.

Hier wird ein echtes Backend geprüft. Eine erfolgreiche Mock-Anfrage demonstriert lediglich den Beispielablauf. Optional kann ein Programmieragent `run_contract_tests` mit einer ausdrücklich angegebenen `baseUrl` für dieselbe Prüfung verwenden. Prüfen Sie seinen Patch, bevor Sie ihn anwenden.

[Desktop-App herunterladen](https://www.powerduck.com/de/download/) · [Schnellstart](https://www.powerduck.com/docs/de-DE/overview/quickstart/)

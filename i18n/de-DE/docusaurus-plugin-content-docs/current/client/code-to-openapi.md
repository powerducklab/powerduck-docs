---
title: "OpenAPI aus einer bestehenden Codebasis erzeugen"
description: "OpenAPI aus einer bestehenden Codebasis erzeugen"
---

# OpenAPI aus einer bestehenden Codebasis erzeugen

Wählen Sie in der Desktop-App **Code nach OpenAPI scannen** (Beta), wählen Sie einen lokalen Quellcodeordner und klicken Sie auf **Scan starten**. Beginnen Sie mit einem kleinen Dienst. Prüfen Sie erkannte Routen, Parameter und Antworten, bevor Sie die erzeugte Spezifikation übernehmen.

Bei einer statischen Analyse können Antwortschemas unbekannt bleiben, wenn Handler von dynamischem Code oder nicht verfügbaren Abhängigkeiten abhängen. „Manuell bestätigen“ dokumentiert Ihre Prüfung, rekonstruiert aber keine fehlenden Typen. Bearbeiten Sie den API-Vertrag anhand belastbarer Informationen oder lassen Sie optional den ausgewählten Handler von der KI prüfen. Dabei werden der ausgewählte Quellcode und sein Kontext an den konfigurierten Modellanbieter gesendet.

Speichern Sie das Ergebnis als neue Datei. Ersetzen Sie einen bestehenden Vertrag erst nach Prüfung der Änderungen. Führen Sie anschließend das [Vertragsbeispiel](/docs/de-DE/client/contract-example/) gegen ein laufendes Backend aus oder verbinden Sie einen [Programmieragenten](/docs/de-DE/client/coding-agent/). Ein erfolgreicher Scan beweist nicht, dass die Implementierung den Vertrag erfüllt.

Dieser Ablauf ist nur in der Desktop-App verfügbar; unterstützte Sprachen und Frameworks hängen vom Scanner ab. Für statische Analysen ist kein Modellschlüssel erforderlich. Behandeln Sie ungeklärte Ergebnisse als unbekannt und nicht als abgeleitete Fakten.

[Desktop-App herunterladen](https://www.powerduck.com/de/download/) · [Schnellstart](https://www.powerduck.com/docs/de-DE/overview/quickstart/)

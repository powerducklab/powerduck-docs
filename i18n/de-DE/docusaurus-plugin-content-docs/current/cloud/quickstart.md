---
sidebar_position: 2
title: Cloud-Schnellstart
description: "Melden Sie sich an, fügen Sie eine Spec per Datei, Git oder URL hinzu, wählen Sie bereitgestellte Operationen und öffnen Doku- und MCP-Links."
---

# Cloud-Schnellstart

Dieser Ablauf trägt eine Spec von Ihrer Maschine zu einer teilbaren Dokumentationsseite und einem MCP-Endpunkt.

## 1. Anmelden

Auf der Anmeldeseite fahren Sie mit **Google** oder **GitHub** fort. Nach dem OAuth-Handshake erzeugt Powerduck Ihre Sitzung und leitet zur Konsole. Eine persönliche Organisation wird automatisch angelegt.

## 2. Spec hinzufügen

Vom Dashboard fügen Sie eine Spec über eine unterstützte Quelle hinzu.

- **Datei** — OpenAPI-Datei direkt hochladen.
- **Git-Repository** — ein Repository zeigen und Branch/Dateipfad wählen.
- **URL** — Spec von einer URL importieren.

Bestehende OpenAPI 3.0/3.1- und Swagger-Dokumente werden angehoben, und cURL- oder Postman-Eingaben werden vor dem Speichern konvertiert, mit Vorschau.

### So funktioniert der Direkt-Upload

Große Dateien werden direkt in den Objektspeicher hochgeladen, nicht über die API.

1. Dokument anlegen.
2. Die App fordert eine **Upload-URL** mit Inhaltstyp und Größe an.
3. Die Datei wird über die vorausgezeichnete URL direkt in den Speicher hochgeladen.
4. Upload **abschließen** und Version sowie SHA-256 erfassen.

So bleibt der API-Server aus dem Pfad großer Nutzlasten heraus.

## 3. Bereitgestellte Operationen wählen

Sobald die Spec bereit ist, wählen Sie die öffentlich zu machenden Operationen, einzeln schaltbar; das Originaldokument ändert sich nicht. Sie können alle aktiv starten und interne/Admin-Schnittstellen einschränken.

## 4. Links öffnen

Wenn das Dokument aktiv ist, zeigt der Dokument-Arbeitsbereich die öffentlichen Adressen.

- **Documentation** — gerenderte API-Doku im öffentlichen Viewer.
- **MCP** — verwalteter Streamable-HTTP-MCP-Endpunkt.
- Die Original-Spec-Daten werden ebenfalls an einer stabilen URL serviert.

Standardmäßig ist die Doku aktiv und nur bei Passwort geschützt. MCP-Verfügbarkeit und Zugriffsschlüssel werden separat konfiguriert.

## 5. Zugriff bei Bedarf schützen

- **Ansichtspasswort** und optionale Gültigkeitsdauer zur Doku hinzufügen.
- Einen **MCP-Zugriffsschlüssel** für den Endpunkt erzeugen.
- Das Dokument pausieren, um beide vorübergehend vom Netz zu nehmen.

## 6. Über Versionen wiederholen

Wenn sich die API ändert, laden Sie den neuen Inhalt als neue Version hoch, statt die alte zu ersetzen. Geteilte Links können dem aktuellen Dokument folgen oder an eine Version fixiert werden, damit Links sich nicht unter Lesern verschieben.

## Nächste Schritte

- [Dokumente und Versionen](./documents-versions.md)
- [Bereitgestellte Operationen](./exposure.md)
- [Zugriffskontrolle](./access-control.md)
- [Benutzerdefinierte Domains](./custom-domains.md)

---
sidebar_position: 6
title: Benutzerdefinierte Domains
description: "Binden Sie einen Hostnamen (oder Hostnamen und Unterpfad) an ein Dokument. Prüfen Sie den Besitz über einen DNS-TXT-Eintrag und servieren dann Doku und MCP von Ihrer Domain."
---

# Benutzerdefinierte Domains

Standardmäßig werden Dokumente von der Powerduck-Freigabeadresse serviert. Eine benutzerdefinierte Domain zeigt Doku und MCP unter **Ihrem eigenen Hostnamen** statt des Freigabelinks, wichtig für die Markenveröffentlichung der API.

Es ist eine kostenpflichtige Funktion, verfügbar in den Plänen **Pro und Team** (geprüft über die `oas.custom_domain`-Berechtigung).

## Host-Ganz-Bindung versus Unterpfad-Bindung

Die Bindung zielt auf:

- **Host ganz** — `api.example.com` serviert ein Dokument an der Wurzel.
- **Host und Unterpfad** — `example.com/v1` serviert ein Dokument unter `/v1`.

Die Unterpfad-Bindung erlaubt einem Hostnamen, mehrere Dokumente zu servieren.

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

So vermeiden Sie die Grenze eines Hostnamens pro Dokument und unterstützen versionierte Basispfade.

## Von der benutzerdefinierten Domain

Die an der Freigabeadresse verfügbaren gleichen Modi werden unter kurzen, stabilen Pfaden unter der gebundenen Domain serviert.

| Modus | Host ganz | Unterpfad |
|---|---|---|
| Aktuelle Spec | `/oas` | `/v1/oas` |
| Versionsfixierte Spec | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

Der Host löst über Anfrage-Hostname und Pfad zum gebundenen Dokument auf. Diese Pfade behandeln CORS-Vorprüfungen.

## Domain hinzufügen und prüfen

Die Domain ist vor Besitzprüfung nicht vertrauenswürdig, daher ist der Fluss klar.

1. Hostnamen (oder Hostnamen und Pfad) zum Dokument **hinzufügen**.
2. Der Dienst gibt die Bindung und **DNS-Anweisungen** zurück.
3. DNS-Eintrag anlegen und **prüfen**.
4. Die Bindung wechselt von wartend zu geprüft, und das Servieren startet.

Die Besitzbestätigung nutzt einen **TXT-Eintrag**.

| Feld | Wert |
|---|---|
| Eintragstyp | `TXT` |
| Host | `_powerduck-challenge.<your-domain>` |
| Wert | `powerduck-verify=<verification-token>` |

Die Prüfung liest den TXT-Eintrag im DNS und vergleicht das Token in konstanter Zeit. Eine geprüfte Bindung bleibt geprüft, keine Neuerkennung nötig.

### Beispiel

Für `api.example.com` einen TXT-Eintrag anlegen.

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Dann im Dokument-Arbeitsbereich **Prüfen** wählen. Sobald als geprüft gemeldet, werden Doku und MCP von dieser Domain serviert (Dokument aktiv, Modi an).

## Bindungen verwalten

- An das Dokument gebundene Domains **auflisten**, mit Zustand und Basispfad.
- Eine wartende Bindung nach DNS-Eintrag **prüfen**.
- Eine Bindung **löschen**, um das Servieren von dieser Domain zu stoppen.

Das Ändern von Zugriffsanzeigen macht die zwischengespeicherte Host-Auflösung ungültig, damit Updates sofort greifen und keine alten Bindungen servieren.

## Zugriffskontrollen gelten weiter

Die benutzerdefinierte Domain ist kein Umgehungsweg: Die gleichen Tore gelten.

- Das Dokument muss `ACTIVE` sein.
- Jeder Modus hat seine Aktiv-Anzeige.
- Das Ansichtspasswort schützt weiter die Doku und der Zugriffsschlüssel das MCP.

Siehe [Zugriffskontrolle](./access-control.md).

Siehe auch: [Dokumente und Versionen](./documents-versions.md)、[Abrechnung](./billing.md).

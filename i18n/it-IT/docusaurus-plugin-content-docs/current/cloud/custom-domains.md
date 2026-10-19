---
sidebar_position: 6
title: Domini personalizzati
description: "Associa un nome host, eventualmente con un percorso, a un documento. Verifica la proprietà tramite un record DNS TXT e pubblica documentazione e MCP sul tuo dominio."
---

# Domini personalizzati

Per impostazione predefinita, i documenti vengono pubblicati sugli indirizzi condivisi di Powerduck. Un dominio personalizzato permette di offrire documentazione e MCP con **il tuo nome host**, così puoi pubblicare le API con il tuo marchio anziché con un link condiviso.

I domini personalizzati sono una funzionalità a pagamento dei piani **Pro e Team**, verificata tramite il diritto `oas.custom_domain`.

## Associazione dell’intero host o di un percorso

Puoi associare:

- **l’intero host** — `api.example.com` serve un documento alla radice;
- **host e percorso** — `example.com/v1` serve un documento sotto `/v1`.

Le associazioni a percorsi permettono di pubblicare più documenti sullo stesso host:

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Non serve quindi un host distinto per ogni documento ed è possibile usare percorsi base legati alle versioni.

## Indirizzi sul dominio personalizzato

Le stesse interfacce dell’indirizzo condiviso sono disponibili sul dominio associato con percorsi brevi e stabili:

| Interfaccia | Intero host | Percorso |
|---|---|---|
| Specifica corrente | `/oas` | `/v1/oas` |
| Specifica di una versione fissata | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

Il nome host e il percorso della richiesta identificano il documento associato. Le richieste preliminari CORS vengono gestite per ciascuno di questi percorsi.

## Aggiunta e verifica di un dominio

Un dominio non è considerato attendibile finché non ne viene verificata la proprietà:

1. **Aggiungi** al documento il nome host, eventualmente con il percorso;
2. il servizio restituisce l’associazione e le **istruzioni DNS**;
3. crea il record DNS e avvia la **verifica**;
4. l’associazione passa da in attesa a verificata e inizia a servire i contenuti.

La verifica usa un **record TXT**:

| Campo | Valore |
|---|---|
| Tipo di record | `TXT` |
| Host | `_powerduck-challenge.<your-domain>` |
| Valore | `powerduck-verify=<verification-token>` |

La verifica legge il record TXT tramite DNS e confronta il token in tempo costante. Un’associazione già verificata resta tale senza una nuova verifica.

### Esempio

Per `api.example.com`, aggiungi questo record TXT:

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Poi scegli **Verifica** nello spazio di lavoro del documento. Quando risulta verificato, il dominio serve documentazione e MCP, purché il documento sia attivo e le rispettive interfacce siano abilitate.

## Gestione delle associazioni

- **Elenca** i domini associati al documento, con stato e percorso base;
- **verifica** un’associazione in attesa dopo aver aggiunto il record DNS;
- **elimina** un’associazione per interrompere la pubblicazione del documento su quel dominio.

Le modifiche alle impostazioni di accesso invalidano la cache di risoluzione degli host, evitando che rimangano in uso associazioni obsolete.

## I controlli di accesso restano validi

Un dominio personalizzato è un indirizzo aggiuntivo, non un modo per aggirare i controlli:

- il documento deve essere `ACTIVE`;
- documentazione e MCP devono essere abilitati separatamente;
- la password continua a proteggere la documentazione e la chiave di accesso continua a proteggere MCP.

Consulta [Controllo degli accessi](/docs/it-IT/cloud/access-control/).

Vedi anche: [Documenti e versioni](/docs/it-IT/cloud/documents-versions/), [Fatturazione](/docs/it-IT/cloud/billing/).

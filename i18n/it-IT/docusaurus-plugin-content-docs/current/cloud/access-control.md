---
sidebar_position: 5
title: Controllo degli accessi
description: "Proteggi la documentazione con password e scadenza, l'endpoint MCP con una chiave di accesso e configura l'autenticazione verso l'API a monte."
---

# Controllo degli accessi

Powerduck distingue l'accesso dei **lettori alla documentazione** da quello dei **client all'endpoint MCP**, perché hanno modalità d'uso diverse. Configura inoltre il modo in cui il server MCP si autentica presso l'API a monte.

## Controlli, nell'ordine

L'accesso pubblico dipende da più condizioni. Conoscerle tutte aiuta a capire perché un documento non si apre.

1. **Stato del documento** — deve essere `ACTIVE`, non sospeso, archiviato o eliminato;
2. **Servizio abilitato** — `documentationEnabled` per la documentazione, `mcpEnabled` per MCP;
3. **Credenziale di accesso** — password di visualizzazione per la documentazione o chiave di accesso per MCP, se configurate;
4. **Scadenza** — l'accesso alla documentazione può scadere a un orario prestabilito.

L'artefatto pubblicato viene generato automaticamente quando aggiungi una versione o cambi le operazioni esposte: normalmente non occorre un passaggio manuale di pubblicazione.

I due servizi sono indipendenti: disabilitare MCP non modifica la documentazione e la password della documentazione non protegge MCP.

## Password di visualizzazione

La password protegge sia la documentazione renderizzata sia i dati della specifica distribuiti:

- Viene memorizzato un hash **scrypt** con un sale casuale distinto per ogni password; il testo in chiaro non viene conservato;
- Se è impostata una password, i lettori devono fornirla prima di ricevere il documento;
- La password protegge **solo la documentazione**: l'endpoint MCP usa la propria chiave di accesso e non verifica questa password.

Puoi anche impostare una **scadenza di visualizzazione**. Dopo la scadenza l'accesso viene negato anche con la password corretta. Rimuovi la password o la scadenza per eliminare la relativa restrizione.

## Chiave di accesso MCP

L'endpoint MCP dispone di una propria **chiave di accesso**:

- Genera o ruota la chiave: il valore completo viene restituito **una sola volta**; in seguito sono visibili solo gli ultimi quattro caratteri;
- Quando è configurata, ogni richiesta MCP deve presentarla come token `Bearer`;
- Il confronto della chiave avviene a **tempo costante**. Una chiave assente o errata produce `401`.

Elimina la chiave per rendere l'endpoint MCP accessibile senza di essa, purché il documento sia attivo e MCP abilitato.

## Autenticazione MCP verso l'API a monte

Separatamente dalla protezione dell'endpoint, puoi configurare come il server MCP si autentica presso l'**API a monte** descritta nella specifica. Sono supportati questi tipi:

| `authType` | Configurazione |
|---|---|
| `NONE` | Nessuna autenticazione verso l'API a monte |
| `BEARER` | Token bearer |
| `BASIC` | Nome utente e password per l'autenticazione di base |
| `APIKEY` | Nome e valore della chiave API, nell'header o nella query |

I segreti, come token bearer, password e valori delle chiavi API, possono essere scritti ma non riletti. La configurazione indica soltanto se sono impostati.

Altre impostazioni MCP:

- **URL di base alternativo** — sostituisce quello dell'API a monte definito nella specifica;
- **Timeout delle richieste** — limite di attesa usato dal server MCP nelle chiamate all'API a monte.

## Configurazione consigliata

- **Documentazione pubblica:** abilitala senza password per le API aperte, oppure imposta password e scadenza per una condivisione controllata;
- **MCP per i tuoi agenti:** abilitalo e genera una chiave di accesso, così solo i tuoi client possono chiamarlo;
- **Autenticazione a monte:** configura le credenziali richieste dall'API reale, indipendentemente da chi può accedere all'endpoint MCP.

Vedi anche: [Operazioni esposte](/docs/it-IT/cloud/exposure/), [Documenti e versioni](/docs/it-IT/cloud/documents-versions/), [Domini personalizzati](/docs/it-IT/cloud/custom-domains/).

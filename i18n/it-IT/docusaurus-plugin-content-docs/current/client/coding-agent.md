---
title: "Collegare OpenAPI a un agente di programmazione"
description: "Collegare OpenAPI a un agente di programmazione"
---

# Collegare OpenAPI a un agente di programmazione

Usa **MCP per sviluppatori** per consentire a un agente di programmazione di esaminare un contratto e verificare un backend. **API-to-MCP** espone le operazioni API come strumenti richiamabili: è un flusso di lavoro diverso.

1. Apri il file YAML/JSON con **Apri** nell’app desktop. Salva una copia indipendente prima di fare esperimenti.
2. Apri **MCP e programmazione** per la specifica corrente. In alternativa, esegui `npm ci` e `npm run build` da una copia locale del repository MCP per sviluppatori.
3. Configura nell’agente un server MCP stdio con l’eseguibile `node` e gli argomenti `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Usa percorsi assoluti reali; non incollare letteralmente i segnaposto.
4. Chiedi all’agente di leggere un’operazione e il relativo schema di risposta prima di modificare il backend. Dopo la modifica, chiedigli di chiamare `run_contract_tests` indicando esplicitamente la `baseUrl` locale del backend.
5. Esamina le asserzioni riportate e la patch proposta. Esegui nuovamente i test dopo aver applicato una correzione accettata.

Il server MCP per sviluppatori richiede Node.js 22.12.0 o versioni successive. L’agente può inviare risultati degli strumenti o contesto del codice al modello remoto configurato. Per le richieste locali manuali e i test di contratto non serve un modello. Il tuo fornitore addebita l’utilizzo della tua chiave; i crediti per i modelli ospitati sono separati. Per lavorare in locale non occorre un abbonamento Cloud.

[Scarica l’app desktop](https://www.powerduck.com/it-IT/download/) · [Guida rapida](https://www.powerduck.com/docs/it-IT/overview/quickstart/)

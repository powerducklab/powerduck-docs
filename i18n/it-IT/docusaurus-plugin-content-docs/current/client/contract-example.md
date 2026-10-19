---
title: "Trovare errori di implementazione con i test di contratto"
description: "Trovare errori di implementazione con i test di contratto"
---

# Trovare errori di implementazione con i test di contratto

Questo esempio usa l’esecutore MCP per sviluppatori, con validazione dello schema delle risposte disponibile dalla versione 0.7.6. Richiede Node.js 22.12.0 o successivo. Usa dati fittizi e un backend in ascolto solo sull’interfaccia di loopback; dopo l’installazione delle dipendenze non servono account, modelli o API pubbliche.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

La risposta è `{"total":"42"}`, mentre lo schema richiede un numero. Il validatore reale segnala `/total must be number` e termina con codice 1.

```sh
node examples/contract-total/verify.mjs --correct
```

Il backend ora restituisce `{"total":42}`; lo stesso controllo passa e termina con codice 0. Per correggere l’implementazione, modifica l’espressione `total` in `examples/contract-total/server.mjs` affinché restituisca un numero. Non indebolire il contratto per nascondere l’errore.

Ogni esecuzione assegna una porta locale libera e arresta il proprio server al termine. File sorgenti e comandi sono nel [progetto di esempio](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Attualmente i controlli dello schema coprono le risposte JSON, senza validazione dei formati né recupero di schemi remoti. Se un tipo di contenuto non supportato richiede la validazione, viene segnalata una limitazione anziché considerare il controllo superato.

Questo verifica un backend reale. Una richiesta Mock riuscita dimostra soltanto il funzionamento del flusso di esempio. Facoltativamente, un agente di programmazione può usare `run_contract_tests` con un `baseUrl` esplicito per eseguire la stessa verifica; esamina la patch prima di applicarla.

[Scarica l’app desktop](https://www.powerduck.com/it-IT/download/) · [Guida rapida](https://www.powerduck.com/docs/it-IT/overview/quickstart/)

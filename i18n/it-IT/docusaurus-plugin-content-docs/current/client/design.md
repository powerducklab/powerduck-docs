---
sidebar_position: 2
title: "Progettare con l'assistente"
description: "L'area Specifica è dedicata alla progettazione delle API. Affianca una chat con l'IA al documento aggiornato e alla sua anteprima, così puoi descrivere ciò che vuoi in linguaggio naturale mantenendo il controllo sulle modifiche effettive."
---

# Progettare con l'assistente

L'area Specifica è dedicata alla progettazione delle API. Affianca una chat con l'IA al documento aggiornato e alla sua anteprima, così puoi descrivere ciò che vuoi in linguaggio naturale mantenendo il controllo sulle modifiche effettive.

## Il ciclo di approvazione

Il modello non modifica direttamente il documento. Il processo prevede passaggi espliciti:

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Questa separazione è una scelta fondamentale: il **modello** interpreta l'intento e propone una struttura; l'**applicazione host** verifica ogni operazione in modo deterministico; **tu** approvi ogni modifica. Una proposta non viene mai considerata applicata prima della tua conferma.

## Schede delle modifiche

Una scheda riepiloga la modifica e ne elenca le operazioni esatte, per esempio l'aggiunta di un percorso:

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

I segmenti del percorso sono elementi di un array, non stringhe JSON Pointer. Per aggiungere un nuovo percorso si usa `["paths", "/products"]`; i contenitori superiori vengono creati automaticamente.

### Modifiche puntuali alle operazioni esistenti

Quando modifichi un'operazione esistente, l'assistente **non** invia nuovamente l'intera definizione: così facendo cancellerebbe i campi non inclusi. Genera invece piccole operazioni che intervengono solo sulla parte da cambiare, anche nei livelli più profondi:

- Aggiungere un parametro di query:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Estendere lo schema della risposta:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Modificare un singolo campo:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Per aggiungere elementi agli array si usa il token `"-"`, senza inviare di nuovo l'intero array. I parametri sono identificati dalla coppia `(in, name)`, evitando di duplicare quelli esistenti. L'applicazione unisce il valore proposto all'operazione corrente e conserva ciò che non è incluso nella modifica.

Questo rende affidabili le revisioni successive: se chiedi «aggiungi un parametro limit» o «rendi obbligatorio il nome», cambia soltanto quel campo e il resto dell'operazione rimane intatto.

## Strumenti di lettura a supporto delle proposte

Prima di rispondere, il modello può usare strumenti di sola lettura per conoscere lo stato corrente esatto senza doverlo indovinare:

- `spec.overview`: titolo, versione, protocolli, conteggi, tag, server e sicurezza;
- `spec.listOperations`: tutte le operazioni nel formato `METHOD /path`, con riepilogo e tag;
- `spec.presentOperations`: una scheda di sola lettura con l'elenco di tutte le operazioni;
- `spec.getOperation`: la definizione completa di un'operazione e gli schemi a cui fa riferimento;
- `spec.getSchema`: uno schema dei componenti, inclusi campi obbligatori e descrizioni.

Se la struttura completa di un'operazione non è visibile, il modello deve leggerla prima di modificarla.

## Le richieste ampie procedono per fasi

Per una richiesta estesa, come «crea un'API per un negozio online», l'assistente non produce tutto in una volta:

1. Pone prima una **domanda di chiarimento** sulle decisioni principali;
2. Dopo la tua risposta, propone **una modifica mirata alla volta**, con da due a cinque operazioni per scheda;
3. Prosegue soltanto finché la tua richiesta più recente resta entro quell'obiettivo.

Appena l'ambito è chiaro, l'assistente genera anche un `plan` degli endpoint che intende creare, così puoi vedere l'organizzazione del lavoro prima di ricevere le modifiche.

## Evitare modifiche fuori obiettivo

L'applicazione applica alcune regole per mantenere il lavoro coerente:

- Il **documento corrente** è la fonte autorevole: il modello non presume che una modifica precedente sia presente se il documento indica il contrario;
- In modalità mirata modifica soltanto l'elemento attivo e gli schemi dei componenti citati esplicitamente, senza intervenire sugli endpoint vicini;
- Indicare esplicitamente un diverso `METHOD /path` equivale a un cambio intenzionale di attività;
- La cronologia tiene traccia delle proposte applicate e rifiutate; le modifiche già presenti non vengono riproposte.

Se mancano dettagli necessari, l'assistente fa una domanda specifica invece di inventarli.

## Altri tipi di scheda

Non tutte le risposte propongono modifiche:

- Le **schede domanda** chiedono di scegliere tra alcune opzioni;
- Le **schede di validazione** riportano i controlli di qualità con esiti positivi, avvisi ed errori;
- Le **schede azione** offrono passi concreti, come eseguire uno scenario o aprire un'area di lavoro;
- Le **schede tabella dati** mostrano righe di esempio o dati di test per un endpoint o uno schema.

Vedi anche: [Area di lavoro delle richieste](./debug.md), [Test di scenario](./scenario-testing.md), [IA e modelli](./ai-models.md).

## Agenti A2A

Progetta e verifica messaggi degli agenti con versione, operazioni sulle attività e aggiornamenti SSE usando `x-protocol: a2a`. Consulta [Agenti A2A](./a2a.md) per i campi dell'estensione e i binding JSON-RPC, REST e gRPC desktop.

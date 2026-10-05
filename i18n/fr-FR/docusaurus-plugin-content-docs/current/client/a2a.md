---
sidebar_position: 6
title: "Agents A2A"
description: "Concevoir, déboguer et documenter A2A : JSON-RPC, REST, gRPC sur ordinateur, vérification JWS et démo locale."
---

# Agents A2A

MCP expose des outils et des ressources ; A2A permet aux agents de déléguer du travail, d’échanger des messages et de suivre des tâches et leurs livrables. Powerduck conserve ces protocoles distincts dans une même spécification locale.

## Créer et déboguer

1. Choisissez **Nouvelle requête → A2A**. La valeur par défaut est **1.0 / JSON-RPC**. La version 1.0 prend aussi en charge REST et gRPC sur ordinateur ; la version 0.3 utilise uniquement JSON-RPC. Aucune conversion implicite de version n’est effectuée.
2. Configurez l’URL et la méthode. Cliquez sur **Générer le corps de requête**, vérifiez l’aperçu, puis sur **Remplacer le corps de requête**. Annuler ou changer seulement de méthode conserve le brouillon.
3. Modifiez `params` pour JSON-RPC, ou directement l’objet de requête pour REST/gRPC, sans enveloppe `jsonrpc`, `id`, `params`. Configurez les identifiants dans Auth et les en-têtes. L’envoi ajoute `A2A-Version`.
4. Inspectez l’intégralité de la réponse : HTTP 200 peut contenir une erreur RPC `error`. En JSON-RPC 1.0, `result` contient un `task` ou un `message`.
5. Enregistrez dans la spécification : `x-a2a` conserve configuration, exemples et contrats. JSON-RPC utilise la méthode du corps ; REST/gRPC la méthode sélectionnée. L’identifiant de requête et celui du message sont distincts. Pour poursuivre une conversation, conservez les identifiants de contexte et de tâche renvoyés.

## Transports

L’URL REST est le point de montage, par exemple `https://agent.example/rest`. La méthode détermine le verbe HTTP et le chemin. Les identifiants de tâche sont encodés ; filtres et pagination deviennent des paramètres de requête. Le débogueur et les exemples de documentation partagent cette correspondance.

gRPC nécessite l’application de bureau. Utilisez `https://host:port` avec la confiance du système pour TLS, ou `http://localhost:port` pour un test local sans chiffrement, sans composant de chemin. Les en-têtes deviennent des métadonnées. Le descripteur officiel `lf.a2a.v1.A2AService` et ProtoJSON assurent la conversion. Les scripts HTTP, proxys et paramètres TLS personnalisés sont refusés pour ce transport.

## Agent Card et JWS

**Charger la fiche agent publique** récupère généralement `/.well-known/agent-card.json`. Vérifiez version, compétences, capacités et authentification avant d’appliquer explicitement une interface. Le chargement ne modifie pas l’URL et ne transmet pas vos identifiants à une autre origine. La découverte publique n’utilise ni identifiants ni redirections et limite la réponse à 1 MiB. Le navigateur nécessite CORS.

Développez **Vérifier la signature JWS** et collez un JWKS public obtenu par un canal de confiance. La vérification est locale et ne suit jamais les URL de clés de la fiche. Elle couvre les champs standard A2A 1.0, pas les extensions personnalisées. La normalisation suit les règles de présence A2A et RFC 8785, en conservant chaînes et tableaux vides obligatoires ainsi que les booléens facultatifs explicitement présents. Une signature qui supprime ces valeurs est refusée. Une signature valide ne prouve pas l’identité de l’organisation possédant une clé inconnue.

Enregistrer la fiche conserve un instantané, pas une décision de confiance. Retirez les métadonnées privées avant tout partage. Pour une fiche protégée, utilisez la méthode extended-card authentifiée.

## Tâches et flux

En 1.0, utilisez `SendStreamingMessage` ou `SubscribeToTask` ; en 0.3, `message/stream` ou `tasks/resubscribe`. Inspectez les événements SSE ou gRPC natifs, les états et les livrables. **Arrêter** ferme seulement la connexion locale. Pour annuler à distance, envoyez `CancelTask` ou `tasks/cancel` avec l’identifiant de tâche. Une tâche terminée ne peut pas simplement être redémarrée.

La récupération des tâches, leur liste en 1.0, les fiches étendues et la configuration des notifications dépendent des capacités de l’agent. Powerduck n’héberge pas de récepteur de notifications push.

## Extension OpenAPI

`x-a2a` est une extension Powerduck, pas une Agent Card standard ni un mot-clé OpenAPI. Le chemin documenté identifie l’opération ; `endpoint` est l’adresse réelle.

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version` vaut `1.0` ou `0.3`. `binding` vaut `JSONRPC`, ou également `HTTP+JSON` et `GRPC` en 1.0. `agentCardUrl` indique la découverte et `agentCard` un instantané facultatif. `example` contient une enveloppe JSON-RPC ou un objet REST/gRPC. `requestSchema` et `responseSchema` décrivent des contrats explicites, non déduits d’une seule réponse. SSE utilise `text/event-stream` et `itemSchema` d’OAS 3.2. La documentation et Copy for LLM conservent ces données ; gRPC affiche du ProtoJSON, les transports HTTP leurs exemples de code.

## Générer un serveur

Ouvrez **Générer un serveur → Télécharger le projet serveur** pour obtenir un projet Node.js 22+. Exécutez `npm install`, définissez `A2A_TOKEN` avec au moins 32 caractères aléatoires et `HANDLER_URL`, puis `npm start`. Le gestionnaire HTTP reçoit `{message, contextId}` et renvoie un Message avec des `parts` non vides. Aucun identifiant existant n’est exporté.

Le serveur limite les charges et la concurrence, impose un délai de 60 secondes et nettoie les ressources à l’arrêt. `SIGNING_JWK_FILE` active la signature ; `CORS_ORIGINS` autorise explicitement des origines de navigateur. Cet adaptateur est sans état, sans moteur de tâches persistantes ni distribution push. Avant une exposition publique, configurez URL, TLS, limitation de débit du proxy inverse et authentification multi-utilisateur.

## Démo locale exécutable

Le dépôt React contient `examples/a2a-demo`, un calculateur de sommes sans clé IA ni service externe. Utilisez Node.js 22+.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

Exécutez `npm test` dans un autre terminal du même dossier. Importez `openapi.json` et utilisez le Bearer Token `powerduck-local-demo-token-0123456789`. Envoyer `[12,30]` produit `Sum: 42` et `total: 42`. JSON-RPC : `http://127.0.0.1:9999/rpc` ; REST : `http://127.0.0.1:9999/rest` ; gRPC : `http://127.0.0.1:9998`. Fiche : `http://127.0.0.1:9999/.well-known/agent-card.json`. Collez la clé publique locale `.runtime/trusted-jwks.json` pour vérifier la signature ; elle change au redémarrage.

Le test utilise des ports isolés et vérifie les trois transports, SSE, les réponses structurées, le rejet des modifications, l’authentification et CORS. La démo écoute uniquement en local, sans tâches persistantes ni push. N’utilisez pas son token en production. Les origines autorisées par défaut sont `http://localhost:3000` et `http://127.0.0.1:3000` ; configurez les autres avec `CORS_ORIGINS`.

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)

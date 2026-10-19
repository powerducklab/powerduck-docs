---
title: "Enregistrement des requêtes et exemples de protocoles"
description: "Powerduck sépare la requête que vous testez du contrat que vous publiez."
---

# Enregistrement des requêtes et exemples de protocoles

Powerduck sépare la requête que vous testez du contrat que vous publiez.

| Action | Résultat |
| --- | --- |
| Enregistrer dans la barre d’URL | Enregistre la configuration locale de débogage de cette requête sans modifier le document OpenAPI. |
| Requête rapide : enregistrer dans la spécification | Ajoute une opération au document et au dossier sélectionnés. |
| Requête de la spécification : mettre à jour la spécification | Affiche la méthode, le chemin de destination et l’aperçu de la définition avant de modifier le contrat. |
| Enregistrer le document / Cmd+S ou Ctrl+S | Écrit le document OpenAPI actuel sur disque. Dans un onglet de requête rapide, le raccourci enregistre cette requête rapide. |

La requête locale contient le serveur sélectionné, l’URL, la méthode, les valeurs des paramètres, le corps, les scripts et les réglages de transport. Les brouillons des requêtes de la spécification restent en mémoire pendant l’édition ; le bouton Enregistrer de la barre d’URL les conserve dans le stockage du processus de rendu sous `powerduck.debug.v1:`. Les entrées sont isolées par identifiant de document, chemin et méthode. Effacer les données du navigateur ou de l’application supprime cet état local ; l’export OAS ne l’inclut pas. Ce stockage **n’est pas un coffre-fort chiffré** : utilisez des références d’environnement plutôt que des identifiants en clair dans les URL, en-têtes ou corps. Les contrôles d’authentification disposent de leur propre mécanisme de persistance des identifiants.

`x-powerduck-request` **n’est pas une extension officielle du contrat**. Les actions d’ajout ou de mise à jour de la spécification ne l’émettent pas. Elle ne doit pas décrire une méthode, un paramètre, un corps de requête ou une réponse. Ouvrir un document ne réécrit pas ses occurrences dans les autres opérations.

## Modifier une définition explicitement

La mise à jour de la spécification prévisualise la méthode et le chemin de destination tout en conservant les réponses et schémas existants. Les définitions de paramètres sont facultatives ; leurs valeurs de débogage ne sont pas copiées. Un corps JSON n’est ajouté comme exemple que si vous le sélectionnez explicitement. Les noms de champs d’identifiants courants sont exclus, mais **relisez les textes libres et les exemples avant publication**. Les scripts et les remplacements d’authentification ne font pas partie du contrat.

Changer la méthode ou le chemin ne permet pas d’écraser une opération cible existante. Les références locales aux opérations sont ajustées. Une méthode personnalisée telle que `PURGE` est stockée dans `paths./cache.additionalOperations.PURGE` et nécessite OpenAPI 3.2. L’aperçu indique cette exigence, et l’application de la modification passe le document en version 3.2.0. Vérifiez également la compatibilité des outils en aval.

L’édition des schémas de protocole reste accessible via Modifier la documentation. Elle modifie explicitement la définition ; envoyer ou enregistrer une requête de débogage ne réécrit pas silencieusement les schémas.

## Exemples officiels à télécharger

Ces fichiers sont des **définitions d’exemple** maintenues, pas des services API publics de Powerduck. Tous les endpoints pointent vers des services locaux que vous devez fournir. Importer un fichier ne démarre pas ces services, ne s’y connecte pas automatiquement et ne fournit pas d’identifiants.

- [Tous les protocoles](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP et méthode PURGE personnalisée](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) et [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Pour gRPC, téléchargez `echo.proto` à côté du fichier YAML, puis sélectionnez son chemin local réel dans le client si nécessaire. Le serveur doit implémenter `powerduck.examples.Echo/Echo` sur le port 50051. Les autres exemples nécessitent eux aussi un serveur correspondant ; ils ne démontrent pas une validation sur un backend en fonctionnement.

## Référence des extensions de contrat

Chaque opération possède une méthode OAS ordinaire, un operationId, un summary et des responses. Les liaisons non HTTP utilisent une opération OAS comme point d’ancrage documentaire ; `post` dans l’exemple gRPC ne signifie pas que gRPC a été converti en endpoint REST.

| Extension | Signification et champs utilisés dans les exemples |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` ou `a2a`. Facultatif pour HTTP. |
| `x-session` | Déclare une session de protocole longue durée ; les exemples l’utilisent pour WebSocket et MCP. |
| `x-websocket` | `url`, `subprotocols` facultatif, `headers` et `messages`. Chaque message documenté possède `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Ne placez pas d’identifiants dans les en-têtes. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, `variables` publiques, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` et `messages` documentés. `kind` accepte unary/server_streaming/client_streaming/bidi_streaming. Les chemins proto locaux dépendent du déploiement. |
| `x-mcp` | `transport`, `endpoint`, `method`, ainsi que les champs propres à la méthode : `name`, `argumentsSchema`, `arguments` publics, `responseSchema`. Les opérations sur les ressources utilisent `uri` ; ne mélangez pas les champs de méthodes sans rapport. |
| `x-a2a` | `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` explicites et `example` public. Les charges utiles 0.3 et 1.0 diffèrent ; voir [A2A](./a2a.md). |
| `x-response-stream` | Intention facultative de streaming GraphQL, à utiliser lorsque le serveur et le transport réels prennent en charge le streaming. Inutile pour les requêtes GraphQL ordinaires. |

SSE utilise le champ standard `responses.200.content.text/event-stream.itemSchema` pour décrire chaque charge utile d’événement. HTTP utilise les paramètres, requestBody, responses et schémas de sécurité standard. N’inventez pas de bloc `x-sse` et ne stockez pas l’état de débogage dans une extension de contrat.

Les exemples fournissent une configuration complète et utilisable pour la liaison choisie, plutôt que toutes les options mutuellement exclusives. MCP stdio nécessite un exécutable local configuré séparément ; ces exemples téléchargeables ne le démarrent volontairement pas.

## Intégration des paquets

L’interface de bureau gère la persistance du débogage local et les écritures explicites de la spécification. `@powerduck/openapi-parser` lit déjà les méthodes personnalisées via `additionalOperations` ; `@powerduck/tree` et `@powerduck/oas-document` exploitent cette structure. `@powerduck/openapi-request` reçoit les arguments d’exécution séparément de la spécification. L’exécution d’une requête ne nécessite pas `x-powerduck-request`.

Cette séparation des enregistrements n’ajoute aucun paramètre npm public. Utilisez les extensions de protocole existantes pour les données du contrat et transmettez les valeurs de débogage actuelles à l’API d’exécution. N’intégrez pas l’enveloppe privée de l’état des requêtes dans les exporteurs, générateurs ou outils MCP.

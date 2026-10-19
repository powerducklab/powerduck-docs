---
title: "Détecter une erreur d’implémentation avec les tests de contrat"
description: "Détecter une erreur d’implémentation avec les tests de contrat"
---

# Détecter une erreur d’implémentation avec les tests de contrat

Cet exemple utilise l’exécuteur MCP pour développeurs, dont la validation du schéma de réponse est disponible depuis la version 0.7.6. Il nécessite Node.js 22.12.0 ou version ultérieure. Il utilise des données fictives et un backend limité à l’interface de bouclage ; après l’installation des dépendances, aucun compte, modèle ou API publique n’est nécessaire.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

La réponse est `{"total":"42"}`, alors que le schéma exige un nombre. Le véritable validateur signale `/total must be number` et termine avec le code 1.

```sh
node examples/contract-total/verify.mjs --correct
```

Le backend renvoie maintenant `{"total":42}` ; la même vérification réussit et termine avec le code 0. Pour corriger vous-même l’implémentation, modifiez l’expression `total` dans `examples/contract-total/server.mjs` afin qu’elle renvoie un nombre. N’assouplissez pas le contrat pour masquer l’erreur.

Chaque exécution réserve un port local libre et arrête son serveur à la fin. Les fichiers sources et les commandes figurent dans [le projet d’exemple](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Les vérifications de schéma couvrent actuellement les réponses JSON, sans validation des formats ni récupération de schémas distants. Un type de contenu non pris en charge nécessitant une validation est signalé comme une limitation, plutôt que considéré à tort comme valide.

Cette vérification porte sur un véritable backend. Une requête Mock réussie ne démontre que le fonctionnement de l’exemple. Un agent de programmation peut éventuellement appeler `run_contract_tests` avec un `baseUrl` explicite pour effectuer la même vérification ; examinez son correctif avant de l’appliquer.

[Télécharger l’application desktop](https://www.powerduck.com/fr/download/) · [Démarrage rapide](https://www.powerduck.com/docs/fr-FR/overview/quickstart/)

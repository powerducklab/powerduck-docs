---
title: "Connecter OpenAPI à un agent de développement"
description: "Connecter OpenAPI à un agent de développement"
---

# Connecter OpenAPI à un agent de développement

Utilisez **MCP pour développeurs** pour permettre à un agent de développement d’examiner un contrat et de vérifier un backend. **API-to-MCP** expose les opérations d’une API sous forme d’outils appelables ; il s’agit d’un autre flux de travail.

1. Ouvrez votre fichier YAML/JSON avec **Ouvrir** dans l’application de bureau. Enregistrez une copie indépendante avant toute expérimentation.
2. Ouvrez **MCP et développement** pour la spécification actuelle. Vous pouvez également exécuter `npm ci` puis `npm run build` depuis une copie locale du dépôt MCP pour développeurs.
3. Configurez un serveur MCP stdio dans votre agent avec l’exécutable `node` et les arguments `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Utilisez de véritables chemins absolus ; ne recopiez pas ces exemples tels quels.
4. Demandez à l’agent de lire une opération et son schéma de réponse avant de modifier votre backend. Après la modification, demandez-lui d’appeler `run_contract_tests` en précisant explicitement la `baseUrl` locale du backend.
5. Examinez les assertions du rapport et le correctif de code proposé. Relancez les tests après avoir appliqué une correction que vous avez acceptée.

Le serveur MCP pour développeurs nécessite Node.js 22.12.0 ou une version ultérieure. Votre agent peut envoyer les résultats des outils ou le contexte du code au modèle distant configuré. Un modèle n’est pas nécessaire pour les requêtes locales manuelles et les tests de contrat. Votre fournisseur facture l’utilisation de votre clé ; les crédits des modèles hébergés sont distincts. Aucun abonnement Cloud n’est requis pour travailler en local.

[Télécharger l’application de bureau](https://www.powerduck.com/fr/download/) · [Démarrage rapide](https://www.powerduck.com/docs/fr-FR/overview/quickstart/)

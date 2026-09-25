---
sidebar_position: 1
title: Client de bureau
description: "Le client de bureau Powerduck est un espace de travail local-first piloté par IA. Depuis un seul fichier OpenAPI sur votre machine, concevez des API, déboguez des requêtes, exécutez des tests, simulez des API, publiez de la documentation et exposez des outils MCP."
---

# Client de bureau

Le client de bureau est l'endroit où le flux de travail natif IA se déroule sur votre propre machine. Vous ouvrez le `openapi.yaml` de votre dépôt, décrivez le résultat souhaité, puis vérifiez. Plus besoin de basculer entre éditeur de spécification, client HTTP, outil de simulation, générateur de documentation et exécuteur de tests, et vous démarrez sans compte cloud.

Vous gardez toujours le contrôle : l'assistant propose, vous approuvez.

## Une journée dans l'espace de travail

Voici les moments que le client place au centre.

- **Ouvrir la spécification et comprendre l'ensemble.** L'assistant lit le document courant et propose immédiatement ce qu'il peut en faire : champs à remplir, documentation à compléter, flux à tester.
- **Construire l'API.** Décrivez une ressource et l'assistant propose les opérations. Continuez à affiner la même opération — ajouter un paramètre, resserrer une réponse, ajuster un code d'état — et il reste sur cette API sans perturber le reste du document.
- **Préparer des données de test.** Générez des données d'exemple réalistes à partir des schémas pour donner des valeurs concrètes aux requêtes et scénarios.
- **Exécuter une requête unique ou un scénario complet.** Déboguez un appel isolé ou enchaînez plusieurs opérations dans un flux de bout en bout, et recevez un rapport partageable sur ce qui passe et échoue.
- **Avancer avant que le backend soit prêt.** Démarrez une simulation locale qui répond selon le contrat pendant que le service réel est en cours de développement.
- **Passer l'API à un agent de programmation.** Transformez la spécification en serveur MCP pour que les outils IA découvrent et appellent les bonnes opérations avec les bons paramètres.
- **Voir la base de données derrière l'API.** Dérivez les tables, relations et SQL à partir de la spécification, comparez avec une base réelle et comprenez les changements à venir.
- **Changer les réglages sans quitter la conversation.** Changez de thème ou de langue, configurez un proxy, gérez les variables d'environnement en le demandant simplement.

## Chaque mode et son usage

Un seul document pilote tous les modes, accessibles via un sélecteur compact.

| Mode | Ce qu'il fait |
|---|---|
| [**Spécification**](/docs/client/design) | Mode principal : chat IA, document, aperçu en direct |
| [**Espace de travail de requête**](/docs/client/debug) | Envoie et inspecte de vraies requêtes HTTP ; onglets et environnements |
| [**Tests de scénario**](/docs/client/scenario-testing) | Enchaîne des opérations en flux, les exécute et produit un rapport |
| [**Documentation**](/docs/client/protocols) | Lit la spécification comme documentation API rendue |
| [**MCP**](/docs/client/protocols) | Vérifie et utilise le serveur MCP dérivé de la spécification |
| [**Serveur de simulation**](/docs/client/mock-server) | Exécute une simulation locale pendant le développement de l'API |
| [**Modèle de données**](/docs/client/data-model) | Dérive tables et relations, compare avec la base et génère du SQL |
| [**Réglages**](/docs/client/settings) | Thème, langue, proxy, certificats, préférences de l'espace de travail |

## Comment vous collaborez avec l'assistant

Vous décrivez l'intention en langage naturel, l'assistant choisit la capacité adaptée, le moteur déterministe valide, et vous approuvez via une carte. Le modèle n'édite jamais le document lui-même.

- Les modifications de spécification arrivent sous forme de **cartes de correctif** contenant des opérations fines. Quand vous éditez une opération existante, seuls les champs demandés changent.
- Les tâches en lecture seule — lister les opérations, récupérer un schéma, exécuter une requête — renvoient les faits sur lesquels l'assistant fonde sa réponse.
- Les actions d'écriture demandent confirmation avant exécution.

Le modèle, **c'est vous qui le configurez**. Pointez l'application vers n'importe quel fournisseur compatible OpenAI et choisissez-le dans les réglages. Voir [IA et modèles](/docs/client/ai-models).

## Ce que local-first signifie pour vous

- **Vos vrais fichiers.** Vous ouvrez, éditez et enregistrez de vrais fichiers sur le disque et suivez les changements locaux.
- **Aucun mur CORS.** Les requêtes passent par un processus local, pas la WebView, donc les restrictions cross-origin ne bloquent pas les appels.
- **Invites et clés privées.** Traitées en local, elles n'apparaissent pas dans le panneau réseau du navigateur.
- **Fonctionne hors ligne.** La conception, la simulation et la documentation n'ont pas besoin du réseau ; seules les vraies requêtes, la synchronisation Git et les modèles hébergés en ont besoin.
- **Environnements exécutés en local.** Simulations, exécuteur de scénarios, accès base et terminal tournent sur votre machine.

## Licence de bureau

Le client de bureau est vendu sous licence **perpétuelle après un achat unique**. Vous l'achetez une fois, le possédez pour toujours, il fonctionne entièrement hors ligne et ne nécessite aucun compte. La clé est générée à l'achat et affichée une seule fois. Il est distinct de Powerduck Cloud, le service d'hébergement par abonnement mensuel. Voir [Facturation Cloud](/docs/cloud/billing).

## Commencez ici

- [Concevoir avec l'assistant](/docs/client/design)
- [Espace de travail de requête et environnements](/docs/client/debug)
- [Tests de scénario et rapports](/docs/client/scenario-testing)
- [Protocoles](/docs/client/protocols)
- [Modèle de données et diagramme ER](/docs/client/data-model)
- [Serveur de simulation](/docs/client/mock-server)
- [IA et modèles](/docs/client/ai-models)
- [Réglages](/docs/client/settings)

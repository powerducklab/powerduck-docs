---
sidebar_position: 1
title: Client de bureau
description: "Le client de bureau Powerduck est un espace de travail local-first piloté par IA. Depuis un seul fichier OpenAPI sur votre machine, concevez des API, déboguez des requêtes, exécutez des tests, simulez des API, publiez de la documentation et exposez des outils MCP."
---

# Client de bureau

Powerduck, y compris le client de bureau, exige une connexion Google OAuth ou GitHub. Les fichiers restent sur le disque. L’analyse IA transmet le contexte sélectionné aux fournisseurs gérés par Powerduck ; les URL de modèles et clés API personnalisées ne sont plus prises en charge.

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
| [**Spécification**](./design.md) | Mode principal : chat IA, document, aperçu en direct |
| [**Espace de travail de requête**](./debug.md) | Envoie et inspecte de vraies requêtes HTTP ; onglets et environnements |
| [**Tests de scénario**](./scenario-testing.md) | Enchaîne des opérations en flux, les exécute et produit un rapport |
| [**Documentation**](./protocols.md) | Lit la spécification comme documentation API rendue |
| [**MCP**](./protocols.md) | Vérifie et utilise le serveur MCP dérivé de la spécification |
| [**Serveur de simulation**](./mock-server.md) | Exécute une simulation locale pendant le développement de l'API |
| [**Modèle de données**](./data-model.md) | Dérive tables et relations, compare avec la base et génère du SQL |
| [**Réglages**](./settings.md) | Thème, langue, proxy, certificats, préférences de l'espace de travail |

## Comment vous collaborez avec l'assistant

Vous décrivez l'intention en langage naturel, l'assistant choisit la capacité adaptée, le moteur déterministe valide, et vous approuvez via une carte. Le modèle n'édite jamais le document lui-même.

- Les modifications de spécification arrivent sous forme de **cartes de correctif** contenant des opérations fines. Quand vous éditez une opération existante, seuls les champs demandés changent.
- Les tâches en lecture seule — lister les opérations, récupérer un schéma, exécuter une requête — renvoient les faits sur lesquels l'assistant fonde sa réponse.
- Les actions d'écriture demandent confirmation avant exécution.

Powerduck, y compris le client de bureau, exige une connexion Google OAuth ou GitHub. Les fichiers restent sur le disque. L’analyse IA transmet le contexte sélectionné aux fournisseurs gérés par Powerduck ; les URL de modèles et clés API personnalisées ne sont plus prises en charge.

## Ce que local-first signifie pour vous

Powerduck, y compris le client de bureau, exige une connexion Google OAuth ou GitHub. Les fichiers restent sur le disque. L’analyse IA transmet le contexte sélectionné aux fournisseurs gérés par Powerduck ; les URL de modèles et clés API personnalisées ne sont plus prises en charge.

## Powerduck · Free / Pro / Max

Free : 300 000 credits par jour, réinitialisés à 00:00 UTC. Pro : 39 $/mois, 18 000 000 credits tous les 7 jours. Max : 99 $/mois, 60 000 000 credits tous les 7 jours. Le cycle part du début initial de l’abonnement, indépendamment de la facturation mensuelle. Aucun report. Le bureau et AI Chat partagent le forfait personnel ; les licences perpétuelles et clés d’activation ne sont plus vendues.

## Commencez ici

- [Concevoir avec l'assistant](./design.md)
- [Espace de travail de requête et environnements](./debug.md)
- [Tests de scénario et rapports](./scenario-testing.md)
- [Protocoles](./protocols.md)
- [Modèle de données et diagramme ER](./data-model.md)
- [Serveur de simulation](./mock-server.md)
- [IA et modèles](./ai-models.md)
- [Réglages](./settings.md)

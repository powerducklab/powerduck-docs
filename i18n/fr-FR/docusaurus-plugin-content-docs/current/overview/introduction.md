---
sidebar_position: 1
title: Introduction
description: "Powerduck est une plateforme native IA et local-first construite autour d'un seul YAML OpenAPI. Vous et l'IA concevez, déboguez, testez, simulez, documentez et exposez des outils MCP depuis le même fichier. Disponible en client de bureau, en cloud et en bibliothèques open source."
---

# Introduction

La façon de construire les API change. Pendant vingt ans, l'**opérateur** était un humain qui cliquait dans une interface, et le **consommateur** d'un contrat API était un humain qui lisait la documentation. Aujourd'hui, les deux extrémités changent.

- L'opérateur devient un **assistant IA** qui transforme l'intention en actions.
- Le consommateur devient un **agent IA** qui appelle l'API comme un outil via MCP.

Les outils de l'ère précédente — clients API, visualiseurs de spécifications, collections de requêtes — ont été conçus pour un humain au clavier. Powerduck est conçu pour cette ère. Ce n'est pas un meilleur client API, ni un plus joli visualiseur de spécifications. C'est une **plateforme native IA qui part d'un seul fichier OpenAPI**.

## Le cœur : un seul fichier OpenAPI local

Tout commence par un simple `openapi.yaml` dans votre dépôt : un fichier ouvert, versionné, lisible par les humains comme par l'IA. Pas de base de données propriétaire, pas de compte cloud requis.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Ce fichier unique est le contrat. Chaque flux de travail lit à partir de lui, et le même fichier peut être transmis via MCP à n'importe quel agent de programmation IA. Vous, l'assistant intégré et tout agent externe partagez ainsi une seule source de vérité. Quand la conception, le débogage, les tests, la simulation et la documentation lisent tous le même fichier, « garder les outils synchronisés » n'est plus une tâche : ce n'est pas un objectif, c'est une conséquence de la conception.

Powerduck prend en charge OpenAPI 3.2 et met à niveau à la volée les documents 3.0 / 3.1 existants (et Swagger 2.0). Les API autres qu'HTTP — SSE, WebSocket, GraphQL, gRPC, MCP — sont modélisées comme des entrées de chemin ordinaires via une extension `x-protocol`, sans conversion forcée en formes REST.

## Travailler avec l'IA

- Dès que vous ouvrez le YAML, l'assistant propose ce qu'il peut en faire.
- Décrivez le résultat en langage naturel — « crée le point de terminaison de commande », « prépare des données de test », « exécute le flux de paiement et fais un rapport » — et il choisit les bons outils et propose des modifications.
- Chaque modification arrive sous forme de **carte révisable**. Rien n'est appliqué avant votre approbation.
- Quand vous affinez une API, l'assistant reste sur cette API et ne modifie que ce que vous demandez, sans perturber le reste du document.
- Vous pouvez apporter **n'importe quel modèle compatible OpenAI**. Sur le bureau, les invites et les clés ne quittent jamais la machine.

## Local-first par défaut

Powerduck s'exécute sur votre machine, ouvre et enregistre de vrais fichiers, fonctionne hors ligne et garde vos clés API et vos invites hors du navigateur. Le cloud est une extension optionnelle pour le partage et la publication, pas un prérequis pour commencer.

## Trois façons d'utiliser Powerduck

| Forme | Ce que c'est | Quand l'utiliser |
|---|---|---|
| [**Client de bureau**](/docs/client/introduction) | Application Electron local-first avec assistant IA et espace de travail API complet | Les ingénieurs qui veulent tout garder sur leur machine, travailler hors ligne et conserver clés et invites en local |
| [**Powerduck Cloud**](/docs/cloud/introduction) | Service hébergé pour l'hébergement OAS, la documentation en ligne et le MCP géré | Pour partager des API, publier des liens stables et fournir du MCP sans rien exécuter |
| [**Bibliothèques open source**](/docs/opensource/) | Packages npm `@powerduck/*` combinables | Pour construire vos propres outils, pipelines CI ou composants intégrés |

Les trois formes partagent le même moteur. Le client de bureau et le cloud sont tous deux assemblés à partir des bibliothèques open source, donc les capacités se comportent de la même façon, que vous les exécutiez en local, les appeliez sur le réseau ou importiez les paquets directement.

### Client de bureau

Le [client de bureau](/docs/client/introduction) s'exécute entièrement sur votre machine. Il ouvre et édite de vrais fichiers sur le disque, envoie les requêtes via un processus local, exécute des simulations locales et garde les invites IA et les clés API hors de la console du navigateur. Les modèles sont librement configurables et les modifications proposées arrivent sous forme de cartes révisables avant application.

### Powerduck Cloud

[Powerduck Cloud](/docs/cloud/introduction) transporte le même flux de travail en ligne. Ajoutez un fichier, un dépôt Git ou une URL, choisissez les opérations à exposer, et vous obtenez des liens stables vers la documentation rendue et un point de terminaison MCP géré. L'accès peut être protégé par un mot de passe de consultation ou une clé d'accès MCP ; les plans payants ajoutent la synchronisation Git, les domaines personnalisés et des limites plus élevées.

### Bibliothèques open source

Les [bibliothèques](/docs/opensource/) sont le moteur sous-jacent : analyseur et surligneur OpenAPI, CLI multiprotocole, générateur de code, serveur MCP, exécuteur de requêtes, convertisseurs cURL / Postman et éditeurs intégrés. Chacun est publié indépendamment sur npm avec des guides d'installation dédiés et des références API. Les détails techniques de bas niveau vivent ici.

## Ce qui change pour vous

- **Vous décrivez le résultat, pas les clics.** Dites l'objectif et l'assistant progresse par étapes révisables.
- **Vos API sont prêtes pour les agents dès le départ.** Le même contrat qui génère la documentation génère aussi les outils MCP, afin que les agents IA appellent correctement votre API dès le premier jour.
- **Aucune dérive.** La conception, le débogage, les tests, la simulation et la documentation lisent un seul fichier.
- **Tous les protocoles au même endroit.** HTTP, SSE, WebSocket, GraphQL, gRPC et MCP dans une seule spécification, pas six outils.
- **Aucun verrouillage.** Apportez vos modèles, gardez vos clés en local sur le bureau et possédez le YAML en clair dans votre dépôt.

## Où aller ensuite

- Nouveau ici ? Commencez par [Installation](/docs/overview/installation) et [Démarrage rapide](/docs/overview/quickstart).
- Besoin de l'espace de travail local complet ? Lisez le [guide du client de bureau](/docs/client/introduction).
- Vous voulez publier votre API en ligne ? Lisez le [guide Cloud](/docs/cloud/introduction).
- Vous construisez votre propre intégration ? Voir les [bibliothèques open source](/docs/opensource/).

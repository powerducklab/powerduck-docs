---
sidebar_position: 5
title: Contrôle d'accès
description: "Protégez la documentation par mot de passe de consultation et durée de validité, le MCP par clé d'accès, et configurez l'authentification amont du serveur MCP. Comprenez chaque porte décidant de l'ouverture."
---

# Contrôle d'accès

Powerduck sépare **comment un lecteur accède à la documentation** et **comment un client accède au point de terminaison MCP**, car les modes de consommation diffèrent. Vous configurez aussi comment le serveur MCP s'authentifie auprès de l'API en amont.

## Chaque porte (dans l'ordre)

Plusieurs conditions décident de l'ouverture d'une surface publique ; connaître la liste complète répond au fréquent « pourquoi je n'arrive pas à ouvrir ma doc ? ».

1. **État du document** — doit être `ACTIVE` (ni pause, ni archivé, ni supprimé).
2. **Mode activé** — `documentationEnabled` pour la doc, `mcpEnabled` pour le MCP.
3. **Identifiants d'accès** — mot de passe de consultation pour la doc si configuré, clé d'accès pour le MCP.
4. **Durée de validité** — la consultation peut expirer à une heure donnée.

L'artefact publié derrière chaque mode est construit automatiquement après ajout de version ou changement d'exposition, donc la publication n'est généralement pas manuelle.

Chaque mode est indépendant : désactiver le MCP n'affecte pas la doc, et le mot de passe de doc ne protège pas le MCP.

## Mot de passe de consultation

Le mot de passe protège la documentation rendue et les données de spécification servies.

- Le mot de passe est haché en **scrypt** avec un sel aléatoire par mot de passe ; jamais stocké en clair.
- Une fois défini, le lecteur doit le saisir avant diffusion du document.
- Il est **propre à la documentation** : le point de terminaison MCP utilise sa propre clé et ignore le mot de passe de consultation.

Une **durée de validité** peut aussi être fixée ; après expiration, même le bon mot de passe est refusé. Supprimer mot de passe ou durée lève la restriction.

## Clé d'accès au point de terminaison MCP

Le point de terminaison MCP est protégé par sa propre **clé d'accès**.

- Créez (ou remplacez) une clé ; la clé complète n'est renvoyée qu'**une seule fois**, ensuite seuls les quatre derniers caractères s'affichent.
- Une fois configurée, chaque requête MCP doit la présenter comme jeton `Bearer`.
- Les clés fournies sont comparées à **temps constant**, et une absence/erreur renvoie `401`.

Supprimer la clé ouvre le point de terminaison si le document est actif et le MCP activé.

## Authentification MCP amont

Outre la protection du point de terminaison, configurez comment le serveur MCP s'authentifie auprès de l'**API en amont** décrite par la spécification. Types pris en charge :

| `authType` | Configuration |
|---|---|
| `NONE` | Pas d'authentification amont |
| `BEARER` | Jeton Bearer |
| `BASIC` | Nom d'utilisateur et mot de passe Basic |
| `APIKEY` | Nom de clé API (en-tête/query) et valeur |

Les secrets comme jeton Bearer, mot de passe Basic ou valeur de clé sont accessibles en écriture mais pas en lecture ; la configuration indique seulement s'ils sont définis.

Autres réglages MCP :

- **Remplacement d'URL de base** — écrase l'URL de base amont au lieu de la spécification.
- **Délai de requête** — utilisé par le serveur MCP lors des appels à l'API amont.

## Configuration recommandée

- **Documentation publique :** doc active, sans mot de passe pour une API ouverte, ou mot de passe + durée pour un partage contrôlé.
- **MCP pour vos propres agents :** activez le MCP et créez une clé d'accès pour que seuls vos clients appellent.
- **Authentification amont :** alignez l'authentification du serveur MCP sur les exigences réelles de l'API, indépendamment de qui peut appeler le point de terminaison.

Voir aussi : [Opérations exposées](./exposure)、[Documents et versions](./documents-versions)、[Domaines personnalisés](./custom-domains).

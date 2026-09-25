---
sidebar_position: 1
title: Powerduck Cloud
description: "Mettez votre spécification OpenAPI en ligne en quelques minutes. Publiez documentation rendue et point de terminaison MCP géré, choisissez ce qui est exposé, contrôlez qui y accède et partagez des liens stables, sans rien exécuter."
---

# Powerduck Cloud

Powerduck Cloud transforme un fichier OpenAPI en quelque chose de **partageable**. Ajoutez votre spécification, choisissez ce qui est exposé, puis transmettez des liens stables vers la documentation rendue et un serveur MCP géré. Pas besoin d'auto-héberger ou d'exécuter quoi que ce soit.

C'est le même flux contrat-d'abord et assisté par IA que le client de bureau, transporté en ligne pour les équipes et les consommateurs.

## Le parcours

1. **Ajoutez une spécification** — fichier, dépôt Git ou URL. Vous pouvez aussi démarrer le flux depuis le site web et se connecter quand prêt, sans re-téléverser.
2. **Choisissez ce qui est exposé.** Activez/désactivez les opérations individuellement ; le fichier d'origine ne change pas.
3. **Ouvrez le lien de documentation tout de suite** — la documentation rendue est activée par défaut. Le point de terminaison MCP géré reste éteint jusqu'à ce que vous décidiez d'exposer des outils aux agents : un simple interrupteur.
4. **Contrôlez l'accès.** Ajoutez mot de passe de consultation et durée de validité, et une clé d'accès MCP indépendante pour les agents.
5. **Publiez et partagez.** Publiez les artefacts prêts de la version courante : les liens se résolvent et les contrôles avancés sont à un clic.
6. **Restez à jour.** Chaque changement crée une nouvelle version pour comparer ou revenir en arrière, et les sources Git se synchronisent lors des mises à jour.
7. **Gérez le cycle de vie.** Mettez en pause, reprenez, archivez, et voyez état, version et source d'un coup d'œil.

## Ce que vous obtenez

- **Lien de documentation stable** — lisible après publication de nouvelles versions.
- **Point de terminaison MCP géré** — les agents IA d'autrui découvrent et appellent les opérations choisies.
- **Exposition par opération** — excluez les interfaces internes ou inachevées de la surface publique.
- **Contrôle d'accès** — mot de passe de consultation, durée de validité, clé d'accès MCP.
- **Historique des versions** — comparaison et retour arrière ; l'original n'est jamais écrasé.
- **Synchronisation Git** — reflète les mises à jour du dépôt comme nouvelles versions hébergées.
- **Domaines personnalisés** — expérience de marque incluant la configuration de sous-chemin.

### Un document, plusieurs versions

Chaque édition crée une nouvelle version au lieu d'écraser, permettant comparaison, retour arrière et régénération documentation/MCP pour un état précis. Documentation et MCP sont toujours liés à un document et une version précis, jamais à un « courant » ambigu.

### Pourquoi un lien peut ne pas s'ouvrir

Un lien documentation ou MCP se résout quand trois choses sont réunies, et l'espace de travail document montre chacune en surlignant la première exigence manquante.

1. Le document est **actif** — le mettre en pause coupe documentation et MCP ensemble.
2. Le mode à partager est **activé** — interrupteur distinct pour documentation et MCP (documentation activée par défaut, MCP éteint par défaut).
3. L'artefact courant est **publié** — construit automatiquement après ajout de version ou changement d'opérations exposées, donc généralement aucune action ; la publication manuelle sert de secours.

Les contrôles d'accès — mot de passe de consultation, durée de validité, clé d'accès MCP — s'appliquent par-dessus ces trois éléments.

## Connexion et appartenance

Connectez-vous avec **Google** ou **GitHub**. Après la poignée de main OAuth, Powerduck émet sa propre session dans un cookie HttpOnly sécurisé, et le jeton du fournisseur ne sert pas d'identité durable. Tout appartient à une **organisation** ; une organisation personnelle est créée automatiquement pour partager plus tard en équipe sans reconception.

## La console

- **Dashboard** — ajoutez des spécifications et voyez les documents récents avec liens rapides et actions démarrer/arrêter.
- **Projects** — organisez les documents.
- **Espace de travail document** — état, documentation, MCP, opérations exposées, versions, source, domaines en onglets clairs.
- **Billing** — garde l'état d'abonnement et les commandes séparément.
- **Hub** — publiez et explorez documents et serveurs MCP publics.
- **Settings** et **Activity** — profil, préférences, journal d'audit.

Les lecteurs publics utilisent un visualiseur dédié et n'ont pas besoin de compte si le document n'exige pas de mot de passe.

## Cloud versus client de bureau

| | Client de bureau | Cloud |
|---|---|---|
| Exécution | Votre machine | Hébergé |
| Modèle | Licence perpétuelle achat unique | Abonnement mensuel |
| Résultat | Clé de licence (affichée une fois) | Adhésion, pas de clé |
| Quand | Local, hors ligne, espace complet | Partage et publication en ligne |

Les deux se complètent et sont vendus séparément. Voir [Facturation](./billing).

## Commencez ici

- [Démarrage rapide Cloud](./quickstart)
- [Documents et versions](./documents-versions)
- [Opérations exposées](./exposure)
- [Contrôle d'accès](./access-control)
- [Domaines personnalisés](./custom-domains)
- [Facturation](./billing)

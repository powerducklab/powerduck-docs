---
sidebar_position: 4
title: Opérations exposées
description: "Choisissez les opérations à rendre publiques sans modifier le document d'origine. Groupez par tags, recherchez et commutez individuellement ou en lot."
---

# Opérations exposées

Toutes les opérations d'une spécification n'ont pas vocation à être publiques. Les interfaces d'administration, outils internes et brouillons doivent souvent rester dans la spécification tout en étant masqués de la documentation et du MCP publics. La configuration d'exposition rend ce choix explicite et **ne modifie pas le document d'origine**.

## Fonctionnement

La configuration d'exposition est stockée séparément de la spécification ; chaque entrée référence une opération et note si elle est active.

- L'`operationId` de l'opération est utilisé quand il existe.
- `method` et `path` sont aussi stockés pour les spécifications sans identifiant et pour la vérification.

Le fichier d'origine reste immuable. Documentation et MCP sont générés depuis la spécification et les opérations actives : désactiver une opération l'exclut de la surface publique sans la supprimer du fichier.

## L'espace d'exposition

Le mode opérations exposées est conçu pour les grandes spécifications.

- **Recherche** — réduisez les opérations par méthode, chemin, résumé ou tag.
- **Groupement par tags** — groupé par tag principal, sans tag = non classé.
- **Commutation individuelle** — activez/désactivez une opération unique.
- **Lot par groupe** — activez/désactivez toutes les opérations d'un groupe de tags à la fois.
- **Tout sélectionner (filtré)** — la case globale s'applique aux opérations correspondant à la recherche courante.

Chaque opération est une ligne et l'état actif reste clair même avec plusieurs tags.

## Valeurs par défaut pratiques

L'approche simple est de tout activer puis de désactiver ce que vous ne voulez pas public.

- Interfaces internes/administratives (gestion utilisateur ou bilans de santé internes).
- Opérations encore en conception.
- Interfaces réservées au débogage local.

Le choix est indépendant du fichier, donc ajustable au fil de l'évolution de l'API sans éditer la spécification elle-même.

## Interaction exposition / publication

L'exposition définit **quelles opérations apparaissent**, tandis que d'autres contrôles définissent **si le document est fondamentalement joignable**.

- Le document doit être `ACTIVE`.
- Chaque mode a son indicateur actif pour documentation et MCP.
- L'accès peut être protégé par mot de passe (documentation) ou clé d'accès (MCP).

Voir l'ensemble des portes dans [Contrôle d'accès](/docs/cloud/access-control).

## Limites de plan

Les plans limitent le nombre d'opérations exposées.

- **Free** — jusqu'à 10.
- **Pro** — jusqu'à 1 000.
- **Team** — jusqu'à 10 000.

Voir aussi : [Contrôle d'accès](/docs/cloud/access-control)、[Documents et versions](/docs/cloud/documents-versions).

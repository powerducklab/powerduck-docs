---
sidebar_position: 6
title: Modèle de données et diagramme ER
description: "Dérivez tables, clés étrangères, tables de relation plusieurs-à-plusieurs et SQL depuis l'API, comparez avec une base réelle et suivez l'impact via un diagramme ER visuel."
---

# Modèle de données et diagramme ER

Le mode modèle de données comble l'écart entre le contrat API et la base de données. Il dérive un modèle relationnel complet depuis les schémas OpenAPI, le compare avec une base existante et synchronise les deux quand l'un change — le tout dans un diagramme ER visuel.

Il y a deux points de départ, tous deux pris en charge.

- **Pas encore de tables.** Dérivez directement depuis les API courantes chaque table, champ, clé étrangère, table de relation et le SQL pour les créer.
- **Une base existe déjà.** Lisez les tables réelles et les clés étrangères appliquées, comparez avec le modèle implicite de l'API et voyez où ça correspond et diverge.

## La réconciliation en quatre couches

La réconciliation (`datamodel.reconcile`) renvoie une vue qui fait autorité sur quatre couches.

| Couche | Contenu |
|---|---|
| **Observed (observé)** | Tables orphelines de la base connectée, clés étrangères présentes/appliquées seulement en base |
| **Modeled (modélisé)** | État de chaque table (`missing`, `drift`, `matched`, `extra`), paires de champs modélisés/réels, différences au niveau champ, opérations API affectées, relations modélisées |
| **Proposed (proposé)** | Plan de migration additif ordonné avec dépendances `blockedBy` et SQL par étape |
| **Inferred (inféré)** | Tables de relation plusieurs-à-plusieurs déduites automatiquement, questions de clarification, garde-fous |

Le modèle fonde chaque table, champ, relation et assertion sur ce résultat et ne fabrique pas de DDL.

### États de table

- **Missing (manquante)** — implicite par l'API mais absente en base.
- **Drift (divergente)** — présente des deux côtés mais champs/contraintes différents.
- **Matched (conforme)** — présente et alignée.
- **Extra (supplémentaire)** — en base mais non implicite par l'API courante.

## Tables de relation et index déduits

Vous n'avez pas à modéliser les tables de jointure à la main. Quand les schémas impliquent un plusieurs-à-plusieurs — par exemple avec des ressources `user` et `product` — la couche **Inferred** ne s'arrête pas aux deux tables de base : elle dérive la table de relation qui les relie (et les index associés). Les index secondaires sont inclus dans le SQL généré.

Quand la logique métier ne peut pas être déduite clairement, le résultat pose une question de clarification au lieu de deviner, et les garde-fous marquent ce qui nécessite une revue humaine.

## Diagramme ER visuel

La vue ER rend le modèle sous forme de graphe pour montrer relations et clés étrangères d'un coup d'œil, pas à lire dans une liste de tables.

- Les tables sont des nœuds avec une mise en page automatique réduisant les croisements.
- Les relations de clé étrangère sont tracées comme liens.
- L'état des nœuds reflète l'état de réconciliation (manquante, divergente, conforme, supplémentaire).
- Un panneau latéral montre les étapes de migration concrètes — `create_table`, `alter_table`, points de revue — et le SQL de la table choisie.

Vous obtenez ainsi une vue macro du schéma et un chemin précis et ordonné pour aligner la base.

## Analyse d'impact bidirectionnelle

Le modèle connaît à la fois les opérations API et les tables, donc les changements se propagent visiblement.

- Quand l'**API change**, la réconciliation identifie les tables affectées — tables existantes divergentes et tables à ajouter — et produit le SQL correspondant.
- Quand la **base change**, les opérations touchant les tables affectées sont présentées comme éléments d'impact.

Dans les deux cas, après édition vous pouvez **actualiser et réconcilier à nouveau**, jusqu'à ce que modèle et base correspondent.

## Script de déploiement

Pour une base neuve, `datamodel.deploymentScript` génère un script SQL idempotent et à progression avant.

- `CREATE TABLE IF NOT EXISTS` dans l'ordre des clés étrangères.
- Index secondaires.
- Données d'exemple déterministes optionnelles (0–50 lignes, 0 par défaut) ; les tables de relation ne sont pas remplies.

Pour une base existante, utilisez la réconciliation qui produit des `ALTER` additifs via le plan de migration ordonné.

## Connexions base

Les connexions sont gérées via des profils enregistrés (id, nom, dialecte, hôte, port, utilisateur, base), et les mots de passe ne sont pas renvoyés. Dialectes pris en charge : **MySQL**, **SQL Server**, **Oracle**.

- `database.runSelect` exécute un `SELECT` en lecture seule via un profil enregistré et renvoie des lignes plafonnées ; écritures et DDL sont bloqués.
- `database.prefillConnection` ouvre une boîte de nouvelle connexion pré-remplie avec les détails fournis, pour que vous saisissiez le mot de passe vous-même au lieu de le passer dans l'invite.

## SQL généré, jamais auto-exécuté

Dans tout ce mode, le SQL est **généré pour revue**, pas exécuté contre la base. Vous décidez quand et comment l'appliquer, et l'accès en lecture seule protège les données réelles. Vous pouvez explorer et itérer sur le modèle en sécurité avant de toucher la base.

Voir aussi : [Protocoles](/docs/client/protocols)、[Espace de travail de requête](/docs/client/debug)、[Réglages](/docs/client/settings).

---
sidebar_position: 3
title: "Votre première requête locale, sans compte ni modèle d’IA"
description: "Votre première requête locale, sans compte ni modèle d’IA"
---

# Votre première requête locale, sans compte ni modèle d’IA

## Essayer l’exemple local

Dans un espace de travail vide de l’application de bureau, choisissez **Essayer l’exemple**, puis lancez l’exécution. Powerduck crée un exemple indépendant, démarre le serveur Mock local, envoie `GET /orders/summary` au port attribué et affiche la réponse réelle. L’exemple n’est marqué comme terminé qu’après une réponse HTTP 200. Le serveur Mock s’arrête après la requête ou à la fermeture de l’exemple. Vous pouvez relancer l’exemple à tout moment. Installez d’abord l’application : ce parcours local ne nécessite ni connexion Internet, ni compte, ni clé de modèle d’IA.

## Ouvrir votre propre spécification

Utilisez **Ouvrir** pour importer un document OpenAPI au format YAML ou JSON. L’exemple ne remplace jamais un fichier existant. La version gratuite limite le nombre de spécifications ouvertes. Si la limite est atteinte, enregistrez puis fermez ou retirez un document dont vous n’avez plus besoin. Ne perdez pas des modifications non enregistrées pour lancer l’exemple. Vous pouvez aussi générer une spécification OpenAPI à partir d’un projet existant ; vérifiez les champs incertains avant de vous fier au résultat.

## Vérifier un serveur réel

Une réponse correcte du serveur Mock ne prouve pas que votre serveur respecte la spécification. Suivez l’[exemple d’erreur de contrat](/docs/fr-FR/client/contract-example/), puis [connectez un assistant de programmation](/docs/fr-FR/client/coding-agent/) si vous le souhaitez. La validation manuelle ne nécessite aucun modèle d’IA.

## Modèles facultatifs et erreurs courantes

- **Aucun modèle configuré :** les requêtes locales, le serveur Mock et les vérifications manuelles fonctionnent quand même. Configurez un modèle dans les paramètres uniquement si vous souhaitez utiliser l’IA.
- **Échec de connexion au modèle :** vérifiez l’URL du service, la clé et le proxy dans les paramètres. Ne publiez jamais de clés ni d’en-têtes de requête dans un rapport de bug.
- **API inaccessible :** vérifiez que le serveur fonctionne, puis contrôlez l’URL, le port et les paramètres de la requête dans l’outil de débogage.
- **HTTP 401 ou 403 :** vérifiez l’authentification et les autorisations de l’API cible. Il ne s’agit pas d’une demande de connexion à Powerduck.
- **Échec de validation :** consultez le chemin du champ et le type attendu dans l’assertion. Corrigez le serveur ou une erreur dans la spécification, puis relancez la vérification.

Les fichiers locaux sont lus et enregistrés sur votre ordinateur. Les modèles distants reçoivent le contexte nécessaire ; la publication dans le cloud transmet le contenu sélectionné. Les statistiques d’utilisation facultatives sont désactivées par défaut dans les paramètres et sont indépendantes de la vérification de licence.

[Télécharger](https://www.powerduck.com/download.html) · [Licence de bureau](https://www.powerduck.com/pricing?product=client)

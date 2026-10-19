---
sidebar_position: 5
title: "Commandes CLI"
description: "Le paquet fournit un seul exécutable, openapi-cli. Il accepte directement une liste d’options ; il n’existe aucune sous-commande run / validate / init :"
---

# Commandes CLI

Le paquet fournit un seul exécutable, `openapi-cli`. Il accepte directement une liste d’options ; il n’existe **aucune** sous-commande `run` / `validate` / `init` :

```
openapi-cli [options]
```

## Syntaxe

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Une spécification est **obligatoire** : utilisez `--spec` (ou `-s`), ou renseignez `specPath` dans un fichier JSON chargé avec `--config`. Les autres options sont facultatives.

## Options principales

| Option | Forme courte | Valeur par défaut | Description |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Chemin ou URL `http(s)://` d’une spécification JSON OpenAPI 3.2 |
| `--server <url>` | `-S` | *(depuis la spécification)* | Remplacer l’URL du serveur définie dans la spécification |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Répertoire de sortie des rapports |
| `--format <formats>` | `-f` | `json,cli,html` | Formats de rapport séparés par des virgules : `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Chemin du fichier de configuration JSON ; les arguments CLI sont prioritaires |

## Options d’exécution

| Option | Forme courte | Valeur par défaut | Description |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Nombre maximal de requêtes simultanées ; entier de 1 à 100 |
| `--timeout <ms>` | `-t` | `30000` | Délai par requête en ms, entier de 1 à 600000 ; également utilisé pour récupérer une spécification distante |
| `--no-fail-on-error` | — | désactivé | Renvoyer `0` après une exécution terminée même si des tests échouent ; les erreurs de configuration et les erreurs fatales restent des échecs |

## Options de filtrage

| Option | Valeur par défaut | Description |
|--------|---------|-------------|
| `--method <methods>` | — | Méthodes HTTP à inclure, séparées par des virgules, par exemple `get,post` |
| `--path <patterns>` | — | Expressions régulières séparées par des virgules, comparées à chaque chemin |
| `--tag <tags>` | — | Étiquettes OpenAPI à inclure, séparées par des virgules |
| `--operation-id <ids>` | — | Valeurs `operationId` à inclure, séparées par des virgules |

## Options réseau et TLS

| Option | Forme courte | Valeur par défaut | Description |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | URL du proxy HTTP(S), par exemple `http://proxy.corp:8080` |
| `--ca <path>` | — | — | Ensemble de certificats CA au format PEM |
| `--cert <path>` | — | — | Certificat client PEM pour mTLS |
| `--key <path>` | — | — | Clé privée du client au format PEM pour mTLS |
| `--insecure` | `-k` | désactivé | Ignorer la vérification des certificats TLS |

## Authentification, en-têtes et variables

| Option | Forme courte | Description |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | En-têtes supplémentaires au format `Key: Value` ; option répétable |
| `--bearer <token>` | — | Jeton Bearer envoyé dans l’en-tête `Authorization` |
| `--variable <vars...>` | `-v` | Variables Postman au format `KEY=VALUE` ; option répétable |
| `--env <path>` | — | Chemin du fichier `.env` ; ne remplace pas les variables d’environnement existantes |

## Options gRPC

| Option | Valeur par défaut | Description |
|--------|---------|-------------|
| `--grpc-no-reflection` | désactivé | Désactiver la réflexion du serveur gRPC et utiliser des fichiers proto |
| `--grpc-proto <paths...>` | — | Chemins des fichiers `.proto` ou des répertoires qui les contiennent |

## Options MCP

| Option | Valeur par défaut | Description |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | Transport MCP : `streamable-http` ou `stdio` |
| `--mcp-command <command>` | — | Commande MCP stdio, par exemple `npx` |
| `--mcp-args <args>` | — | Arguments MCP stdio séparés par des espaces ou des virgules |
| `--mcp-cwd <dir>` | — | Répertoire de travail du sous-processus MCP stdio |

## Options d’information

| Option | Forme courte | Description |
|--------|-------|-------------|
| `--help` | `-h` | Afficher l’aide |
| `--version` | `-V` | Afficher la version |

## Codes de sortie

| Code | Signification |
|------|---------|
| `0` | Tous les tests ont réussi, ou `--no-fail-on-error` a été activé |
| `1` | Au moins un test a échoué ou rencontré une erreur, ou l’analyse des arguments CLI a échoué |
| `2` | Erreur de configuration, échec du chargement de la spécification ou erreur fatale d’exécution |

La CLI affiche `Error:` en rouge et se termine avec `2` si `resolveConfig` lève une exception, par exemple lorsque ni `--spec` ni un `specPath` configuré ne sont fournis. Elle affiche `Fatal error:` et se termine avec `2` si `runTests` lève une exception. Après une exécution menée à terme, elle renvoie `1` uniquement si `report.summary.failed > 0 || report.summary.errors > 0` et `failOnError !== false`.

## Variables d’environnement

Il n’existe pas de variables dédiées `OPENAPI_CLI_*`. La configuration provient des options, du fichier de configuration et des mécanismes suivants :

- **Fichier `.env`** — passez `--env .env` pour charger les paires `KEY=VALUE` dans `process.env`. Les variables existantes ne sont pas remplacées.
- **Expansion de `${VAR}`** — après le chargement, `${VAR_NAME}` est remplacé dans `serverUrl`, `proxy`, les valeurs de `headers`, `auth.token` et les valeurs de `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Exemples d’exécution

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```

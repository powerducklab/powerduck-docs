---
sidebar_position: 6
title: "Configuration"
description: "La priorité de résolution est arguments CLI > fichier de configuration > valeurs par défaut. Le résultat est l’objet CliConfig renvoyé par resolveConfig."
---

# Configuration

La priorité de résolution est **arguments CLI > fichier de configuration > valeurs par défaut**. Le résultat est l’objet `CliConfig` renvoyé par [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

Type de configuration central. Tous les champs sauf `specPath` sont facultatifs.

| Champ | Type | Valeur par défaut | Description |
|-------|------|---------|-------------|
| `specPath` | `string` | **obligatoire** | Chemin ou URL `http(s)://` de la spécification JSON OpenAPI 3.2 |
| `serverUrl` | `string` | *(depuis la spécification)* | Remplacer l’URL de base du serveur définie dans la spécification |
| `outputDir` | `string` | `"./openapi-cli-report"` | Répertoire des fichiers de rapport |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Formats de rapport à générer |
| `filter` | `FilterConfig` | `undefined` | Filtrer les opérations à tester |
| `concurrency` | `number` | `5` | Nombre maximal de requêtes simultanées ; entier de 1 à 100 |
| `timeout` | `number` | `30000` | Délai par requête en ms, entier de 1 à 600000 ; s’applique aussi au chargement d’une spécification distante |
| `proxy` | `string` | `undefined` | URL du proxy HTTP(S), par exemple `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Configuration TLS et des certificats |
| `headers` | `Record<string, string>` | `undefined` | En-têtes supplémentaires envoyés avec chaque requête |
| `auth` | `AuthConfig` | `undefined` | Configuration de l’authentification |
| `variables` | `Record<string, string>` | `undefined` | Variables Postman `{{name}}` à injecter |
| `failOnError` | `boolean` | `true` | CLI uniquement : renvoyer un code non nul après un échec de test ; les appels à la bibliothèque doivent examiner le rapport |
| `envFile` | `string` | `undefined` | Chemin d’un fichier `.env`, avec une paire `KEY=VALUE` par ligne |
| `grpcReflection` | `boolean` | automatique | gRPC : priorité à la configuration explicite, puis à l’extension de l’opération ; sinon activée en l’absence de chemins proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC : chemins des fichiers `.proto` ou de leurs répertoires |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP : transport des opérations MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio : commande à lancer |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio : arguments de la commande |
| `mcpCwd` | `string` | `undefined` | MCP stdio : répertoire de travail |

`ReportFormat` est l’union `"json" | "cli" | "html"`.

## Options avancées d’exécution

Les champs suivants font aussi partie de `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` et `maxResponseSize` peuvent figurer dans un fichier JSON. Après résolution de la configuration, passez `signal`, `httpRuntime` et `resolveTransport` directement à `runTests()` dans le code : ce sont des objets d’exécution, pas une configuration JSON.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` contrôle les redirections HTTP, les cookies et le choix du protocole. Pour HTTP/SSE, `maxEvents` vaut 50 par défaut et `maxStreamMs` reprend `timeout` s’il n’est pas défini ; `maxResponseSize` est transmis au moteur de requêtes. gRPC utilise `maxStreamMs` comme délai du flux, puis `timeout`, puis 30000 ms en dernier recours. `signal` annule l’exécution ; `httpRuntime` fournit la gestion HTTP des certificats et fichiers ; `resolveTransport` résout les paramètres de transport pour chaque cible.

## DEFAULT_CONFIG

Objet des valeurs par défaut intégré et exporté par la bibliothèque :

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| Champ | Type | Description |
|-------|------|-------------|
| `methods` | `string[]` | Tester uniquement ces méthodes HTTP, par exemple `["get","post"]` ; utilisez des minuscules dans les fichiers, l’entrée CLI étant normalisée |
| `paths` | `string[]` | Tester uniquement les chemins correspondant à l’une de ces expressions régulières ; recherche par sous-chaîne si l’expression est invalide |
| `tags` | `string[]` | Tester uniquement les opérations portant au moins une de ces étiquettes |
| `operationIds` | `string[]` | Tester uniquement les valeurs exactes de `operationId` indiquées |

Un filtre sans aucune clé devient `undefined` : toutes les opérations s’exécutent.

## TlsConfig

| Champ | Type | Description |
|-------|------|-------------|
| `caCert` | `string` | Chemin d’un ensemble de certificats CA au format PEM |
| `clientCert` | `string` | Chemin d’un certificat client PEM pour mTLS |
| `clientKey` | `string` | Chemin d’une clé privée client PEM pour mTLS |
| `strictSSL` | `boolean` | Ignorer la vérification des certificats TLS lorsque la valeur est `false` ; non sécurisé |
| `pfx` | `string` | Chemin d’un ensemble de certificats PFX ; gRPC exige plutôt le format PEM |
| `passphrase` | `string` | Phrase secrète des éléments de certificat chiffrés |

> Remarque : l’option CLI `--insecure` correspond à `tls.strictSSL = false`, ce qui **désactive** la vérification.

## AuthConfig

| Champ | Type | Description |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Mécanisme d’authentification ; noms pris en charge ci-dessous |
| `parameters` | `Record<string, string \| number \| boolean>` | Paramètres propres au mécanisme, transmis au moteur de requêtes |
| `token` | `string` | Jeton Bearer pour `type: "bearer"` |
| `username` | `string` | Nom d’utilisateur pour `type: "basic"` |
| `password` | `string` | Mot de passe pour `type: "basic"` |
| `key` | `string` | Nom de la clé API pour `type: "apikey"` |
| `value` | `string` | Valeur de la clé API pour `type: "apikey"` |
| `in` | `"header" \| "query"` | Emplacement de la clé API |

Les valeurs de `type` prises en charge sont `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` et `edgegrid`. La disponibilité et les paramètres requis dépendent du protocole et du moteur de requêtes ; indiquer un nom ne suffit pas à configurer l’authentification.

L’option CLI `--bearer` produit actuellement uniquement `{ type: "bearer", token }`. Les configurations `basic` / `apikey` plus détaillées se fournissent dans un fichier de configuration.

## Fichier de configuration JSON

Le fichier est du JSON conforme à `Partial<CliConfig>`. Passez-le avec `--config <path>` / `-c`. Les arguments CLI ont toujours priorité sur les valeurs du fichier.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

Un fichier absent provoque `Config file not found: <path>` ; un JSON invalide provoque `Invalid config file (must be JSON)`.

## Expansion des variables d’environnement

Après le chargement d’un fichier `.env` via `--env` / `envFile`, les références `${VAR_NAME}` sont développées dans ces champs textuels :

- `serverUrl`
- `proxy`
- Valeurs de `headers`
- `auth.token`
- Valeurs de `variables`

Exemple :

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Comportement de `.env` : les entrées existantes de `process.env` ne sont **pas** remplacées ; les guillemets simples ou doubles entourant les valeurs sont retirés ; les lignes vides et les commentaires `#` sont ignorés ; un fichier absent est ignoré silencieusement.

## Construction dans le code

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` lève `"No OpenAPI spec path provided..."` si aucune spécification n’est fournie, et `Invalid proxy URL: <url>` si `proxy` n’est pas une URL valide.

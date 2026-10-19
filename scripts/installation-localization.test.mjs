import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const locales = JSON.parse(fs.readFileSync(new URL('src/data/locales.json', root)));
const packages = ['tree', 'schema-editor', 'workspace-yaml', 'oas-document', 'openapi-parser'];
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const fences = text => [...text.matchAll(/^```[^\n]*\n[\s\S]*?^```/gm)].map(match => match[0]);
const identifiers = text => [...text.matchAll(/`[^`\n]+`/g)].map(match => match[0]).sort();

test('all 75 translated installation guides preserve executable examples and API identifiers', () => {
  for (const packageName of packages) {
    const source = read(`docs/${packageName}/installation.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const label = `${locale.docs}/${packageName}`;
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${packageName}/installation.md`);
      assert.deepEqual(fences(translated), fences(source), `${label}: code blocks changed`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${label}: identifiers changed`);
      assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, `${label}: missing table rows`);
      assert.match(translated, /^description: "[^\n]+"$/m, `${label}: missing SEO description`);
      assert.notEqual(translated.split('---').slice(2).join('---').trim(), source.split('---').slice(2).join('---').trim(), `${label}: English body copied`);
      if (packageName === 'openapi-parser') {
        assert.match(translated, /22\.12\.0/);
        assert.doesNotMatch(translated, /Node\.js 18/);
      }
    }
  }
});

test('six new overview translations retain examples and link to equivalent documentation routes', () => {
  const source = read('docs/overview/introduction.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
  const sourceRoutes = links(source).map(link => path.posix.normalize('overview/' + link).replace(/\.md$/, '/').replace(/\/index\/$/, '/')).sort();
  for (const locale of ['it-IT', 'ru-RU', 'hi-IN', 'id-ID', 'vi-VN', 'tr-TR']) {
    const translated = read(`i18n/${locale}/docusaurus-plugin-content-docs/current/overview/introduction.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale}: changed example`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale}: changed API identifier`);
    const targetRoutes = links(translated).map(link => link.replace(`/docs/${locale}/`, '')).sort();
    assert.deepEqual(targetRoutes, sourceRoutes, `${locale}: changed destination`);
  }
});

test('all 195 localized quickstarts and examples preserve code, identifiers, and document structure', () => {
  const articles = [
    'workspace-yaml/quickstart', 'openapi-parser/quickstart', 'schema-editor/quickstart',
    'oas-document/quickstart', 'schema-editor/examples', 'openapi-parser/examples',
    'tree/quickstart', 'workspace-yaml/examples', 'oas-document/examples', 'tree/examples', 'openapi-codegen/examples', 'openapi-mcp-server/examples', 'conf-patch/examples',
  ];
  for (const article of articles) {
    const source = read(`docs/${article}.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const label = `${locale.docs}/${article}`;
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${article}.md`);
      assert.deepEqual(fences(translated), fences(source), `${label}: executable example changed`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${label}: API identifier changed`);
      assert.equal((translated.match(/^#{1,6} /gm) || []).length, (source.match(/^#{1,6} /gm) || []).length, `${label}: section omitted`);
      assert.equal((translated.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length, `${label}: list item omitted`);
      assert.match(translated, /^description: "[^\n]+"$/m, `${label}: missing description`);
      assert.notEqual(translated.match(/^description: .*$/m)?.[0], source.match(/^description: .*$/m)?.[0], `${label}: English description`);
    }
  }
});

test('all five package introductions retain package metadata, feature lists, and equivalent links', () => {
  for (const name of ['workspace-yaml', 'schema-editor', 'oas-document', 'openapi-parser', 'tree']) {
    const source = read(`docs/${name}/introduction.md`);
    const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/introduction.md`);
      const label = `${locale.docs}/${name}`;
      assert.deepEqual(identifiers(translated), identifiers(source), `${label}: identifier lost`);
      assert.equal((translated.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length, `${label}: list item omitted`);
      const destinations = links(source).map(link => link.startsWith('./') ? `/docs/${locale.docs}/${name}/${link.slice(2).replace(/\.md$/, '/')}` : link);
      assert.deepEqual(links(translated), destinations, `${label}: wrong destination`);
      assert.match(translated, /https:\/\/img.shields.io\/npm\/v\/@powerduck\//);
    }
  }
});

test('all seven package API tables retain every property, type, default, and export', () => {
 for (const name of ['schema-editor', 'workspace-yaml', 'openapi-parser', 'oas-document', 'tree', 'openapi-codegen', 'openapi-mcp-server']) {
  const source = read(`docs/${name}/api-reference.md`);
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/api-reference.md`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: API signature changed`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: example changed`);
    assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, `${locale.docs}: table row lost`);
  }
 }
});

test('new client workflows preserve commands, contract examples, and ordered steps', () => {
  for (const name of ['code-to-openapi', 'contract-example', 'coding-agent']) {
    const source = read(`docs/client/${name}.md`);
    for (const locale of locales.filter(locale => !['en', 'ja-JP', 'zh-CN'].includes(locale.docs))) {
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/client/${name}.md`);
      const label = `${locale.docs}/client/${name}`;
      assert.deepEqual(fences(translated), fences(source), `${label}: example changed`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${label}: parameter changed`);
      assert.equal((translated.match(/^\d+\. /gm) || []).length, (source.match(/^\d+\. /gm) || []).length, `${label}: step omitted`);
      assert.ok(translated.includes(`/docs/${locale.docs}/overview/quickstart/`));
      if (name !== 'code-to-openapi') assert.match(translated, /22\.12\.0/);
    }
  }
});

test('CLI, MCP, codegen, and converter installation translations preserve commands and current runtime requirements', () => {
  for (const name of ['openapi-cli', 'openapi-mcp-server', 'openapi-codegen', 'x-to-openapi']) {
    const source = read(`docs/${name}/installation.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/installation.md`);
      assert.deepEqual(fences(text), fences(source), `${locale.docs}/${name}: command changed`);
      assert.deepEqual(identifiers(text), identifiers(source), `${locale.docs}/${name}: identifier changed`);
      assert.match(text, /22\.12\.0/);
      assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length);
      if (name === 'openapi-mcp-server') {
        assert.doesNotMatch(text, /npx openapi-mcp --help/);
        assert.match(text, /npx --package @powerduck\/openapi-mcp-server openapi-mcp --help/);
      }
    }
  }
});

test('six added mock guides retain all runtime controls and table rows', () => {
  const source = read('docs/client/mock-server.md');
  for (const locale of ['it-IT', 'ru-RU', 'hi-IN', 'id-ID', 'vi-VN', 'tr-TR']) {
    const text = read(`i18n/${locale}/docusaurus-plugin-content-docs/current/client/mock-server.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length);
    assert.equal((text.match(/^- /gm) || []).length, 4);
  }
});

test('codegen and MCP quickstarts retain every executable example and API identifier in all languages', () => {
  for (const name of ['openapi-codegen', 'openapi-mcp-server']) {
    const source = read(`docs/${name}/quickstart.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/quickstart.md`);
      const label = `${locale.docs}/${name}/quickstart`;
      assert.deepEqual(fences(translated), fences(source), `${label}: example changed`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${label}: API identifier missing`);
      assert.equal((translated.match(/^## \d\./gm) || []).length, 5, `${label}: workflow step missing`);
    }
  }
});

test('six added Cloud guides preserve access controls, DNS records and workflow steps', () => {
  for (const name of ['quickstart', 'exposure', 'custom-domains', 'documents-versions', 'access-control']) {
    const source = read(`docs/cloud/${name}.md`);
    for (const language of ['it-IT', 'ru-RU', 'hi-IN', 'id-ID', 'vi-VN', 'tr-TR']) {
      const translated = read(`i18n/${language}/docusaurus-plugin-content-docs/current/cloud/${name}.md`);
      const label = `${language}/cloud/${name}`;
      assert.deepEqual(fences(translated), fences(source), `${label}: technical example changed`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${label}: identifier lost`);
      for (const pattern of [/^- /gm, /^\d\. /gm, /^\|/gm]) {
        assert.equal((translated.match(pattern) || []).length, (source.match(pattern) || []).length, `${label}: list/table omission`);
      }
    }
  }
});

test('Markdown editor installation translations preserve exports, peer dependencies and stylesheet instructions', () => {
  const source = read('docs/md-editor/installation.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/md-editor/installation.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: example changed`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: package contract changed`);
    assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length);
  }
});

test('CLI quickstarts preserve assertions, report APIs and CI exit codes', () => {
  const source = read('docs/openapi-cli/quickstart.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-cli/quickstart.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: example changed`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: API contract changed`);
    assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length);
  }
});

test('protocol request installation translations preserve optional dependencies and subpath APIs', () => {
  const source = read('docs/openapi-request/installation.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-request/installation.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: install command changed`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: export or dependency lost`);
    assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length);
  }
});

test('configuration patch installations preserve browser-safe imports and module entry contracts', () => {
  const source = read('docs/conf-patch/installation.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/conf-patch/installation.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: command changed`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: import contract changed`);
    assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length);
  }
});

test('editor, request, patch and converter quickstarts preserve all examples and public API identifiers', () => {
  for (const name of ['md-editor', 'openapi-request', 'conf-patch', 'x-to-openapi']) {
    const source = read(`docs/${name}/quickstart.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/quickstart.md`);
      assert.deepEqual(fences(translated), fences(source), `${locale.docs}/${name}: example changed`);
      assert.deepEqual([...new Set(identifiers(translated))], [...new Set(identifiers(source))], `${locale.docs}/${name}: API omitted`);
      assert.equal((translated.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length);
    }
  }
});

test('codegen configuration translations retain every option, interface and resolution step', () => {
  const source = read('docs/openapi-codegen/configuration.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-codegen/configuration.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: interface changed`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: option or contract missing`);
    for (const pattern of [/^\|/gm, /^- /gm, /^\d\. /gm]) {
      assert.equal((translated.match(pattern) || []).length, (source.match(pattern) || []).length);
    }
  }
});

test('codegen introductions preserve supported features and generator contracts', () => {
  const source = read('docs/openapi-codegen/introduction.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-codegen/introduction.md`);
    assert.deepEqual(fences(translated), fences(source), `${locale.docs}: example changed`);
    assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}: identifier lost`);
    assert.equal((translated.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length);
    assert.equal((translated.match(/^\d\. /gm) || []).length, 2);
  }
});


test('MCP introductions retain transport controls, exports, examples and navigation in all locales', () => {
  const source = read('docs/openapi-mcp-server/introduction.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-mcp-server/introduction.md`);
    assert.deepEqual(fences(translated), fences(source), locale.docs);
    assert.deepEqual(identifiers(translated), identifiers(source), locale.docs);
    assert.deepEqual(links(translated), links(source), locale.docs);
    assert.equal((translated.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length, locale.docs);
    assert.match(translated, /^description: "[^\n]+"$/m);
  }
});


test('MCP configuration translations preserve every transport limit and security option', () => {
 const source = read('docs/openapi-mcp-server/configuration.md');
 for (const locale of locales.filter(locale => locale.docs !== 'en')) {
  const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-mcp-server/configuration.md`);
  assert.deepEqual(identifiers(translated), identifiers(source), locale.docs);
  assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
  // Type and default columns are contracts; descriptions and required markers are localized.
  assert.match(translated, /sessionIdleMs.*600000/);
  assert.match(translated, /maxSessions.*64/);
 }
});

test('open-source overviews preserve all packages and routes without stale latest-version claims', () => {
 const source = read('docs/opensource/index.md');
 const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match=>match[1]);
 for (const locale of locales.filter(locale => locale.docs !== 'en')) {
  const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/opensource/index.md`);
  assert.deepEqual(identifiers(translated), identifiers(source), locale.docs);
  assert.deepEqual(links(translated), links(source), locale.docs);
  assert.equal((translated.match(/^\|/gm)||[]).length, 18, locale.docs);
  assert.doesNotMatch(translated, /\|\s*\d+\.\d+\.\d+\s*\|/);
  assert.match(translated, /^description: "[^\n]+"$/m);
 }
});

test('patch and converter introductions retain complete API contracts and executable examples', () => {
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
  for (const name of ['conf-patch', 'x-to-openapi']) {
    const source = read(`docs/${name}/introduction.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/introduction.md`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}/${name}`);
      assert.deepEqual(links(translated).sort(), links(source).sort(), `${locale.docs}/${name}`);
      const sourceCode = fences(source), translatedCode = fences(translated);
      // The converter's first fence is a localized flow diagram, not executable code.
      assert.deepEqual(name === 'x-to-openapi' ? translatedCode.slice(1) : translatedCode,
        name === 'x-to-openapi' ? sourceCode.slice(1) : sourceCode, `${locale.docs}/${name}`);
      for (const pattern of [/^\|/gm, /^- /gm, /^\d\. /gm]) {
        assert.equal((translated.match(pattern) || []).length, (source.match(pattern) || []).length, `${locale.docs}/${name}`);
      }
    }
  }
});

test('configuration file validation examples point inside their allowed root in every locale', () => {
  for (const prefix of ['docs', ...locales.filter(locale => locale.docs !== 'en').map(locale => `i18n/${locale.docs}/docusaurus-plugin-content-docs/current`)]) {
    const text = read(`${prefix}/conf-patch/examples.md`);
    assert.match(text, /validateOpenAPIFile\("\.\/configs\/openapi\.yaml",\s*\{\s*allowedRootDirectory: "\.\/configs"/);
    assert.doesNotMatch(text, /validateOpenAPIFile\("\.\/openapi\.yaml",\s*\{\s*allowedRootDirectory: "\.\/configs"/);
  }
});

test('configuration patch API translations preserve signatures, defaults and error codes', () => {
  const source = read('docs/conf-patch/api-reference.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/conf-patch/api-reference.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.match(text, /^description: "[^\n]+"$/m);
    assert.doesNotMatch(text, /v0\.3\.4/);
  }
});

test('request and CLI introductions preserve runnable examples and protocol contracts', () => {
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const name of ['openapi-request', 'openapi-cli']) {
    const source = read(`docs/${name}/introduction.md`);
    for (const locale of locales.filter(locale => locale.docs !== 'en')) {
      const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/${name}/introduction.md`);
      assert.deepEqual(fences(translated), fences(source), `${locale.docs}/${name}`);
      assert.deepEqual(identifiers(translated), identifiers(source), `${locale.docs}/${name}`);
      assert.deepEqual(links(translated), links(source), `${locale.docs}/${name}`);
      for (const pattern of [/^\|/gm, /^- /gm]) {
        assert.equal((translated.match(pattern) || []).length, (source.match(pattern) || []).length, `${locale.docs}/${name}`);
      }
      assert.match(translated, /^description: "[^\n]+"$/m);
    }
  }
});

test('CLI command references preserve flags, bounds and exit codes in every language', () => {
  const source = read('docs/openapi-cli/commands.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const translated = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-cli/commands.md`);
    assert.deepEqual(fences(translated), fences(source), locale.docs);
    assert.deepEqual(identifiers(translated), identifiers(source), locale.docs);
    assert.equal((translated.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.match(translated, /100/);
    assert.match(translated, /600000/);
    assert.match(translated, /`specPath`/);
    assert.match(translated, /^description: "[^\n]+"$/m);
  }
});

test('CLI examples preserve corrected filters and a Node 22 CI workflow across languages', () => {
  const source = read('docs/openapi-cli/examples.md');
  for (const prefix of ['docs', ...locales.filter(locale => locale.docs !== 'en').map(locale => `i18n/${locale.docs}/docusaurus-plugin-content-docs/current`)]) {
    const text = read(`${prefix}/openapi-cli/examples.md`);
    assert.deepEqual(fences(text), fences(source), prefix);
    assert.deepEqual(identifiers(text), identifiers(source), prefix);
    assert.match(text, /node-version: 22/);
    assert.match(text, /--bearer "\$BEARER_TOKEN"/);
    assert.match(text, /method: "get,post"/);
    assert.doesNotMatch(text, /filter: \{/);
  }
});

test('CLI configuration translations retain advanced runtime and authentication fields', () => {
  const source = read('docs/openapi-cli/configuration.md');
  for (const prefix of ['docs', ...locales.filter(locale => locale.docs !== 'en').map(locale => `i18n/${locale.docs}/docusaurus-plugin-content-docs/current`)]) {
    const text = read(`${prefix}/openapi-cli/configuration.md`);
    assert.deepEqual(fences(text), fences(source), prefix);
    assert.deepEqual(identifiers(text), identifiers(source), prefix);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, prefix);
    assert.match(text, /resolveTransport\?:/);
    assert.match(text, /\| `pfx` \|/);
    assert.match(text, /\| `parameters` \|/);
    assert.match(text, /method: "get"/);
    assert.doesNotMatch(text, /filter: \{ methods:/);
  }
});

test('CLI API references retain scenario contracts and public helper signatures in every locale', () => {
  const source = read('docs/openapi-cli/api-reference.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const prefix of ['docs', ...locales.filter(locale => locale.docs !== 'en').map(locale => `i18n/${locale.docs}/docusaurus-plugin-content-docs/current`)]) {
    const text = read(`${prefix}/openapi-cli/api-reference.md`);
    assert.deepEqual(fences(text), fences(source), prefix);
    assert.deepEqual(identifiers(text), identifiers(source), prefix);
    assert.deepEqual(links(text), links(source), prefix);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, prefix);
    for (const name of ['runScenario', 'resolveSteps', 'applyExtracts', 'stepRef', 'collectOperations', 'executeStep', 'buildSummary', 'formatAssertionError', 'buildImplicitAssertions']) {
      assert.ok(text.includes('`' + name + '`'), `${prefix}: ${name}`);
    }
    assert.match(text, /\{#implicit-assertions\}/);
    assert.match(text, /import type \{ RequestValues \} from "@powerduck\/openapi-request"/);
    assert.doesNotMatch(text, /v0\.2\.3/);
  }
});

test('Markdown editor introductions preserve integration contracts and documentation links', () => {
  const source = read('docs/md-editor/introduction.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/md-editor/introduction.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length, locale.docs);
    assert.match(text, /Renderer\.render/);
    assert.match(text, /Renderer\.hydrate/);
    assert.match(text, /CORS/);
    assert.match(text, /^description: "[^\n]+"$/m);
  }
});

test('Markdown editor configuration translations preserve nested code spans and renderer options', () => {
  const source = read('docs/md-editor/configuration.md');
  const spans = text => [...text.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '').matchAll(/(`+)([^\n]*?)\1(?!`)/g)].map(match => match[0]).sort();
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const prefix of ['docs', ...locales.filter(locale => locale.docs !== 'en').map(locale => `i18n/${locale.docs}/docusaurus-plugin-content-docs/current`)]) {
    const text = read(`${prefix}/md-editor/configuration.md`);
    assert.deepEqual(fences(text), fences(source), prefix);
    assert.deepEqual(spans(text), spans(source), prefix);
    assert.deepEqual(links(text), links(source), prefix);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, prefix);
    assert.match(text, /theme\?: 'light' \| 'dark'/);
    assert.match(text, /`Renderer\.render`/);
  }
});

test('Markdown feature translations preserve nested fences, inline syntax and toolbar anchors', () => {
  const blocks = text => {
    const result = []; let current = null; let marker = '';
    for (const line of text.split('\n')) {
      const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (!current && match && !(match[1][0] === '`' && match[2].includes('`'))) {
        marker = match[1]; current = [line];
      } else if (current) {
        current.push(line);
        if (match && match[1][0] === marker[0] && match[1].length >= marker.length && !match[2].trim()) {
          result.push(current.join('\n')); current = null;
        }
      }
    }
    assert.equal(current, null, 'unclosed code fence'); return result;
  };
  const source = read('docs/md-editor/features.md');
  const spans = text => [...text.matchAll(/(`+)([^\n]*?)\1(?!`)/g)].map(match => match[0]).sort();
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/md-editor/features.md`);
    assert.deepEqual(blocks(text), blocks(source), locale.docs);
    assert.deepEqual(spans(text), spans(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.match(text, /\{#toolbar-actions\}/);
    assert.match(text, /800/);
  }
});

test('Markdown editor examples keep executable snippets and stable feature links across locales', () => {
  const source = read('docs/md-editor/examples.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/md-editor/examples.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.match(text, /\.\/features\.md#toolbar-actions/);
    assert.match(text, /Actions retain the built-in toolbar order/);
    assert.doesNotMatch(text, /Only these actions appear, in this order/);
    assert.equal((text.match(/^## /gm) || []).length, 8, locale.docs);
  }
});

test('Markdown API translations preserve public signatures and renderer theme behavior', () => {
  const source = read('docs/md-editor/api-reference.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/md-editor/api-reference.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    for (const signature of ['interface StatusBarState', 'interface StatusBarCallbacks', 'interface DebouncedFn', 'theme?: \'light\' | \'dark\'']) assert.ok(text.includes(signature), locale.docs + ': ' + signature);
    assert.match(text, /`Renderer\.render`/);
    assert.match(text, /max\(0, docLength\)/);
  }
});

test('request saving translations retain protocol downloads, private-state boundaries and locale links', () => {
  const source = read('docs/client/request-saving-and-examples.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/client/request-saving-and-examples.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.match(text, /\.\/a2a\.md/);
    assert.match(text, /3\.2\.0/);
    assert.match(text, /50051/);
  }
});

test('request configuration translations preserve executable contracts and complete option tables', () => {
  const source = read('docs/openapi-request/configuration.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-request/configuration.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.doesNotMatch(text, /mergeExamples|preserveOriginalBody|protocol: "mcp"|transport: "http"/);
    assert.match(text, /kind: "mcp"/);
    assert.match(text, /`scripts\.fromSpecExtensions: false`/);
  }
});

test('request examples retain current protocol signatures in every language', () => {
  const source = read('docs/openapi-request/examples.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-request/examples.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.doesNotMatch(text, /mergeExamples|parser\.stream\(|session\.subscribe\(|protocol: "mcp"|transport: "http"/);
    assert.match(text, /await probeStreamingResponse\(/);
    assert.match(text, /subscription\.unsubscribe\(\)/);
    assert.match(text, /method: "tools\/call"/);
    assert.equal(fences(text).length, 12, locale.docs);
  }
});

test('request API references retain corrected session and subpath contracts in every language', () => {
  const source = read('docs/openapi-request/api-reference.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/openapi-request/api-reference.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.doesNotMatch(text, /v0\.2\.4|mergeExamples|options\.protocol|session\.subscribe|const debugger =/);
    for (const name of ['initializeSession','initializeMcpSession','describeFromCatalog','overwriteExamples','onEvent']) assert.ok(text.includes(name), locale.docs + ': ' + name);
  }
});

test('converter examples retain verified path inference and honest input limits across locales', () => {
  const source = read('docs/x-to-openapi/examples.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/x-to-openapi/examples.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal(fences(text).length, 10, locale.docs);
    assert.match(text, /users\/123\/posts\/abc12345/);
    assert.match(text, /users\/456\/posts\/def45678/);
    assert.match(text, /10 × 1024 × 1024/);
    assert.match(text, /useServerBasePath: false/);
  }
});

test('converter API references preserve public exports and discovery contracts across locales', () => {
  const source = read('docs/x-to-openapi/api-reference.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/x-to-openapi/api-reference.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.deepEqual(identifiers(text), identifiers(source), locale.docs);
    assert.deepEqual(links(text), links(source), locale.docs);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    assert.doesNotMatch(text, /v0\.2\.2|^PostmanTypes\.PostmanCollection;/m);
    for (const contract of ['discoveryToOpenApi','buildDiscoveryOpenApi32','allowGaps: false','documentValid','10 × 1024 × 1024']) assert.ok(text.includes(contract), locale.docs + ': ' + contract);
  }
});

test('desktop installation guides preserve commands and match Electron platform requirements', () => {
  const source = read('docs/overview/installation.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/overview/installation.md`);
    assert.deepEqual(fences(text), fences(source), locale.docs);
    assert.match(text, /macOS 11/);
    assert.match(text, /Electron 37/);
    assert.match(text, /SmartScreen/);
    assert.doesNotMatch(text, /SmartSign/);
    assert.match(text, /\.\.\/client\/ai-models\.md/);
  }
});

test('new request workspace guides preserve environment tools and protocol links', () => {
  const source = read('docs/client/debug.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of ['it-IT','ru-RU','id-ID','vi-VN','tr-TR','hi-IN']) {
    const text = read(`i18n/${locale}/docusaurus-plugin-content-docs/current/client/debug.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale);
    assert.deepEqual(links(text), links(source), locale);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale);
    assert.equal((text.match(/^\d+\. /gm) || []).length, 4, locale);
  }
});

test('scenario translations retain ordered execution contracts and report language choices', () => {
  const source = read('docs/client/scenario-testing.md');
  for (const locale of ['it-IT','ru-RU','id-ID','vi-VN','tr-TR','hi-IN']) {
    const text = read(`i18n/${locale}/docusaurus-plugin-content-docs/current/client/scenario-testing.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale);
    assert.equal((text.match(/^\d+\. /gm) || []).length, 12, locale);
    assert.equal((text.match(/^   - /gm) || []).length, 3, locale);
    assert.match(text, /\.\/mock-server\.md/);
    assert.match(text, /HTML/);
  }
});

test('new desktop overview translations preserve navigation and local-first boundaries', () => {
  const source = read('docs/client/introduction.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of ['it-IT','ru-RU','id-ID','vi-VN','tr-TR','hi-IN']) {
    const text = read(`i18n/${locale}/docusaurus-plugin-content-docs/current/client/introduction.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale);
    assert.deepEqual(links(text), links(source), locale);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale);
    assert.equal((text.match(/^- /gm) || []).length, (source.match(/^- /gm) || []).length, locale);
  }
});

test('AI model translations retain cancellation and review links without claiming local-only hosted requests', () => {
  const source = read('docs/client/ai-models.md');
  const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).sort();
  for (const locale of ['it-IT','ru-RU','id-ID','vi-VN','tr-TR','hi-IN']) {
    const text = read(`i18n/${locale}/docusaurus-plugin-content-docs/current/client/ai-models.md`);
    assert.deepEqual(identifiers(text), identifiers(source), locale);
    assert.deepEqual(links(text), links(source), locale);
    assert.equal((text.match(/^## /gm) || []).length, (source.match(/^## /gm) || []).length, locale);
  }
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/client/ai-models.md`);
    assert.match(text, /HTTP\(S\)/, locale.docs);
    assert.match(text, /OpenAI/, locale.docs);
    assert.match(text, /`ai:cancel`/, locale.docs);
  }
});

test('every settings guide lists all sixteen application languages', () => {
  const source = read('docs/client/settings.md');
  for (const locale of locales.filter(locale => locale.docs !== 'en')) {
    const text = read(`i18n/${locale.docs}/docusaurus-plugin-content-docs/current/client/settings.md`);
    for (const name of ['Italiano','Русский','हिन्दी','Bahasa Indonesia','Tiếng Việt','Türkçe','العربية']) assert.ok(text.includes(name), locale.docs + ': ' + name);
    assert.equal((text.match(/^\|/gm) || []).length, (source.match(/^\|/gm) || []).length, locale.docs);
    for (const key of ['requestTimeoutMs','strictSSL','followRedirects','protocolVersion','`custom`','terminal.open','shell.revealFile','app.officialLink']) assert.ok(text.includes(key), locale.docs + ': ' + key);
  }
});

import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {translatedLocales} from '../src/plugins/content-quality.mjs';
import {hasTranslatedProse} from '../src/plugins/translation-evidence.mjs';
test('translated titles or metadata do not disguise an English article body',()=>{
 const source='---\ntitle: Introduction\n---\n# Introduction\n\nThis paragraph is still English.\n\n```js\nrun();\n```\n';
 assert.equal(hasTranslatedProse(source,source.replaceAll('Introduction','Introduzione')),false);
 assert.equal(hasTranslatedProse(source,source.replace('This paragraph is still English.','Questo paragrafo è in italiano.')),true);
});
test('English fallback and copied English are not advertised as translations',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'pd-coverage-'));
 try{for(const [locale,text] of [['en','Hello'],['fr-FR','Bonjour'],['de-DE','Hello']]){
  const dir=locale==='en'?path.join(root,'docs'):path.join(root,'i18n',locale,'docusaurus-plugin-content-docs/current');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'intro.md'),text);
 }assert.deepEqual(translatedLocales(root,'intro.md',['en','fr-FR','de-DE','ja-JP']),['en','fr-FR']);}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('all desktop languages have explicit direction and reviewed navigation/notice copy',()=>{
 const locales=JSON.parse(fs.readFileSync(new URL('../src/data/locales.json',import.meta.url)));
 const copy=JSON.parse(fs.readFileSync(new URL('../src/data/interface-copy.json',import.meta.url)));
 assert.equal(locales.length,16);assert.equal(new Set(locales.map(l=>l.code)).size,16);
 for(const locale of locales){assert.equal(typeof locale.rtl,'boolean');for(const key of Object.keys(copy.en))assert.ok(copy[locale.docs]?.[key],locale.code+':'+key);}
 assert.equal(locales.find(l=>l.code==='ar-SA').rtl,true);
});


import relativeDocLinks from '../src/plugins/relative-doc-links.mjs';
test('relative document links keep their locale across translated and fallback files', () => {
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pd-doc-links-'));
 try {
  fs.mkdirSync(path.join(root, 'library'), {recursive:true});
  fs.writeFileSync(path.join(root, 'library/quickstart.md'), '# Start');
  const transform = relativeDocLinks({docsDirectory:root});
  for (const source of [path.join(root, 'library/introduction.md'), '/site/i18n/ar-SA/docusaurus-plugin-content-docs/current/library/introduction.md']) {
   const tree = {children:[{type:'link',url:'./quickstart.md#install'}, {type:'link',url:'./missing.md'}, {type:'link',url:'https://example.com/readme.md'}]};
   transform(tree, {path:source});
   assert.deepEqual(tree.children.map(n=>n.url), ['../quickstart/#install','./missing.md','https://example.com/readme.md']);
  }
  const index = {children:[{type:'definition',url:'../library/quickstart.md'}]};
  transform(index, {path:path.join(root,'opensource/index.md')});
  assert.equal(index.children[0].url, '../library/quickstart/');
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});

import rtlcss from 'rtlcss';
test('RTL stylesheet transformation preserves left-to-right API signatures', () => {
 const css = fs.readFileSync(new URL('../src/css/custom.css', import.meta.url), 'utf8');
 const transformed = rtlcss.process(css);
 assert.match(transformed, /html\[dir="rtl"\] pre, html\[dir="rtl"\] code \{ direction: ltr; unicode-bidi: isolate; \}/);
 assert.match(transformed, /html\[dir="rtl"\] pre \{ text-align: left; \}/);
});

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {hasTranslatedProse} from '../src/plugins/translation-evidence.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const languages=JSON.parse(fs.readFileSync(path.join(root,'src/data/locales.json')));
function files(dir){return fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]):[];}
const source=files(path.join(root,'docs')).filter(f=>/\.mdx?$/.test(f));
const report={sourcePages:source.length,languageCount:languages.length,locales:[]};
for(const language of languages){
 const missing=[],copiedEnglish=[],missingDescription=[],codeReview=[];
 for(const file of source){
  const relative=path.relative(path.join(root,'docs'),file),english=fs.readFileSync(file,'utf8');
  const target=language.docs==='en'?file:path.join(root,'i18n',language.docs,'docusaurus-plugin-content-docs/current',relative);
  if(!fs.existsSync(target)){missing.push(relative);continue;}
  const content=fs.readFileSync(target,'utf8');
  if(language.docs!=='en'&&!hasTranslatedProse(english,content))copiedEnglish.push(relative);
  if(!/^description:\s*\S/m.test(content.split('---')[1]||''))missingDescription.push(relative);
  const fences=s=>[...s.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(m=>m[1]);
  if(language.docs!=='en'&&fences(content).length!==fences(english).length)codeReview.push(relative);
 }
 report.locales.push({code:language.code,translated:source.length-missing.length-copiedEnglish.length,missing,copiedEnglish,missingDescription,codeBlockCountNeedsReview:codeReview,linguisticReview:'not-certified'});
}
const out=process.argv.slice(2).find(arg=>!arg.startsWith('--'));if(out)fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.table(report.locales.map(l=>({language:l.code,translated:l.translated,total:source.length,missing:l.missing.length,metadata:l.missingDescription.length,codeReview:l.codeBlockCountNeedsReview.length})));
// Strict coverage is a release gate, not a reason to manufacture translations.
if(process.argv.includes('--require-complete')&&report.locales.some(l=>l.missing.length||l.copiedEnglish.length||l.missingDescription.length))process.exitCode=1;

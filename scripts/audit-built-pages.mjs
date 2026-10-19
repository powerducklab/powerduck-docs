import fs from 'node:fs';import path from 'node:path';import {load} from 'cheerio';import {gzipSync} from 'node:zlib';
const root=path.resolve(process.argv[2]||'build'),failures=[],titles=new Map();let checked=0,indexable=0,fallback=0;
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of files(root).filter(f=>f.endsWith('.html'))){
 const $=load(fs.readFileSync(file,'utf8'));if(!$('article').length)continue;checked++;
 const rel=path.relative(root,file),fail=message=>failures.push({page:rel,message});
 if($('h1').length!==1)fail('Expected one H1');
 if($('link[rel="canonical"]').length!==1)fail('Expected one canonical');
 if($('meta[name="description"]').length!==1||!$('meta[name="description"]').attr('content')?.trim())fail('Missing or duplicate description');
 if(!$('html').attr('lang'))fail('Missing document language');
 // Validate rendered links even on English-fallback pages: source compilation
 // alone misses locale prefixes added to pathname links during rendering.
 for(const el of $('article a[href]').toArray()){
  const href=$(el).attr('href');
  const url=new URL(href, 'https://www.powerduck.com/docs/'+rel);
  if(url.hostname!=='www.powerduck.com'||!url.pathname.startsWith('/docs/'))continue;
  let target=path.join(root,decodeURIComponent(url.pathname.slice('/docs/'.length)));
  if(url.pathname.endsWith('/')||(fs.existsSync(target)&&fs.statSync(target).isDirectory()))target=path.join(target,'index.html');
  if(!fs.existsSync(target))fail('Broken document link: '+href);
 }
 const noindex=($('meta[name="robots"]').attr('content')||'').includes('noindex');
 if(noindex){fallback++;continue;}indexable++;
 const title=$('title').text();const key=$('html').attr('lang')+':'+title;
 if(titles.has(key))fail('Duplicate title: '+titles.get(key));else titles.set(key,rel);
 const canonical=$('link[rel="canonical"]').attr('href');
 if(!$('link[hreflang]').toArray().some(el=>$(el).attr('href')===canonical))fail('Missing self hreflang');
 for(const el of $('meta[property="og:image"]').toArray()){
  const url=new URL($(el).attr('content'));if(url.hostname==='www.powerduck.com'&&url.pathname.startsWith('/docs/')){
   const image=path.join(root,url.pathname.slice('/docs/'.length));if(!fs.existsSync(image))fail('Missing social image: '+url.pathname);
  }
 }
}
const report={checked,indexable,fallback,failures,scripts:files(root).filter(f=>/assets\/js\/main\..*\.js$/.test(f)).map(f=>({path:path.relative(root,f),gzipBytes:gzipSync(fs.readFileSync(f)).length}))};
fs.writeFileSync(path.join(root,'page-quality.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;

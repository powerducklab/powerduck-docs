import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
import {hasTranslatedProse} from './translation-evidence.mjs';

/** A locale is a search alternate only when it contains an actual translation. */
export function translatedLocales(siteDir, relative, locales) {
  const source = fs.readFileSync(path.join(siteDir, 'docs', relative), 'utf8');
  return locales.filter(locale => {
    if (locale === 'en') return true;
    const file = path.join(siteDir, 'i18n', locale, 'docusaurus-plugin-content-docs/current', relative);
    return fs.existsSync(file) && hasTranslatedProse(source, fs.readFileSync(file, 'utf8'));
  });
}

export default function contentQuality(context) {
  let pages = {};
  return {
    name: 'powerduck-content-quality',
    async allContentLoaded({allContent, actions}) {
      const docs = allContent['docusaurus-plugin-content-docs']?.default?.loadedVersions?.flatMap(version => version.docs) || [];
      for (const doc of docs) {
        const relative = doc.source.includes('/current/') ? doc.source.split('/current/')[1] : doc.source.split('/docs/')[1];
        if (!relative) continue;
        const route = doc.permalink.slice(context.baseUrl.length).replace(/\/$/, '');
        pages[route] = {locales: translatedLocales(context.siteDir, relative, context.i18n.locales), source: relative};
      }
      actions.setGlobalData({pages});
    },
    async postBuild({outDir}) {
      const locale = context.i18n.currentLocale;
      const fallback = Object.entries(pages).filter(([, page]) => !page.locales.includes(locale));
      const excluded = new Set(fallback.map(([route]) => context.siteConfig.url + context.baseUrl + route + '/'));
      const sitemap = path.join(outDir, 'sitemap.xml');
      if (fs.existsSync(sitemap)) {
        const $ = load(fs.readFileSync(sitemap, 'utf8'), {xml: true});
        $('url').each((_, el) => { if (excluded.has($(el).find('loc').text())) $(el).remove(); });
        // Sitemap hreflang entries must not advertise English fallback as a translation.
        $('xhtml\\:link').each((_, el) => {
          const href = $(el).attr('href') || '';
          const lang = $(el).attr('hreflang');
          const route = href.replace(context.siteConfig.url + '/docs/', '').replace(new RegExp('^(' + context.i18n.locales.filter(l=>l!=='en').join('|') + ')/'), '').replace(/\/$/,'');
          if (lang !== 'x-default' && pages[route] && !pages[route].locales.includes(lang)) $(el).remove();
        });
        fs.writeFileSync(sitemap, $.xml());
      }
      fs.writeFileSync(path.join(outDir, 'translation-coverage.json'), JSON.stringify({locale, total:Object.keys(pages).length, translated:Object.keys(pages).length-fallback.length, missing:fallback.map(([,p])=>p.source)},null,2)+'\n');
    },
  };
}

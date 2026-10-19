import React from 'react';
import Head from '@docusaurus/Head';
import {PageMetadata} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DocItemMetadata() {
  const {metadata, frontMatter, assets} = useDoc();
  const {i18n: {currentLocale, defaultLocale}, siteConfig} = useDocusaurusContext();
  const section = metadata.id.split('/')[0];
  const product = section === 'overview' ? 'Powerduck' : section === 'client' ? 'Powerduck Desktop' : section === 'cloud' ? 'Powerduck Cloud' : section;
  const title = metadata.title.toLowerCase().includes(product.toLowerCase()) ? metadata.title : `${metadata.title} · ${product}`;
  const fallback = currentLocale !== defaultLocale && !metadata.source.includes('/i18n/');
  const article = {
    '@context': 'https://schema.org', '@type': 'TechArticle',
    headline: title, description: metadata.description,
    url: siteConfig.url + metadata.permalink,
    inLanguage: fallback ? 'en-US' : currentLocale,
    publisher: {'@type': 'Organization', name: 'POWERDUCK LIMITED', url: siteConfig.url},
  };
  return <>
    <PageMetadata title={title} description={metadata.description} keywords={frontMatter.keywords} image={assets.image ?? frontMatter.image} />
    {!fallback && <Head><script type="application/ld+json">{JSON.stringify(article).replace(/</g, '\\u003c')}</script></Head>}
  </>;
}

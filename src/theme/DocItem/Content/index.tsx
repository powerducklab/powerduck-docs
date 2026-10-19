/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import copy from '../../../data/interface-copy.json';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const {i18n: {currentLocale, defaultLocale}} = useDocusaurusContext();
  const {metadata} = useDoc();
  const fallback = currentLocale !== defaultLocale && !metadata.source.includes('/i18n/');
  const notice = (copy as Record<string, Record<string, string>>)[currentLocale]?.untranslated;
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {fallback && <aside className="translation-notice" role="note">{notice} <a href={'/docs/' + metadata.id.replace(/\/index$/, '') + '/'} lang="en">English →</a></aside>}
      <div lang={fallback ? 'en' : currentLocale} dir={fallback ? 'ltr' : undefined}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
      </div>
    </div>
  );
}

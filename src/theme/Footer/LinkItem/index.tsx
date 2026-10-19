/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Swizzled from @docusaurus/theme-classic. Same-registrable-domain links render
// as plain root-relative anchors (same tab, no target/rel, no /docs baseUrl);
// everything else keeps the upstream behavior.
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/Footer/LinkItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import sameDomainPath, {localizedSitePath} from '../../../utils/sameDomainPath';

export default function FooterLinkItem({item}: Props): ReactNode {
  const {to, href, label, prependBaseUrlToHref, className, ...props} = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const rawSitePath = sameDomainPath(href);
  const sitePath = rawSitePath ? localizedSitePath(rawSitePath, currentLocale) : null;

  if (sitePath) {
    return (
      <a
        className={clsx('footer__link-item', className)}
        href={sitePath}
        {...props}>
        {label}
      </a>
    );
  }

  return (
    <Link
      className={clsx('footer__link-item', className)}
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {label}
      {href && !isInternalUrl(href) && <IconExternalLink />}
    </Link>
  );
}

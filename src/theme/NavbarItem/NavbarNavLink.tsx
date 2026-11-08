/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Swizzled from @docusaurus/theme-classic. Same-registrable-domain links render
// as plain root-relative anchors (same tab, no target/rel, no /docs baseUrl);
// everything else keeps the upstream behavior.
import marketingNav from '../../data/marketing-nav.json';
import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {isRegexpStringMatch} from '@docusaurus/theme-common';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/NavbarItem/NavbarNavLink';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import sameDomainPath, {localizedSitePath} from '../../utils/sameDomainPath';

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): ReactNode {
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});
  const isExternalLink = label && href && !isInternalUrl(href);
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const rawSitePath = sameDomainPath(href);
  const sitePath = rawSitePath ? localizedSitePath(rawSitePath, currentLocale) : null;

  const productKey = ({'#code-review':'codeReview','#spec-editor':'specEditor','#product-demo':'apiDebug','#spec-mcp':'mcpServer','#api-docs':'apiDocs'} as Record<string,string>)[href?.slice(href.indexOf('#')) || ''];
  const navCopy = (marketingNav as Record<string,Record<string,string>>)[currentLocale];
  const description = isDropdownLink && productKey && navCopy?.['nav.' + productKey + 'Desc'];
  // Link content is set through html XOR label
  const linkContentProps = html
    ? {dangerouslySetInnerHTML: {__html: html}}
    : {
        children: (
          <>
            {label}
            {description && <small className="marketing-nav-description">{description}</small>}
            {isExternalLink && (
              <IconExternalLink
                {...(isDropdownLink && {width: 12, height: 12})}
              />
            )}
          </>
        ),
      };

  if (sitePath) {
    return (
      <a href={sitePath} {...props} {...linkContentProps} />
    );
  }

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
        {...linkContentProps}
      />
    );
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}

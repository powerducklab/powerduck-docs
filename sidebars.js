/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'doc', id: 'getting-started/introduction' },
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Powerduck MD Editor',
      link: { type: 'doc', id: 'md-editor/introduction' },
      items: [
        'md-editor/introduction',
        'md-editor/installation',
        'md-editor/quickstart',
        'md-editor/configuration',
        'md-editor/features',
        'md-editor/api-reference',
        'md-editor/examples',
      ],
    },
    {
      type: 'category',
      label: 'conf-patch',
      link: { type: 'doc', id: 'conf-patch/introduction' },
      items: [
        'conf-patch/introduction',
        'conf-patch/installation',
        'conf-patch/quickstart',
        'conf-patch/api-reference',
        'conf-patch/examples',
      ],
    },
    {
      type: 'category',
      label: 'openapi-cli',
      link: { type: 'doc', id: 'openapi-cli/introduction' },
      items: [
        'openapi-cli/introduction',
        'openapi-cli/installation',
        'openapi-cli/quickstart',
        'openapi-cli/configuration',
        'openapi-cli/commands',
        'openapi-cli/examples',
      ],
    },
    {
      type: 'category',
      label: 'openapi-codegen',
      link: { type: 'doc', id: 'openapi-codegen/introduction' },
      items: [
        'openapi-codegen/introduction',
        'openapi-codegen/installation',
        'openapi-codegen/quickstart',
        'openapi-codegen/configuration',
        'openapi-codegen/api-reference',
        'openapi-codegen/examples',
      ],
    },
    {
      type: 'category',
      label: 'openapi-mcp-server',
      link: { type: 'doc', id: 'openapi-mcp-server/introduction' },
      items: [
        'openapi-mcp-server/introduction',
        'openapi-mcp-server/installation',
        'openapi-mcp-server/quickstart',
        'openapi-mcp-server/configuration',
        'openapi-mcp-server/api-reference',
        'openapi-mcp-server/examples',
      ],
    },
    {
      type: 'category',
      label: 'openapi-request',
      link: { type: 'doc', id: 'openapi-request/introduction' },
      items: [
        'openapi-request/introduction',
        'openapi-request/installation',
        'openapi-request/quickstart',
        'openapi-request/configuration',
        'openapi-request/api-reference',
        'openapi-request/examples',
      ],
    },
    {
      type: 'category',
      label: 'x-to-openapi',
      link: { type: 'doc', id: 'x-to-openapi/introduction' },
      items: [
        'x-to-openapi/introduction',
        'x-to-openapi/installation',
        'x-to-openapi/quickstart',
        'x-to-openapi/api-reference',
        'x-to-openapi/examples',
      ],
    },
  ],
};

export default sidebars;

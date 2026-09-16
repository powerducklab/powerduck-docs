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
    {
      type: 'category',
      label: 'openapi-parser',
      link: { type: 'doc', id: 'openapi-parser/introduction' },
      items: [
        'openapi-parser/introduction',
        'openapi-parser/installation',
        'openapi-parser/quickstart',
        'openapi-parser/api-reference',
        'openapi-parser/examples',
      ],
    },
    {
      type: 'category',
      label: 'workspace-yaml',
      link: { type: 'doc', id: 'workspace-yaml/introduction' },
      items: [
        'workspace-yaml/introduction',
        'workspace-yaml/installation',
        'workspace-yaml/quickstart',
        'workspace-yaml/api-reference',
        'workspace-yaml/examples',
      ],
    },
    {
      type: 'category',
      label: 'tree',
      link: { type: 'doc', id: 'tree/introduction' },
      items: [
        'tree/introduction',
        'tree/installation',
        'tree/quickstart',
        'tree/api-reference',
        'tree/examples',
      ],
    },
    {
      type: 'category',
      label: 'schema-editor',
      link: { type: 'doc', id: 'schema-editor/introduction' },
      items: [
        'schema-editor/introduction',
        'schema-editor/installation',
        'schema-editor/quickstart',
        'schema-editor/api-reference',
        'schema-editor/examples',
      ],
    },
    {
      type: 'category',
      label: 'oas-document',
      link: { type: 'doc', id: 'oas-document/introduction' },
      items: [
        'oas-document/introduction',
        'oas-document/installation',
        'oas-document/quickstart',
        'oas-document/api-reference',
        'oas-document/examples',
      ],
    },
  ],
};

export default sidebars;

import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', 'bc3'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', '526'),
        routes: [
          {
            path: '/docs/',
            component: ComponentCreator('/docs/', 'f15'),
            routes: [
              {
                path: '/docs/client/ai-models',
                component: ComponentCreator('/docs/client/ai-models', '0d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/data-model',
                component: ComponentCreator('/docs/client/data-model', '396'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/debug',
                component: ComponentCreator('/docs/client/debug', '15e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/design',
                component: ComponentCreator('/docs/client/design', '45d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/introduction',
                component: ComponentCreator('/docs/client/introduction', 'e22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/mock-server',
                component: ComponentCreator('/docs/client/mock-server', '172'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/protocols',
                component: ComponentCreator('/docs/client/protocols', 'f19'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/scenario-testing',
                component: ComponentCreator('/docs/client/scenario-testing', 'b3a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/client/settings',
                component: ComponentCreator('/docs/client/settings', '4d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/access-control',
                component: ComponentCreator('/docs/cloud/access-control', '1f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/billing',
                component: ComponentCreator('/docs/cloud/billing', '1e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/custom-domains',
                component: ComponentCreator('/docs/cloud/custom-domains', '5eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/documents-versions',
                component: ComponentCreator('/docs/cloud/documents-versions', 'd2f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/exposure',
                component: ComponentCreator('/docs/cloud/exposure', 'c3c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/introduction',
                component: ComponentCreator('/docs/cloud/introduction', '9e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/cloud/quickstart',
                component: ComponentCreator('/docs/cloud/quickstart', '41f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/conf-patch/api-reference',
                component: ComponentCreator('/docs/conf-patch/api-reference', '494'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/conf-patch/examples',
                component: ComponentCreator('/docs/conf-patch/examples', '509'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/conf-patch/installation',
                component: ComponentCreator('/docs/conf-patch/installation', '5d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/conf-patch/introduction',
                component: ComponentCreator('/docs/conf-patch/introduction', '0ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/conf-patch/quickstart',
                component: ComponentCreator('/docs/conf-patch/quickstart', '1e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/api-reference',
                component: ComponentCreator('/docs/md-editor/api-reference', 'f37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/configuration',
                component: ComponentCreator('/docs/md-editor/configuration', '89f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/examples',
                component: ComponentCreator('/docs/md-editor/examples', '263'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/features',
                component: ComponentCreator('/docs/md-editor/features', 'bbf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/installation',
                component: ComponentCreator('/docs/md-editor/installation', 'f10'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/introduction',
                component: ComponentCreator('/docs/md-editor/introduction', '732'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/md-editor/quickstart',
                component: ComponentCreator('/docs/md-editor/quickstart', 'c04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/oas-document/api-reference',
                component: ComponentCreator('/docs/oas-document/api-reference', '87e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/oas-document/examples',
                component: ComponentCreator('/docs/oas-document/examples', '272'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/oas-document/installation',
                component: ComponentCreator('/docs/oas-document/installation', 'ca9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/oas-document/introduction',
                component: ComponentCreator('/docs/oas-document/introduction', '904'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/oas-document/quickstart',
                component: ComponentCreator('/docs/oas-document/quickstart', '2d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/api-reference',
                component: ComponentCreator('/docs/openapi-cli/api-reference', '7b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/commands',
                component: ComponentCreator('/docs/openapi-cli/commands', '898'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/configuration',
                component: ComponentCreator('/docs/openapi-cli/configuration', 'd28'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/examples',
                component: ComponentCreator('/docs/openapi-cli/examples', '2a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/installation',
                component: ComponentCreator('/docs/openapi-cli/installation', '4a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/introduction',
                component: ComponentCreator('/docs/openapi-cli/introduction', '4f7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-cli/quickstart',
                component: ComponentCreator('/docs/openapi-cli/quickstart', 'faf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-codegen/api-reference',
                component: ComponentCreator('/docs/openapi-codegen/api-reference', 'bbe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-codegen/configuration',
                component: ComponentCreator('/docs/openapi-codegen/configuration', '51e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-codegen/examples',
                component: ComponentCreator('/docs/openapi-codegen/examples', '65a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-codegen/installation',
                component: ComponentCreator('/docs/openapi-codegen/installation', '73c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-codegen/introduction',
                component: ComponentCreator('/docs/openapi-codegen/introduction', '301'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-codegen/quickstart',
                component: ComponentCreator('/docs/openapi-codegen/quickstart', '69a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-mcp-server/api-reference',
                component: ComponentCreator('/docs/openapi-mcp-server/api-reference', 'd87'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-mcp-server/configuration',
                component: ComponentCreator('/docs/openapi-mcp-server/configuration', 'c83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-mcp-server/examples',
                component: ComponentCreator('/docs/openapi-mcp-server/examples', '307'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-mcp-server/installation',
                component: ComponentCreator('/docs/openapi-mcp-server/installation', '6d3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-mcp-server/introduction',
                component: ComponentCreator('/docs/openapi-mcp-server/introduction', 'fb9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-mcp-server/quickstart',
                component: ComponentCreator('/docs/openapi-mcp-server/quickstart', '2d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-parser/api-reference',
                component: ComponentCreator('/docs/openapi-parser/api-reference', '76a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-parser/examples',
                component: ComponentCreator('/docs/openapi-parser/examples', 'edb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-parser/installation',
                component: ComponentCreator('/docs/openapi-parser/installation', '608'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-parser/introduction',
                component: ComponentCreator('/docs/openapi-parser/introduction', 'f35'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-parser/quickstart',
                component: ComponentCreator('/docs/openapi-parser/quickstart', 'a67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-request/api-reference',
                component: ComponentCreator('/docs/openapi-request/api-reference', '03f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-request/configuration',
                component: ComponentCreator('/docs/openapi-request/configuration', '538'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-request/examples',
                component: ComponentCreator('/docs/openapi-request/examples', '385'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-request/installation',
                component: ComponentCreator('/docs/openapi-request/installation', 'ed2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-request/introduction',
                component: ComponentCreator('/docs/openapi-request/introduction', 'e95'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/openapi-request/quickstart',
                component: ComponentCreator('/docs/openapi-request/quickstart', '32b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/opensource/',
                component: ComponentCreator('/docs/opensource/', 'eb1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/installation',
                component: ComponentCreator('/docs/overview/installation', 'edf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/introduction',
                component: ComponentCreator('/docs/overview/introduction', '45f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/quickstart',
                component: ComponentCreator('/docs/overview/quickstart', '44f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/schema-editor/api-reference',
                component: ComponentCreator('/docs/schema-editor/api-reference', 'f08'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/schema-editor/examples',
                component: ComponentCreator('/docs/schema-editor/examples', '17f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/schema-editor/installation',
                component: ComponentCreator('/docs/schema-editor/installation', 'b0d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/schema-editor/introduction',
                component: ComponentCreator('/docs/schema-editor/introduction', '511'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/schema-editor/quickstart',
                component: ComponentCreator('/docs/schema-editor/quickstart', 'a3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tree/api-reference',
                component: ComponentCreator('/docs/tree/api-reference', 'e41'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tree/examples',
                component: ComponentCreator('/docs/tree/examples', '6f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tree/installation',
                component: ComponentCreator('/docs/tree/installation', '4f3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tree/introduction',
                component: ComponentCreator('/docs/tree/introduction', '629'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tree/quickstart',
                component: ComponentCreator('/docs/tree/quickstart', '954'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/workspace-yaml/api-reference',
                component: ComponentCreator('/docs/workspace-yaml/api-reference', 'df7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/workspace-yaml/examples',
                component: ComponentCreator('/docs/workspace-yaml/examples', '921'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/workspace-yaml/installation',
                component: ComponentCreator('/docs/workspace-yaml/installation', 'bb6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/workspace-yaml/introduction',
                component: ComponentCreator('/docs/workspace-yaml/introduction', '0fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/workspace-yaml/quickstart',
                component: ComponentCreator('/docs/workspace-yaml/quickstart', '01f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/x-to-openapi/api-reference',
                component: ComponentCreator('/docs/x-to-openapi/api-reference', '52d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/x-to-openapi/examples',
                component: ComponentCreator('/docs/x-to-openapi/examples', '6c0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/x-to-openapi/installation',
                component: ComponentCreator('/docs/x-to-openapi/installation', '0eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/x-to-openapi/introduction',
                component: ComponentCreator('/docs/x-to-openapi/introduction', 'c90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/x-to-openapi/quickstart',
                component: ComponentCreator('/docs/x-to-openapi/quickstart', '6f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

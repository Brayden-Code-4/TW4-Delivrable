// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'about',
    'quickstart',
    'installation',
    'user-guide',
    {
      type: 'category',
      label: 'Developer guide',
      items: [
        'developer/overview',
        'developer/integrate',
        'developer/configure',
        'developer/code-reference',
        'developer/extend',
        'developer/writers',
      ],
    },
    {
      type: 'category',
      label: 'API reference',
      items: [
        'api/overview',
        'api/authentication',
        'api/status-codes',
        'api/openapi',
        'api/firmware-status',
        'api/system-status',
        'api/service-search',
        'api/firmware-update',
        'api/group-add',
      ],
    },
  ],
};

export default sidebars;

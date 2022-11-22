const stylesPath = (entity) => `../src/${entity}s/{{ name }}/styles.module.scss`;
const mocksPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.mock.tsx`;
const componentPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.tsx`;
const storiesPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.stories.tsx`;
const indexPath = (entity) => `../src/${entity}s/{{ name }}/index.tsx`;

module.exports = {
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Component name please',
    },
    {
      type: 'list',
      name: 'folder',
      message: 'Choose a folder',
      choices: [
        { name: 'components', value: 'component' },
        { name: 'containers', value: 'container' },
      ],
    },
  ],
  actions: [
    {
      type: 'add',
      path: stylesPath('{{ camelCase folder}}'),
      templateFile: 'templates/components/styles.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: storiesPath('{{ camelCase folder}}'),
      templateFile: 'templates/components/stories.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: componentPath('{{ camelCase folder}}'),
      templateFile: 'templates/components/component.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: indexPath('{{ camelCase folder}}'),
      templateFile: 'templates/components/index.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: mocksPath('{{ camelCase folder}}'),
      templateFile: 'templates/components/mock.hbs',
      abortOnFail: true,
    },
  ],
};

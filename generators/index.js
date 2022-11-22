module.exports = (plop) => {
  const stylesPath = (entity) => `../src/${entity}s/{{ name }}/styles.module.scss`;
  const mocksPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.mock.tsx`;
  const testPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.test.tsx`;
  const componentPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.tsx`;
  const storiesPath = (entity) => `../src/${entity}s/{{ name }}/{{ name }}.stories.tsx`;
  const indexPath = (entity) => `../src/${entity}s/{{ name }}/index.tsx`;

  plop.setGenerator('component', {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: stylesPath('component'),
        templateFile: 'templates/components/styles.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: storiesPath('component'),
        templateFile: 'templates/components/stories.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: componentPath('component'),
        templateFile: 'templates/components/component.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: indexPath('component'),
        templateFile: 'templates/components/index.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: testPath('component'),
        templateFile: 'templates/components/test.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: mocksPath('component'),
        templateFile: 'templates/components/mock.hbs',
        abortOnFail: true,
      },
    ],
  });
};

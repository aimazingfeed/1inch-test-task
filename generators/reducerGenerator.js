const reducerPath = (reducerName) => `../src/store/${reducerName}/reducer.ts`;
const selectorPath = (reducerName) => `../src/store/${reducerName}/selectors.ts`;
const actionsPath = (reducerName) => `../src/store/${reducerName}/actions.ts`;
const actionTypesPath = (reducerName) => `../src/store/${reducerName}/actionTypes.ts`;
const sagaPath = (reducerName) => `../src/store/${reducerName}/sagas/exampleSaga.ts`;
const sagasIndexPath = (reducerName) => `../src/store/${reducerName}/sagas/index.ts`;
const reducerTypePath = (reducerName) => `../src/types/store/${reducerName}.ts`;
const storeTypesPath = '../src/types/store/index.ts';
const storeRootReducer = '../src/store/rootReducer.ts';
const storeRootSaga = '../src/store/rootSaga.ts';

module.exports = {
  prompts: [
    {
      type: 'input',
      name: 'reducerName',
      message: 'Reducer name please',
    },
  ],
  actions: [
    {
      type: 'add',
      path: reducerPath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/reducer.hbs',
      abortOnFail: true,
    },

    {
      type: 'add',
      path: reducerTypePath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/reducerType.hbs',
      abortOnFail: true,
    },

    {
      type: 'add',
      path: selectorPath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/selectors.hbs',
      abortOnFail: true,
    },

    {
      type: 'add',
      path: actionsPath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/actions.hbs',
      abortOnFail: true,
    },

    {
      type: 'add',
      path: actionTypesPath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/actionTypes.hbs',
      abortOnFail: true,
    },

    {
      type: 'add',
      path: sagaPath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/saga.hbs',
      abortOnFail: true,
    },

    {
      type: 'add',
      path: sagasIndexPath('{{ camelCase reducerName }}'),
      templateFile: 'templates/reducer/sagasIndex.hbs',
      abortOnFail: true,
    },

    {
      type: 'append',
      path: storeTypesPath,
      pattern: `/* PLOP_INJECT_IMPORT_STATE */`,
      template: `import { {{ properCase reducerName }}State } from './{{ camelCase reducerName }}';`,
    },

    {
      type: 'append',
      path: storeTypesPath,
      pattern: `/* PLOP_INJECT_IMPORT_TYPES */`,
      template: `export * from './{{ camelCase reducerName }}';`,
    },

    {
      type: 'append',
      path: storeTypesPath,
      pattern: `/* PLOP_INJECT_MODIFY_STATE */`,
      template: `  {{ camelCase reducerName }}: {{ properCase reducerName }}State;`,
    },

    {
      type: 'append',
      path: storeRootReducer,
      pattern: `/* PLOP_INJECT_IMPORT_REDUCER */`,
      template: `import {{ camelCase reducerName }} from './{{ camelCase reducerName }}/reducer';`,
    },

    {
      type: 'append',
      path: storeRootReducer,
      pattern: `/* PLOP_INJECT_PLACE_REDUCER */`,
      template: `  {{ camelCase reducerName }},`,
    },

    {
      type: 'append',
      path: storeRootSaga,
      pattern: `/* PLOP_INJECT_IMPORT_SAGA */`,
      template: `import {{ camelCase reducerName }}Saga from '@/store/{{ camelCase reducerName }}/sagas';`,
    },

    {
      type: 'append',
      path: storeRootSaga,
      pattern: `/* PLOP_INJECT_FORK_SAGA */`,
      template: `  yield fork({{ camelCase reducerName }}Saga);`,
    },
  ],
};

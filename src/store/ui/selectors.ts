import type { StateWithUIState } from 'types';

export default {
  getUI: (state: StateWithUIState) => state.ui,
  getProp: (propKey: string) => (state: StateWithUIState) => state.ui[propKey],
};

import type { Dispatch as DispatchReact } from 'react';

import { ModalsInitialState } from './modals';
import { UserState } from './user';
/* PLOP_INJECT_IMPORT_STATE */

export * from './user';
export * from './ui';
export * from './modals';
/* PLOP_INJECT_IMPORT_TYPES */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<T, P = any, M = void> = { type: T; payload?: P; meta?: M };
export type Dispatch = DispatchReact<{ type: string }>;

export type State = {
  user: UserState;
  modals: ModalsInitialState;
  /* PLOP_INJECT_MODIFY_STATE */
};

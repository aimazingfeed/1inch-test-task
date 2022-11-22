import { ReactElement } from 'react';
import { Home } from 'pages';

export interface RouteObject {
  [key: string]: {
    name: string;
    path: string;
    component: ReactElement;
    getPath?: (path: string) => string;
  };
}

export const routes: RouteObject = {
  explore: {
    name: 'Home',
    path: '/',
    component: <Home />,
  },
};

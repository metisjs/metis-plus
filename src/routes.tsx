import { lazy, Suspense } from 'react';
import { Cog6ToothOutline, Squares2X2Outline, UserOutline } from '@metisjs/icons';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import Access from './components/Access';
import Loading from './loading';
import Err403 from './pages/403';
import type { Permission } from '@/utils/auth';

export type Route = Omit<RouteObject, 'Component' | 'children'> & {
  name?: string;
  icon?: React.ReactNode;
  component?: () => Promise<{
    default: React.ComponentType;
  }>;
  children?: Route[];
  hideInMenu?: boolean;
  permission?: Permission;
};

export const loginPath = '/login';

const routes: Route[] = [
  {
    path: loginPath,
    component: () => import('@/pages/login'),
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    children: [
      {
        index: true,
        element: <Navigate to="/workplace" replace />,
      },
      {
        name: 'menu.workplace',
        icon: <Squares2X2Outline />,
        path: 'workplace',
        component: () => import('@/pages/workplace'),
      },
      {
        name: 'menu.account',
        icon: <UserOutline />,
        path: 'account',
        children: [
          {
            index: true,
            element: <Navigate to="info" replace />,
          },
          {
            name: 'menu.account.info',
            path: 'info',
            component: () => import('@/pages/account/info'),
          },
          {
            name: 'menu.account.settings',
            path: 'settings',
            component: () => import('@/pages/account/settings'),
          },
        ],
      },
      {
        name: 'menu.admin',
        icon: <Cog6ToothOutline />,
        path: 'admin',
        component: () => import('@/pages/admin'),
        permission: { resource: 'admin', actions: ['read'] },
      },
      {
        path: '*',
        component: () => import('@/pages/404'),
      },
    ],
  },
];

function generateRouteObjects(routes: Route[]): RouteObject[] {
  return routes.map((route) => {
    const { component, children, permission, ...rest } = route;

    const routeObj: RouteObject = {
      ...rest,
    };

    if (component) {
      const Component = lazy(component);
      routeObj.element = (
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      );
      if (permission) {
        routeObj.element = (
          <Access permission={permission} fallback={<Err403 />}>
            {routeObj.element}
          </Access>
        );
      }
    }

    if (Array.isArray(children) && children.length > 0) {
      routeObj.children = generateRouteObjects(children);
    }

    return routeObj;
  });
}

const router = createBrowserRouter(generateRouteObjects(routes));

export { router };

export default routes;

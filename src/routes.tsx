import { lazy, Suspense } from 'react';
import { Cog6ToothOutline, HomeOutline } from '@metisjs/icons';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import Access from './components/Access';
import Loading from './loading';
import Err403 from './pages/403';
import type { Permission } from '@/utils/auth';

export type Route = Omit<RouteObject, 'Component' | 'children'> & {
  name?: string;
  icon?: React.ReactNode;
  /** 相对 pages 路径 */
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
    component: () => import('@/pages/Login'),
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        name: 'menu.dashboard',
        icon: <HomeOutline />,
        path: 'dashboard',
        component: () => import('@/pages/Dashboard'),
      },
      {
        name: 'menu.ttt',
        icon: <Cog6ToothOutline />,
        path: 'admin',
        component: () => import('@/pages/Admin'),
        permission: 'admin',
      },
      {
        name: '系统管理',
        icon: <Cog6ToothOutline />,
        path: 'system',
        children: [
          { name: '用户管理', path: 'account', component: () => import('@/pages/Admin') },
          { name: '系统设置', path: 'settings', component: () => import('@/pages/Admin') },
        ],
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

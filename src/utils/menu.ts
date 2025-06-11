import type { TFunction } from 'i18next';
import { match } from 'path-to-regexp';
import { hasPermission, type UserPermissions } from './auth';
import type { Route } from '@/routes';

export interface MenuDataItem {
  children?: MenuDataItem[];
  icon?: React.ReactNode;
  label?: React.ReactNode;
  key: string;
}

interface FormatterProps {
  data: Route[];
  t: TFunction<'translation', undefined>;
  userPerms: UserPermissions;
}

/**
 * 如果不是 / 开头的和父节点做一下合并
 * 如果是 / 开头的不作任何处理
 * @param path
 * @param parentPath
 */
function mergePath(path: string = '/', parentPath: string = '/') {
  if ((path || parentPath).startsWith('/')) {
    return path;
  }
  return `/${parentPath}/${path}`.replace(/\/\//g, '/').replace(/\/\//g, '/');
}

function stripQueryStringAndHashFromPath(url: string) {
  return url.split('?')[0].split('#')[0];
}

export function formatter(
  { data, t, userPerms }: FormatterProps,
  parentPath = '/',
  ignoreFilter = false,
): MenuDataItem[] {
  return data
    .filter((item) => {
      if (!ignoreFilter && item.hideInMenu) return false;
      if (item.permission && !hasPermission(item.permission, userPerms)) return false;
      return true;
    })
    .flatMap((item) => {
      const mergedPath = mergePath(item.path, parentPath);

      if (!item.name) {
        return item.children
          ? formatter({ data: item.children, t, userPerms }, mergedPath, ignoreFilter)
          : [];
      }

      let children: MenuDataItem[] | undefined = undefined;
      if (item.children) {
        const formattedChildren = formatter(
          { data: item.children, t, userPerms },
          mergedPath,
          ignoreFilter,
        );
        if (formattedChildren.length > 0) {
          children = formattedChildren;
        }
      }

      const menuItem = {
        key: mergedPath,
        label: t(item.name),
        icon: item.icon,
        ...(children ? { children } : {}),
      } as MenuDataItem;

      return [menuItem];
    });
}

/**
 * 获取打平的 menuData
 * @param menuData
 */
export const getFlatMenus = (menuData: MenuDataItem[] = []): Record<string, MenuDataItem> => {
  let menus: Record<string, MenuDataItem> = {};
  menuData.forEach((mapItem) => {
    const item = { ...mapItem };
    if (!item || !item.key) {
      return;
    }

    const children = item.children || [];
    menus[stripQueryStringAndHashFromPath(item.key)] = {
      ...item,
    };
    menus[item.key] = { ...item };

    if (children) {
      menus = { ...menus, ...getFlatMenus(children) };
    }
  });
  return menus;
};

export const getMenuMatches = (flatMenuKeys: string[] = [], path: string): string[] | undefined =>
  flatMenuKeys
    .filter((item) => {
      if (item === '/' && path === '/') {
        return true;
      }
      if (item !== '/' && item !== '/*' && item) {
        const pathKey = stripQueryStringAndHashFromPath(item);
        return match(pathKey, { end: false })(path);
      }
      return false;
    })
    .sort((a, b) => {
      // 如果完全匹配放到最后面
      if (a === path) {
        return 10;
      }
      if (b === path) {
        return -10;
      }
      return a.slice(1).split('/').length - b.slice(1).split('/').length;
    }) as string[];

/**
 * 获取当前的选中菜单列表
 * @param pathname
 * @param menuData
 * @returns MenuDataItem[]
 */
export const getMatchMenus = (pathname: string, formatterProps: FormatterProps): MenuDataItem[] => {
  const menuData = formatter(formatterProps, '/', true);
  const flatMenus = getFlatMenus(menuData);
  const flatMenuKeys = Object.keys(flatMenus);
  const menuPathKeys = getMenuMatches(flatMenuKeys, pathname);

  if (!menuPathKeys || menuPathKeys.length < 1) {
    return [];
  }

  return menuPathKeys.map((menuPathKey) => flatMenus[menuPathKey]).flat(1);
};

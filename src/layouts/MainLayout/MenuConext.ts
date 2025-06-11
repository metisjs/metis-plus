import { createContext } from 'react';
import type { BreadcrumbItemType } from 'metis-ui/es/breadcrumb/Breadcrumb';
import type { MenuDataItem } from '@/utils/menu';

export interface MenuContextProps {
  menus: MenuDataItem[];
  matchedMenus: MenuDataItem[];
  breadcrumbs: BreadcrumbItemType[];
}

const MenuContext = createContext<MenuContextProps>({
  menus: [],
  matchedMenus: [],
  breadcrumbs: [],
});

export default MenuContext;

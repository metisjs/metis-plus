import { useEffect, useMemo, useState } from 'react';
import { SidebarOutline } from '@metisjs/icons';
import { uniq } from 'lodash-es';
import { Button, clsx, Layout, Menu, Scrollbar, Tooltip, useTheme, type SafeKey } from 'metis-ui';
import type { ItemType, MenuInfo } from 'metis-ui/es/menu/interface';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router';
import AvatarDropdown from './AvatarDropdown';
import MenuContext from './MenuConext';
import Logo from '@/assets/logo.svg?react';
import Footer from '@/components/Footer';
import LangSwitch from '@/components/LangSwitch';
import ThemeSwitch from '@/components/ThemeSwitch';
import routes from '@/routes';
import { useUserStore } from '@/store/user';
import { formatter, getMatchMenus } from '@/utils/menu';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { pathname } = useLocation();
  const userPerms = useUserStore((state) => state.currentUser?.permissions || []);
  const { isDark } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<SafeKey[]>();
  const [openKeys, setOpenKeys] = useState<SafeKey[]>([]);

  const menus = useMemo(() => formatter({ data: routes, t, userPerms }), [userPerms, t]);
  const matchedMenus = useMemo(
    () => getMatchMenus(pathname, { data: routes, t, userPerms }),
    [pathname, t, userPerms],
  );

  useEffect(() => {
    setSelectedKeys(matchedMenus.map((menu) => menu.key));
    setOpenKeys((prev) => uniq([...prev, ...matchedMenus.map((menu) => menu.key)]));
  }, [matchedMenus]);

  const breadcrumbs = useMemo(
    () =>
      matchedMenus.map((menu) => ({
        key: menu.key,
        title: menu.label,
      })),
    [matchedMenus],
  );

  const menuContextValue = useMemo(
    () => ({
      menus,
      matchedMenus,
      breadcrumbs,
    }),
    [menus, matchedMenus, breadcrumbs],
  );

  const handleMenuClick = ({ key }: MenuInfo) => {
    navigate(`${key}`);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <MenuContext.Provider value={menuContextValue}>
      <Layout className="h-screen">
        <Header className="flex h-14 justify-between border-b border-gray-950/5 px-5 dark:border-white/10">
          <div className="flex items-center gap-2 text-xl font-medium">
            <Logo className="size-8" />
            <span>Metis Plus</span>
          </div>
          <div className="flex items-center gap-4">
            <LangSwitch />
            <ThemeSwitch />
            <AvatarDropdown />
          </div>
        </Header>
        <Content>
          <Layout className="h-full">
            <Sider
              width={288}
              collapsed={collapsed}
              className="border-r border-gray-950/5 bg-transparent dark:border-white/10"
            >
              <Menu
                theme={isDark ? 'dark' : 'light'}
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                items={menus as ItemType[]}
                onClick={handleMenuClick}
                onOpenChange={(openKeys) => setOpenKeys(openKeys)}
                className={{
                  root: 'bg-transparent',
                  item: ({ selected }) => ({ inner: clsx(selected && 'bg-gray-900') }),
                }}
              />
              <Tooltip title={collapsed ? t('sidebar.tips.expand') : t('sidebar.tips.collapse')}>
                <Button
                  type="text"
                  icon={<SidebarOutline className="size-5" />}
                  size="small"
                  onClick={toggleCollapsed}
                  className="text-text-tertiary absolute right-5 bottom-4"
                />
              </Tooltip>
            </Sider>
            <Content>
              <Scrollbar>
                <div className="min-h-[calc(100%-3rem)] p-6">
                  <Outlet />
                </div>
                <Footer />
              </Scrollbar>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </MenuContext.Provider>
  );
};

export default MainLayout;

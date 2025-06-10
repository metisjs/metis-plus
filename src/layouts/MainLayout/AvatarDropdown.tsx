import type { FC } from 'react';
import { flushSync } from 'react-dom';
import { Cog6ToothOutline, PowerOutline, UserOutline } from '@metisjs/icons';
import { Avatar, Dropdown, type MenuProps } from 'metis-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { logout } from '@/apis/user';
import { loginPath } from '@/routes';
import { useUserStore } from '@/store/user';

const AvatarDropdown: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentUser = useUserStore((state) => state.currentUser);
  const clearCurrentUser = useUserStore((state) => state.clearCurrentUser);

  const onMenuClick: MenuProps['onClick'] = async (event) => {
    const { key } = event;
    if (key === 'logout') {
      await logout();
      flushSync(() => {
        clearCurrentUser();
        navigate(loginPath);
      });
    } else {
      navigate(`/account/${key}`);
    }
  };

  const menuItems = [
    {
      key: 'center',
      icon: <UserOutline />,
      label: t('navbar.account.center'),
    },
    {
      key: 'settings',
      icon: <Cog6ToothOutline />,
      label: t('navbar.account.settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <PowerOutline />,
      label: t('navbar.logout'),
    },
  ];

  return (
    <Dropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      placement="bottomLeft"
    >
      <div className="flex cursor-pointer items-center gap-2 font-medium">
        <Avatar size={32} src={currentUser?.avatar} />
        <span>{currentUser.name}</span>
      </div>
    </Dropdown>
  );
};

export default AvatarDropdown;

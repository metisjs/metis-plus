import type { FC } from 'react';
import { ComputerDesktopOutline, MoonSparklesOutline, SunOutline } from '@metisjs/icons';
import { useLocalStorageState } from 'ahooks';
import { Dropdown, Tooltip } from 'metis-ui';
import type { MenuClickEventHandler } from 'metis-ui/es/menu/interface';
import { useTranslation } from 'react-i18next';

export type ThemeName = 'system' | 'light' | 'dark';

const ThemeSwitch: FC = () => {
  const { t } = useTranslation();

  const [theme, setTheme] = useLocalStorageState<ThemeName>('theme', { defaultValue: 'system' });

  const onThemeChange: MenuClickEventHandler = ({ key }) => {
    setTheme(key as ThemeName);
  };

  const themes = [
    {
      name: 'light',
      icon: <SunOutline />,
      label: t('theme.light'),
    },
    {
      name: 'dark',
      icon: <MoonSparklesOutline />,
      label: t('theme.dark'),
    },
    {
      name: 'system',
      icon: <ComputerDesktopOutline />,
      label: t('theme.system'),
    },
  ];

  const currentTheme = themes.find((item) => item.name === (theme ?? 'system'));

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: themes.map((theme) => ({
          key: theme.name,
          label: theme.label,
          icon: theme.icon,
        })),
        selectable: true,
        selectedKeys: [currentTheme!.name],
        onClick: onThemeChange,
        className: { item: { icon: '-ms-1 size-5' } },
      }}
    >
      <Tooltip title={t('theme.tips.switch')}>
        <button className="text-text flex items-center *:size-5.5">{currentTheme?.icon}</button>
      </Tooltip>
    </Dropdown>
  );
};

export default ThemeSwitch;

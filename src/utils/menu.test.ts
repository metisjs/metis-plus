import type { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';
import type { MenuDataItem } from './menu';
import { formatter, getFlatMenus, getMatchMenus, getMenuMatches } from './menu';

const t = vi.fn((key: string) => `t:${key}`) as unknown as TFunction<'translation', undefined>;

const userPerms = [
  { resource: 'dashboard', actions: ['view'] },
  { resource: 'admin', actions: ['edit'] },
];

describe('formatter', () => {
  it('should format menu data with label and key', () => {
    const data = [
      { path: 'dashboard', name: 'dashboard', icon: 'icon1' },
      { path: '/admin', name: 'admin', icon: 'icon2' },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result).toEqual([
      { key: '/dashboard', label: 't:dashboard', icon: 'icon1' },
      { key: '/admin', label: 't:admin', icon: 'icon2' },
    ]);
  });

  it('should merge path with parentPath', () => {
    const data = [
      {
        path: 'settings',
        name: 'settings',
        children: [{ path: 'profile', name: 'profile' }],
      },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result[0].children?.[0].key).toBe('/settings/profile');
  });

  it('should filter out items with hideInMenu', () => {
    const data = [
      { path: 'a', name: 'a', hideInMenu: true },
      { path: 'b', name: 'b' },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result.length).toBe(1);
    expect(result[0].key).toBe('/b');
  });

  it('should filter out items without permission', () => {
    const data = [
      { path: 'a', name: 'a', permission: { resource: 'not-exist' } },
      { path: 'dashboard', name: 'dashboard', permission: { resource: 'dashboard' } },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result.length).toBe(1);
    expect(result[0].key).toBe('/dashboard');
  });

  it('should flatten children if parent has no name', () => {
    const data = [
      {
        path: 'parent',
        children: [{ path: 'child', name: 'child' }],
      },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result.length).toBe(1);
    expect(result[0].key).toBe('/parent/child');
  });
});

describe('getFlatMenus', () => {
  it('should flatten nested menuData', () => {
    const menuData: MenuDataItem[] = [
      {
        key: '/a',
        label: 'A',
        children: [{ key: '/a/b', label: 'B' }],
      },
      { key: '/c', label: 'C' },
    ];
    const flat = getFlatMenus(menuData);
    expect(flat['/a'].label).toBe('A');
    expect(flat['/a/b'].label).toBe('B');
    expect(flat['/c'].label).toBe('C');
  });

  it('should skip items without key', () => {
    const menuData: MenuDataItem[] = [{ label: 'A' }, { key: '/b', label: 'B' }];
    const flat = getFlatMenus(menuData);
    expect(flat['/b'].label).toBe('B');
    expect(flat['A']).toBeUndefined();
  });
});

describe('getMenuMatches', () => {
  it('should match exact path', () => {
    const keys = ['/a', '/b', '/c'];
    expect(getMenuMatches(keys, '/b')).toContain('/b');
  });

  it('should match nested path', () => {
    const keys = ['/a', '/a/b', '/a/b/c'];
    expect(getMenuMatches(keys, '/a/b/c')).toContain('/a/b/c');
    expect(getMenuMatches(keys, '/a/b/c')).toContain('/a/b');
    expect(getMenuMatches(keys, '/a/b/c')).toContain('/a');
  });

  it('should match root path', () => {
    const keys = ['/', '/home'];
    expect(getMenuMatches(keys, '/')).toContain('/');
  });

  it('should ignore invalid keys', () => {
    const keys = ['', undefined as any, '/valid'];
    expect(getMenuMatches(keys as string[], '/valid')).toContain('/valid');
  });
});

describe('getMatchMenu', () => {
  const menuData: MenuDataItem[] = [
    { key: '/', label: 'Home' },
    { key: '/dashboard', label: 'Dashboard' },
    {
      key: '/admin',
      label: 'Admin',
      children: [{ key: '/admin/users', label: 'Users' }],
    },
  ];

  it('should return matched menu items', () => {
    const matches = getMatchMenus('/admin/users', menuData);
    expect(matches.some((item) => item.key === '/admin/users')).toBe(true);
    expect(matches.some((item) => item.key === '/admin')).toBe(true);
  });

  it('should return empty array if no match', () => {
    expect(getMatchMenus('/notfound', menuData)).toEqual([]);
  });

  it('should match root', () => {
    expect(getMatchMenus('/', menuData).some((item) => item.key === '/')).toBe(true);
  });
});

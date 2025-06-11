import type { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';
import type { MenuDataItem } from './menu';
import { formatter, getFlatMenus, getMatchMenus, getMenuMatches } from './menu';

const t = vi.fn((key: string) => `t:${key}`) as unknown as TFunction<'translation', undefined>;

const userPerms = [
  { resource: 'dashboard', actions: ['view'] },
  { resource: 'admin', actions: ['edit'] },
];

const routes = [
  {
    path: 'dashboard',
    name: 'dashboard',
    icon: 'icon-dashboard',
  },
  {
    path: 'admin',
    name: 'admin',
    icon: 'icon-admin',
    permission: { resource: 'admin' },
    children: [
      {
        path: 'user',
        name: 'admin.user',
        icon: 'icon-user',
      },
      {
        path: 'role',
        name: 'admin.role',
        icon: 'icon-role',
        hideInMenu: true,
      },
      {
        path: 'role/info',
        name: 'admin.role.info',
        hideInMenu: true,
      },
    ],
  },
  {
    path: 'account',
    name: 'account',
    icon: 'icon-account',
    children: [
      {
        path: 'info',
        name: 'account.info',
        icon: 'icon-info',
      },
    ],
  },
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

  it('should handle deeply nested children', () => {
    const data = [
      {
        path: 'a',
        name: 'a',
        children: [
          {
            path: 'b',
            name: 'b',
            children: [{ path: 'c', name: 'c' }],
          },
        ],
      },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result[0].children?.[0].children?.[0].key).toBe('/a/b/c');
  });

  it('should ignoreFilter when set to true', () => {
    const data = [
      { path: 'a', name: 'a', hideInMenu: true },
      { path: 'b', name: 'b' },
    ];
    const result = formatter({ data, t, userPerms }, '/', true);
    expect(result.length).toBe(2);
  });

  it('should support empty data', () => {
    const result = formatter({ data: [], t, userPerms });
    expect(result).toEqual([]);
  });

  it('should support missing children', () => {
    const data = [{ path: 'a', name: 'a' }];
    const result = formatter({ data, t, userPerms });
    expect(result[0].children).toBeUndefined();
  });

  it('should support missing name and flatten children', () => {
    const data = [
      {
        path: 'parent',
        children: [
          { path: 'child1', name: 'child1' },
          { path: 'child2', name: 'child2' },
        ],
      },
    ];
    const result = formatter({ data, t, userPerms });
    expect(result.length).toBe(2);
    expect(result[0].key).toBe('/parent/child1');
    expect(result[1].key).toBe('/parent/child2');
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

describe('getMatchMenus', () => {
  const formatterProps = { data: routes, t, userPerms };

  it('should return matched menu items for nested path', () => {
    const matched = getMatchMenus('/admin/user', formatterProps);
    expect(matched.map((m) => m.key)).toContain('/admin');
    expect(matched.map((m) => m.key)).toContain('/admin/user');
  });

  it('should return matched menu item for root path', () => {
    const matched = getMatchMenus('/dashboard', formatterProps);
    expect(matched.map((m) => m.key)).toContain('/dashboard');
  });

  it('should return empty array if no match', () => {
    const matched = getMatchMenus('/notfound', formatterProps);
    expect(matched).toEqual([]);
  });

  it('should support deeply nested children', () => {
    const matched = getMatchMenus('/account/info', formatterProps);
    expect(matched.map((m) => m.key)).toContain('/account');
    expect(matched.map((m) => m.key)).toContain('/account/info');
  });

  it('should return matched menu items for hidden menu paths with nested structure', () => {
    const matched = getMatchMenus('/admin/role/info', formatterProps);
    expect(matched.map((m) => m.key)).toContain('/admin');
    expect(matched.map((m) => m.key)).toContain('/admin/role');
    expect(matched.map((m) => m.key)).toContain('/admin/role/info');
  });
});

import { describe, expect, it } from 'vitest';
import type { Permission, UserPermissions } from './auth';
import { hasPermission } from './auth';

describe('hasPermission', () => {
  const userPerms: UserPermissions = [
    { resource: 'article', actions: ['read', 'write'] },
    { resource: 'user', actions: ['read'] },
    { resource: 'dashboard' },
  ];

  it('should match single resource', () => {
    expect(hasPermission({ resource: 'article' }, userPerms)).toBe(true);
    expect(hasPermission({ resource: 'comment' }, userPerms)).toBe(false);
    expect(hasPermission({ resource: 'dashboard' }, userPerms)).toBe(true);
  });

  it('should match resource and actions', () => {
    expect(hasPermission({ resource: 'article', actions: ['read'] }, userPerms)).toBe(true);
    expect(hasPermission({ resource: 'article', actions: ['write'] }, userPerms)).toBe(true);
    expect(hasPermission({ resource: 'article', actions: ['delete'] }, userPerms)).toBe(false);
    expect(hasPermission({ resource: 'user', actions: ['read'] }, userPerms)).toBe(true);
    expect(hasPermission({ resource: 'user', actions: ['write'] }, userPerms)).toBe(false);
  });

  it('should support or', () => {
    const perm: Permission = { or: [{ resource: 'comment' }, { resource: 'user' }] };
    expect(hasPermission(perm, userPerms)).toBe(true);
    const perm2: Permission = { or: [{ resource: 'comment' }, { resource: 'foo' }] };
    expect(hasPermission(perm2, userPerms)).toBe(false);
  });

  it('should support and', () => {
    const perm: Permission = { and: [{ resource: 'article' }, { resource: 'user' }] };
    expect(hasPermission(perm, userPerms)).toBe(true);
    const perm2: Permission = { and: [{ resource: 'article' }, { resource: 'comment' }] };
    expect(hasPermission(perm2, userPerms)).toBe(false);
  });

  it('should support nested and/or', () => {
    // (article AND user) OR dashboard
    const perm: Permission = {
      or: [{ and: [{ resource: 'article' }, { resource: 'user' }] }, { resource: 'dashboard' }],
    };
    expect(hasPermission(perm, userPerms)).toBe(true);

    // (article AND comment) OR dashboard
    const perm2: Permission = {
      or: [{ and: [{ resource: 'article' }, { resource: 'comment' }] }, { resource: 'dashboard' }],
    };
    expect(hasPermission(perm2, userPerms)).toBe(true);

    // (article AND comment) OR foo
    const perm3: Permission = {
      or: [{ and: [{ resource: 'article' }, { resource: 'comment' }] }, { resource: 'foo' }],
    };
    expect(hasPermission(perm3, userPerms)).toBe(false);

    // article AND (user OR dashboard)
    const perm4: Permission = {
      and: [{ resource: 'article' }, { or: [{ resource: 'user' }, { resource: 'dashboard' }] }],
    };
    expect(hasPermission(perm4, userPerms)).toBe(true);

    // article AND (comment OR foo)
    const perm5: Permission = {
      and: [{ resource: 'article' }, { or: [{ resource: 'comment' }, { resource: 'foo' }] }],
    };
    expect(hasPermission(perm5, userPerms)).toBe(false);
  });

  it('should support array (and)', () => {
    const perm: Permission = [
      { resource: 'article', actions: ['read'] },
      { resource: 'user', actions: ['read'] },
    ];
    expect(hasPermission(perm, userPerms)).toBe(true);

    const perm2: Permission = [
      { resource: 'article', actions: ['read'] },
      { resource: 'user', actions: ['write'] },
    ];
    expect(hasPermission(perm2, userPerms)).toBe(false);
  });

  it('should support RegExp resource', () => {
    expect(hasPermission({ resource: /^art/ }, userPerms)).toBe(true);
    expect(hasPermission({ resource: /^dash/ }, userPerms)).toBe(true);
    expect(hasPermission({ resource: /^com/ }, userPerms)).toBe(false);
  });
});

type Resource = string | RegExp;

export type Auth =
  | {
      resource: Resource;
      actions?: string[];
    }
  | Resource;

export type UserPermissions = {
  resource: string;
  actions?: string[];
}[];

export type Permission =
  | Auth
  | Permission[] // 默认数组为“且”关系
  | { and: Permission[] }
  | { or: Permission[] };

/**
 * 判断单个资源鉴权
 * @param auth 要鉴权的对象
 * @param userPerms 用户所拥有的权限
 */
function judge(auth: Auth, userPerms: UserPermissions): boolean {
  const resource = typeof auth === 'string' || auth instanceof RegExp ? auth : auth.resource;
  const actions = typeof auth === 'string' || auth instanceof RegExp ? [] : (auth.actions ?? []);

  return userPerms.some((perm) => {
    // resource 匹配
    if (typeof resource === 'string') {
      if (perm.resource !== resource) return false;
    } else if (resource instanceof RegExp) {
      if (!resource.test(perm.resource)) return false;
    }
    // actions 匹配
    if (actions.length > 0) {
      if (!perm.actions) return false;
      return actions.every((action) => perm.actions!.includes(action));
    }
    return true;
  });
}

/**
 * 多个资源组合鉴权
 * @param permission 需要的资源权限
 * @param userPerms 用户所拥有的权限
 */
export function hasPermission(permission: Permission, userPerms: UserPermissions): boolean {
  if (Array.isArray(permission)) {
    // 默认数组为“且”关系
    return permission.every((p) => hasPermission(p, userPerms));
  }
  if (typeof permission === 'object' && 'and' in permission) {
    return permission.and.every((p) => hasPermission(p, userPerms));
  }
  if (typeof permission === 'object' && 'or' in permission) {
    return permission.or.some((p) => hasPermission(p, userPerms));
  }
  return judge(permission, userPerms);
}

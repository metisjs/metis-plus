import type { CurrentUser } from '@/types/user';
import request from '@/utils/request';

/** 获取当前的用户 */
export function getCurrentUser() {
  return request.get<CurrentUser>('/currentUser', { skipErrorHandler: true });
}

/** 退出登录接口 */
export async function logout() {
  return request.post('/logout');
}

/** 登录接口 */
export async function login(username: string, password: string) {
  return request.post<{ token: string }>(
    '/login',
    {
      username,
      password,
    },
    { skipErrorHandler: true },
  );
}

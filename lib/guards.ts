import { getAuthFromCookies } from './auth';

export function requireAuth() {
  const auth = getAuthFromCookies();
  if (!auth) throw new Error('未登录或登录已过期');
  return auth;
}

export function requireAdmin() {
  const auth = requireAuth();
  if (auth.role !== 'admin') throw new Error('无权限访问');
  return auth;
}

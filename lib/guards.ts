import { getAuthFromCookies } from './auth';

export function requireAuth() {
  const auth = getAuthFromCookies();
  if (!auth) throw new Error('Unauthorized');
  return auth;
}

export function requireAdmin() {
  const auth = requireAuth();
  if (auth.role !== 'admin') throw new Error('Forbidden');
  return auth;
}

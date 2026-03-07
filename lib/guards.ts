import { getAuthFromCookies } from './auth';

export async function requireAuth() {
  const auth = await getAuthFromCookies();
  if (!auth) throw new Error('Unauthorized');
  return auth;
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if (auth.role !== 'admin') throw new Error('Forbidden');
  return auth;
}

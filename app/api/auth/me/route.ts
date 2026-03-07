import { getAuthFromCookies } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';

export async function GET() {
  const auth = getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const user = await query('SELECT id,name,email,role,created_at FROM users WHERE id=$1', [auth.userId]);
  return ok(user.rows[0]);
}

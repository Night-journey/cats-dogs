import { getAuthFromCookies } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';

export async function GET() {
  const auth = getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  if (auth.role === 'admin' && auth.userId === 0) {
    return ok({
      id: 0,
      name: '管理员',
      email: 'admin',
      role: 'admin',
      created_at: null
    });
  }

  const user = await query('SELECT id,name,email,role,created_at FROM users WHERE id=$1', [auth.userId]);
  if (!user.rowCount) return fail('Unauthorized', 401);
  return ok(user.rows[0]);
}

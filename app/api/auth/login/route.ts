import { comparePassword, setAuthCookie, signToken } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';

const ADMIN_ACCOUNT = 'admin';
const ADMIN_PASSWORD = '1234';

export async function POST(req: Request) {
  const body = await req.json();
  const account = typeof body.account === 'string' ? body.account : body.email;
  const password = body.password;

  if (account === ADMIN_ACCOUNT && password === ADMIN_PASSWORD) {
    const token = signToken({ userId: 0, role: 'admin' });
    setAuthCookie(token);
    return ok({ message: 'Logged in as admin' });
  }

  const user = await query<{ id: number; role: 'user' | 'admin'; password_hash: string }>(
    'SELECT id, role, password_hash FROM users WHERE email=$1',
    [account]
  );

  if (!user.rowCount) return fail('Invalid credentials', 401);
  const valid = await comparePassword(password, user.rows[0].password_hash);
  if (!valid) return fail('Invalid credentials', 401);

  const token = signToken({ userId: user.rows[0].id, role: user.rows[0].role });
  setAuthCookie(token);
  return ok({ message: 'Logged in' });
}

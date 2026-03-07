import { comparePassword, setAuthCookie, signToken } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await query<{ id: number; role: 'user' | 'admin'; password_hash: string }>(
    'SELECT id, role, password_hash FROM users WHERE email=$1',
    [email]
  );

  if (!user.rowCount) return fail('Invalid credentials', 401);
  const valid = await comparePassword(password, user.rows[0].password_hash);
  if (!valid) return fail('Invalid credentials', 401);

  const token = signToken({ userId: user.rows[0].id, role: user.rows[0].role });
  setAuthCookie(token);
  return ok({ message: 'Logged in' });
}

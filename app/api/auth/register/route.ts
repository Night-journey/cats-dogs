import { hashPassword } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;
  if (!name || !email || !password) return fail('Missing fields');

  const exists = await query('SELECT id FROM users WHERE email=$1', [email]);
  if (exists.rowCount) return fail('Email already exists', 409);

  const passwordHash = await hashPassword(password);
  const result = await query<{ id: number; email: string; role: 'user' | 'admin' }>(
    'INSERT INTO users(name, email, password_hash) VALUES($1,$2,$3) RETURNING id,email,role',
    [name, email, passwordHash]
  );

  return ok(result.rows[0], 201);
}

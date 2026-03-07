import { comparePassword, hashPassword, setAuthCookie, signToken } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';

type LoginUser = { id: number; role: 'user' | 'admin'; password_hash: string };

export async function POST(req: Request) {
  const { account, email, password } = await req.json();
  const loginAccount = account || email;

  if (!loginAccount || !password) return fail('缺少必要参数', 400);

  if (loginAccount === 'admin' && password === '1234') {
    let adminUser = await query<{ id: number; role: 'admin' }>('SELECT id, role FROM users WHERE email=$1 LIMIT 1', ['admin@local']);

    if (!adminUser.rowCount) {
      const passwordHash = await hashPassword('1234');
      adminUser = await query<{ id: number; role: 'admin' }>(
        'INSERT INTO users(name, email, password_hash, role) VALUES($1,$2,$3,$4) RETURNING id, role',
        ['管理员', 'admin@local', passwordHash, 'admin']
      );
    }

    const token = signToken({ userId: adminUser.rows[0].id, role: 'admin' });
    setAuthCookie(token);
    return ok({ message: '登录成功', role: 'admin', redirect: '/admin' });
  }

  const user = await query<LoginUser>('SELECT id, role, password_hash FROM users WHERE email=$1', [loginAccount]);

  if (!user.rowCount) return fail('账号或密码错误', 401);
  const valid = await comparePassword(password, user.rows[0].password_hash);
  if (!valid) return fail('账号或密码错误', 401);

  const role = user.rows[0].role;
  const token = signToken({ userId: user.rows[0].id, role });
  setAuthCookie(token);

  return ok({ message: '登录成功', role, redirect: role === 'admin' ? '/admin' : '/' });
}

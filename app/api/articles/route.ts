import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const result = await query('SELECT * FROM articles ORDER BY created_at DESC');
  return ok(result.rows);
}

export async function POST(req: Request) {
  const auth = getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return fail('无权限访问', 403);
  const body = await req.json();
  const created = await query(
    'INSERT INTO articles(title,content,category,author_id) VALUES($1,$2,$3,$4) RETURNING *',
    [body.title, body.content, body.category, auth.userId]
  );
  return ok(created.rows[0], 201);
}

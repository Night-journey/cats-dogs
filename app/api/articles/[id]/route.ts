import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const result = await query('SELECT * FROM articles WHERE id=$1', [params.id]);
  if (!result.rowCount) return fail('Not found', 404);
  return ok(result.rows[0]);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return fail('Forbidden', 403);
  const body = await req.json();
  const updated = await query(
    'UPDATE articles SET title=$1, content=$2, category=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
    [body.title, body.content, body.category, params.id]
  );
  return ok(updated.rows[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return fail('Forbidden', 403);
  await query('DELETE FROM articles WHERE id=$1', [params.id]);
  return ok({ message: 'Deleted' });
}

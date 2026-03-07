import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return fail('Forbidden', 403);

  const body = await req.json();
  const result = await query('UPDATE animal_notes SET status=$1 WHERE id=$2 RETURNING *', [body.status, params.id]);
  if (!result.rowCount) return fail('Not found', 404);
  return ok(result.rows[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth || auth.role !== 'admin') return fail('Forbidden', 403);

  const result = await query('DELETE FROM animal_notes WHERE id=$1 RETURNING id', [params.id]);
  if (!result.rowCount) return fail('Not found', 404);
  return ok({ message: 'Deleted' });
}

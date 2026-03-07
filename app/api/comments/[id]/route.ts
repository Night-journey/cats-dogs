import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const body = await req.json();
  const result = await query(
    'UPDATE comments SET content=$1 WHERE id=$2 AND (author_id=$3 OR $4=\'admin\') RETURNING *',
    [body.content, params.id, auth.userId, auth.role]
  );
  if (!result.rowCount) return fail('Not found or no permission', 404);
  return ok(result.rows[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const result = await query('DELETE FROM comments WHERE id=$1 AND (author_id=$2 OR $3=\'admin\') RETURNING id', [params.id, auth.userId, auth.role]);
  if (!result.rowCount) return fail('Not found or no permission', 404);
  return ok({ message: 'Deleted' });
}

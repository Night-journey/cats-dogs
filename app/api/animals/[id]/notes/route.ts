import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const result = await query(
    `SELECT n.*, u.name author
     FROM animal_notes n
     LEFT JOIN users u ON n.author_id=u.id
     WHERE n.animal_id=$1 ${isAdmin ? '' : "AND n.status='approved'"}
     ORDER BY n.created_at DESC`,
    [params.id]
  );
  return ok(result.rows);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const body = await req.json();
  const created = await query(
    'INSERT INTO animal_notes(animal_id,author_id,content,status) VALUES($1,$2,$3,$4) RETURNING *',
    [params.id, auth.userId, body.content, 'pending']
  );
  return ok(created.rows[0], 201);
}

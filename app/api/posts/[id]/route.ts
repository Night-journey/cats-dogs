import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const post = await query(
    `SELECT p.*, u.name author, COALESCE(l.like_count,0) likes_count
     FROM posts p
     LEFT JOIN users u ON p.author_id=u.id
     LEFT JOIN (SELECT post_id, COUNT(*) like_count FROM likes GROUP BY post_id) l ON l.post_id = p.id
     WHERE p.id=$1`,
    [params.id]
  );
  if (!post.rowCount) return fail('Not found', 404);
  const comments = await query(
    `SELECT c.*, u.name author FROM comments c
     LEFT JOIN users u ON c.author_id=u.id
     WHERE c.post_id=$1 ORDER BY c.created_at ASC`,
    [params.id]
  );
  return ok({ ...post.rows[0], comments: comments.rows });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);
  const result = await query('DELETE FROM posts WHERE id=$1 AND (author_id=$2 OR $3 =\'admin\')', [params.id, auth.userId, auth.role]);
  if (!result.rowCount) return fail('Not found or no permission', 404);
  return ok({ message: 'Deleted' });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const body = await req.json();
  const result = await query(
    'UPDATE posts SET title=$1, content=$2, image_urls=$3 WHERE id=$4 AND (author_id=$5 OR $6=\'admin\') RETURNING *',
    [body.title, body.content, body.image_urls || [], params.id, auth.userId, auth.role]
  );
  if (!result.rowCount) return fail('Not found or no permission', 404);
  return ok(result.rows[0]);
}

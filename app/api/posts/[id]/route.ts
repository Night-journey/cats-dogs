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
  if (!post.rowCount) return fail('未找到数据', 404);
  const comments = await query(
    `SELECT c.*, u.name author FROM comments c
     LEFT JOIN users u ON c.author_id=u.id
     WHERE c.post_id=$1 ORDER BY c.created_at ASC`,
    [params.id]
  );
  return ok({ ...post.rows[0], comments: comments.rows });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = getAuthFromCookies();
  if (!auth) return fail('未登录或登录已过期', 401);
  const result = await query('DELETE FROM posts WHERE id=$1 AND (author_id=$2 OR $3 =\'admin\')', [params.id, auth.userId, auth.role]);
  if (!result.rowCount) return fail('未找到内容或无权限', 404);
  return ok({ message: '删除成功' });
}

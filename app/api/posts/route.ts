import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/guards';

export async function GET() {
  const result = await query(
    `SELECT p.*, u.name author, COALESCE(l.like_count,0) likes_count
     FROM posts p
     LEFT JOIN users u ON p.author_id=u.id
     LEFT JOIN (SELECT post_id, COUNT(*) like_count FROM likes GROUP BY post_id) l ON l.post_id = p.id
     ORDER BY p.created_at DESC`
  );
  return ok(result.rows);
}

export async function POST(req: Request) {
  try {
    const auth = requireAuth();
    const body = await req.json();
    const created = await query(
      'INSERT INTO posts(title,content,image_urls,author_id) VALUES($1,$2,$3,$4) RETURNING *',
      [body.title, body.content, body.image_urls || [], auth.userId]
    );
    return ok(created.rows[0], 201);
  } catch {
    return fail('未登录或登录已过期', 401);
  }
}

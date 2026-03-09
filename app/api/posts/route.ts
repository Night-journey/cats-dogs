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
    const auth = await requireAuth();
    const body = await req.json();
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    const imageUrls = Array.isArray(body.image_urls) ? body.image_urls.filter((url: unknown) => typeof url === 'string' && url.trim()) : [];

    if (!title || !content) {
      return fail('标题和正文不能为空', 400);
    }
    if (imageUrls.length === 0) {
      return fail('帖子至少需要一张图片', 400);
    }

    const created = await query(
      'INSERT INTO posts(title,content,image_urls,author_id) VALUES($1,$2,$3,$4) RETURNING *',
      [title, content, imageUrls, auth.userId]
    );
    return ok(created.rows[0], 201);
  } catch (e) {
    console.error('POST /api/posts error:', e);
    return fail('Unauthorized', 401);
  }
}

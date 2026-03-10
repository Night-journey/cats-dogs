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
  // 添加 author_id 到返回数据
  return ok(result.rows.map((row: any) => ({ ...row, author_id: row.author_id })));
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

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return fail('缺少帖子ID', 400);
    }

    // 检查帖子是否存在以及是否是作者
    const post = await query('SELECT author_id FROM posts WHERE id=$1', [id]);
    if (!post.rowCount) {
      return fail('帖子不存在', 404);
    }

    // 允许作者或管理员删除
    if (post.rows[0].author_id !== auth.userId && auth.role !== 'admin') {
      return fail('没有权限删除此帖子', 403);
    }

    await query('DELETE FROM posts WHERE id=$1', [id]);
    return ok({ message: 'Deleted' });
  } catch (e) {
    console.error('DELETE /api/posts error:', e);
    return fail('Unauthorized', 401);
  }
}

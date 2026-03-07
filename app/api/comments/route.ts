import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/guards';

export async function POST(req: Request) {
  try {
    const auth = requireAuth();
    const body = await req.json();
    const result = await query(
      'INSERT INTO comments(post_id,author_id,content) VALUES($1,$2,$3) RETURNING *',
      [body.post_id, auth.userId, body.content]
    );
    return ok(result.rows[0], 201);
  } catch {
    return fail('Unauthorized', 401);
  }
}

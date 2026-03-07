import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/guards';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth();
    await query('INSERT INTO likes(post_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [params.id, auth.userId]);
    return ok({ message: 'Liked' });
  } catch {
    return fail('Unauthorized', 401);
  }
}

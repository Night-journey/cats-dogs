import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/guards';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const body = await req.json();
    const result = await query('UPDATE help_requests SET status=$1 WHERE id=$2 RETURNING *', [body.status, params.id]);
    return ok(result.rows[0]);
  } catch {
    return fail('Unauthorized', 401);
  }
}

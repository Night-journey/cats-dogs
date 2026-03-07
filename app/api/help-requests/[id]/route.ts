import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) return fail('Unauthorized', 401);
    const body = await req.json();

    if (auth.role !== 'admin') {
      const result = await query(
        'UPDATE help_requests SET status=$1 WHERE id=$2 AND author_id=$3 RETURNING *',
        [body.status, params.id, auth.userId]
      );
      if (!result.rowCount) return fail('Not found or no permission', 404);
      return ok(result.rows[0]);
    }

    const result = await query(
      `UPDATE help_requests
       SET title=COALESCE($1, title),
           description=COALESCE($2, description),
           type=COALESCE($3, type),
           location=COALESCE($4, location),
           contact_info=COALESCE($5, contact_info),
           image_urls=COALESCE($6, image_urls),
           status=COALESCE($7, status),
           urgent_level=COALESCE($8, urgent_level),
           is_pinned=COALESCE($9, is_pinned)
       WHERE id=$10 RETURNING *`,
      [body.title, body.description, body.type, body.location, body.contact_info, body.image_urls, body.status, body.urgent_level, body.is_pinned, params.id]
    );
    if (!result.rowCount) return fail('Not found', 404);
    return ok(result.rows[0]);
  } catch {
    return fail('Unauthorized', 401);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') return fail('Unauthorized', 401);
    const result = await query('DELETE FROM help_requests WHERE id=$1 RETURNING id', [params.id]);
    if (!result.rowCount) return fail('Not found', 404);
    return ok({ message: 'Deleted' });
  } catch {
    return fail('Unauthorized', 401);
  }
}

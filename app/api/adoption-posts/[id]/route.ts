import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);
  const body = await req.json();

  if (auth.role === 'admin') {
    const result = await query('UPDATE adoption_posts SET status=$1 WHERE id=$2 RETURNING *', [body.status, params.id]);
    if (!result.rowCount) return fail('Not found', 404);
    return ok(result.rows[0]);
  }

  const result = await query(
    `UPDATE adoption_posts
     SET title=COALESCE($1,title), animal_name=COALESCE($2,animal_name), species=COALESCE($3,species),
         health_info=COALESCE($4,health_info), description=COALESCE($5,description), contact_info=COALESCE($6,contact_info)
     WHERE id=$7 AND author_id=$8 RETURNING *`,
    [body.title, body.animal_name, body.species, body.health_info, body.description, body.contact_info, params.id, auth.userId]
  );
  if (!result.rowCount) return fail('Not found or no permission', 404);
  return ok(result.rows[0]);
}

import { fail, ok } from '@/lib/api';
import { query } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  if (!auth) return fail('Unauthorized', 401);

  const body = await req.json();
  const created = await query(
    `INSERT INTO animal_corrections(animal_id,proposer_id,field_name,suggested_value,reason,status)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [params.id, auth.userId, body.field_name, body.suggested_value, body.reason, 'pending']
  );
  return ok(created.rows[0], 201);
}
